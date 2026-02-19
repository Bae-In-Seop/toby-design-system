import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const RAW_PATH = path.join(ROOT, 'packages/tokens/raw/tokens.json');
const DIST_PATH = path.join(ROOT, 'packages/tokens/dist');

// kebab-case 변환 (camelCase -> kebab-case)
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// kebab-case -> camelCase 변환
function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// Tokens Studio 포맷에서 값 추출
interface TokenValue {
  $value: string;
  $type: string;
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup;
}

interface TokensFile {
  primitive: TokenGroup;
  light: TokenGroup;
  dark: TokenGroup;
}

type FlatTokens = Record<string, { value: string; type: string }>;

// 토큰 그룹에서 플랫한 토큰 맵 추출
function flattenTokens(obj: TokenGroup, prefix = ''): FlatTokens {
  const result: FlatTokens = {};

  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${toKebabCase(key)}` : toKebabCase(key);

    if (val && typeof val === 'object' && '$value' in val) {
      result[newKey] = {
        value: val.$value as string,
        type: val.$type as string,
      };
    } else if (val && typeof val === 'object') {
      Object.assign(result, flattenTokens(val as TokenGroup, newKey));
    }
  }

  return result;
}

// CSS 변수 블록 생성 (셀렉터 안의 내용만)
function tokensToCSSBlock(tokens: FlatTokens): string {
  let block = '';
  for (const [name, { value, type }] of Object.entries(tokens)) {
    let cssValue = value;
    if (['spacing', 'borderRadius', 'fontSize'].includes(type) && !value.includes('px')) {
      cssValue = `${value}px`;
    }
    block += `  --${name}: ${cssValue};\n`;
  }
  return block;
}

// CSS 생성 — primitive(:root) + light(:root) + dark([data-theme="dark"])
function generateCSS(primitive: FlatTokens, light: FlatTokens, dark: FlatTokens): string {
  let css = '/* Auto-generated from Figma Tokens Studio */\n';
  css += '/* Do not edit manually */\n\n';

  css += '/* ===== Primitive Tokens (theme-independent) ===== */\n';
  css += ':root {\n';
  css += tokensToCSSBlock(primitive);
  css += '}\n\n';

  css += '/* ===== Semantic Tokens — Light (default) ===== */\n';
  css += ':root {\n';
  css += tokensToCSSBlock(light);
  css += '}\n\n';

  css += '/* ===== Semantic Tokens — Dark ===== */\n';
  css += '[data-theme="dark"] {\n';
  css += tokensToCSSBlock(dark);
  css += '}\n';

  return css;
}

// TypeScript 생성
function generateTS(primitive: FlatTokens, light: FlatTokens, dark: FlatTokens): string {
  let ts = '/* Auto-generated from Figma Tokens Studio */\n';
  ts += '/* Do not edit manually */\n\n';

  // primitive 토큰을 타입별로 그룹화
  const grouped: Record<string, Record<string, string>> = {};
  for (const [name, { type }] of Object.entries(primitive)) {
    const category = type === 'borderRadius' ? 'radius' : type;
    if (!grouped[category]) grouped[category] = {};
    const categoryKebab = toKebabCase(category);
    const shortName = name.replace(new RegExp(`^${categoryKebab}-?`), '') || name;
    const camelKey = toCamelCase(shortName);
    grouped[category][camelKey] = `var(--${name})`;
  }

  for (const [category, values] of Object.entries(grouped)) {
    ts += `export const ${category} = {\n`;
    for (const [key, value] of Object.entries(values)) {
      const safeKey = key.includes('-') || /^\d/.test(key) ? `'${key}'` : key;
      ts += `  ${safeKey}: '${value}',\n`;
    }
    ts += '} as const;\n\n';
  }

  // 시맨틱 토큰 (light/dark) export
  function themeExport(tokens: FlatTokens): string {
    const themeGrouped: Record<string, Record<string, string>> = {};
    for (const [name, { type }] of Object.entries(tokens)) {
      const category = type === 'borderRadius' ? 'radius' : type;
      if (!themeGrouped[category]) themeGrouped[category] = {};
      const categoryKebab = toKebabCase(category);
      const shortName = name.replace(new RegExp(`^${categoryKebab}-?`), '') || name;
      const camelKey = toCamelCase(shortName);
      themeGrouped[category][camelKey] = `var(--${name})`;
    }
    const lines: string[] = [];
    for (const [category, values] of Object.entries(themeGrouped)) {
      lines.push(`  ${category}: {`);
      for (const [key, value] of Object.entries(values)) {
        const safeKey = key.includes('-') || /^\d/.test(key) ? `'${key}'` : key;
        lines.push(`    ${safeKey}: '${value}',`);
      }
      lines.push('  },');
    }
    return lines.join('\n');
  }

  ts += `export const lightTheme = {\n${themeExport(light)}\n} as const;\n\n`;
  ts += `export const darkTheme = {\n${themeExport(dark)}\n} as const;\n\n`;

  // 전체 export
  ts += 'export const tokens = {\n';
  for (const category of Object.keys(grouped)) {
    ts += `  ${category},\n`;
  }
  ts += '  light: lightTheme,\n';
  ts += '  dark: darkTheme,\n';
  ts += '} as const;\n';

  return ts;
}

// 메인 실행
function main() {
  console.log('🎨 Syncing tokens from Figma...\n');

  const raw: TokensFile = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));

  // 3개 레이어 각각 flatten
  const primitive = flattenTokens(raw.primitive);
  const light = flattenTokens(raw.light);
  const dark = flattenTokens(raw.dark);

  console.log(`📦 Primitive tokens: ${Object.keys(primitive).length}`);
  console.log(`🌞 Light theme tokens: ${Object.keys(light).length}`);
  console.log(`🌙 Dark theme tokens: ${Object.keys(dark).length}`);

  const total = Object.keys(primitive).length + Object.keys(light).length + Object.keys(dark).length;
  console.log(`\n✅ Total: ${total} tokens\n`);

  // dist 폴더 생성
  fs.mkdirSync(DIST_PATH, { recursive: true });

  // CSS 생성
  const css = generateCSS(primitive, light, dark);
  fs.writeFileSync(path.join(DIST_PATH, 'tokens.css'), css);
  console.log('📄 Generated: tokens.css');

  // TypeScript 생성
  const ts = generateTS(primitive, light, dark);
  fs.writeFileSync(path.join(DIST_PATH, 'tokens.ts'), ts);
  console.log('📄 Generated: tokens.ts');

  // JSON 복사 (참조용)
  const allTokens = { primitive, light, dark };
  fs.writeFileSync(
    path.join(DIST_PATH, 'tokens.json'),
    JSON.stringify(allTokens, null, 2)
  );
  console.log('📄 Generated: tokens.json');

  console.log('\n🎉 Token sync complete!');
}

main();
