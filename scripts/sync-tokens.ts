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

// Tokens Studio 포맷에서 값 추출
interface TokenValue {
  $value: string;
  $type: string;
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup;
}

interface TokensFile {
  [setName: string]: TokenGroup;
}

// 토큰 그룹에서 플랫한 토큰 맵 추출
function flattenTokens(
  obj: TokenGroup,
  prefix = ''
): Record<string, { value: string; type: string }> {
  const result: Record<string, { value: string; type: string }> = {};

  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${toKebabCase(key)}` : toKebabCase(key);

    if (val && typeof val === 'object' && '$value' in val) {
      // 실제 토큰 값
      result[newKey] = {
        value: val.$value as string,
        type: val.$type as string,
      };
    } else if (val && typeof val === 'object') {
      // 중첩된 그룹
      Object.assign(result, flattenTokens(val as TokenGroup, newKey));
    }
  }

  return result;
}

// CSS 생성
function generateCSS(
  tokens: Record<string, { value: string; type: string }>
): string {
  let css = '/* Auto-generated from Figma Tokens Studio */\n';
  css += '/* Do not edit manually */\n\n';
  css += ':root {\n';

  for (const [name, { value, type }] of Object.entries(tokens)) {
    let cssValue = value;

    // 단위 추가 (spacing, borderRadius 등)
    if (['spacing', 'borderRadius'].includes(type) && !value.includes('px')) {
      cssValue = `${value}px`;
    }

    css += `  --${name}: ${cssValue};\n`;
  }

  css += '}\n';
  return css;
}

// TypeScript 생성
function generateTS(
  tokens: Record<string, { value: string; type: string }>
): string {
  let ts = '/* Auto-generated from Figma Tokens Studio */\n';
  ts += '/* Do not edit manually */\n\n';

  // 타입별로 그룹화
  const grouped: Record<string, Record<string, string>> = {};

  for (const [name, { type }] of Object.entries(tokens)) {
    const category = type === 'borderRadius' ? 'radius' : type;

    if (!grouped[category]) {
      grouped[category] = {};
    }

    // color-primary -> primary
    const shortName = name.replace(new RegExp(`^${category}-?`), '') || name;
    grouped[category][shortName] = `var(--${name})`;
  }

  // export 생성
  for (const [category, values] of Object.entries(grouped)) {
    ts += `export const ${category} = {\n`;
    for (const [key, value] of Object.entries(values)) {
      const safeKey = key.includes('-') ? `'${key}'` : key;
      ts += `  ${safeKey}: '${value}',\n`;
    }
    ts += '} as const;\n\n';
  }

  // 전체 토큰 객체도 export
  ts += 'export const tokens = {\n';
  for (const category of Object.keys(grouped)) {
    ts += `  ${category},\n`;
  }
  ts += '} as const;\n';

  return ts;
}

// 메인 실행
function main() {
  console.log('🎨 Syncing tokens from Figma...\n');

  // JSON 읽기
  const raw: TokensFile = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));

  // 모든 토큰 세트 병합 (main, etc.)
  let allTokens: Record<string, { value: string; type: string }> = {};

  for (const [setName, tokenGroup] of Object.entries(raw)) {
    console.log(`📦 Processing token set: ${setName}`);
    const flattened = flattenTokens(tokenGroup);
    allTokens = { ...allTokens, ...flattened };
  }

  console.log(`\n✅ Found ${Object.keys(allTokens).length} tokens\n`);

  // dist 폴더 생성
  fs.mkdirSync(DIST_PATH, { recursive: true });

  // CSS 생성
  const css = generateCSS(allTokens);
  fs.writeFileSync(path.join(DIST_PATH, 'tokens.css'), css);
  console.log('📄 Generated: tokens.css');

  // TypeScript 생성
  const ts = generateTS(allTokens);
  fs.writeFileSync(path.join(DIST_PATH, 'tokens.ts'), ts);
  console.log('📄 Generated: tokens.ts');

  // JSON 복사 (참조용)
  fs.writeFileSync(
    path.join(DIST_PATH, 'tokens.json'),
    JSON.stringify(allTokens, null, 2)
  );
  console.log('📄 Generated: tokens.json');

  console.log('\n🎉 Token sync complete!');
}

main();
