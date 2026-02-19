import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TEMPLATES_PATH = path.join(ROOT, 'templates');
const UI_PATH = path.join(ROOT, 'packages/ui/src');

// 컴포넌트 이름 받기
const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: pnpm generate <ComponentName>');
  console.error('Example: pnpm generate Button');
  process.exit(1);
}

// PascalCase 검증
if (!/^[A-Z][a-zA-Z]*$/.test(componentName)) {
  console.error('Component name must be PascalCase (e.g. Button, TextInput)');
  process.exit(1);
}

// camelCase 변환 (Button -> button, TextInput -> textInput)
const camelName = componentName.charAt(0).toLowerCase() + componentName.slice(1);

// 이미 존재하는지 확인
const componentDir = path.join(UI_PATH, componentName);
if (fs.existsSync(componentDir)) {
  console.error(`Component "${componentName}" already exists at ${componentDir}`);
  process.exit(1);
}

// 템플릿 → 파일 매핑
const templates = [
  { template: 'Component.tsx.hbs', output: `${componentName}.tsx` },
  { template: 'Component.module.css.hbs', output: `${componentName}.module.css` },
  { template: 'Component.stories.tsx.hbs', output: `${componentName}.stories.tsx` },
  { template: 'Component.test.tsx.hbs', output: `${componentName}.test.tsx` },
  { template: 'index.ts.hbs', output: 'index.ts' },
];

// 폴더 생성
fs.mkdirSync(componentDir, { recursive: true });

// 각 템플릿 처리
for (const { template, output } of templates) {
  const templateContent = fs.readFileSync(
    path.join(TEMPLATES_PATH, template),
    'utf-8'
  );
  const result = templateContent
    .replace(/\{\{name\}\}/g, componentName)
    .replace(/\{\{camelName\}\}/g, camelName);

  fs.writeFileSync(path.join(componentDir, output), result);
  console.log(`  Created: ${componentName}/${output}`);
}

console.log(`\nComponent "${componentName}" generated at packages/ui/src/${componentName}/`);
