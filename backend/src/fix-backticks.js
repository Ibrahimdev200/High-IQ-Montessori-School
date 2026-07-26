const fs = require('fs');
const path = require('path');

const filesToFix = [
  'frontend/src/app/portal/principal/page.tsx',
  'frontend/src/app/portal/student/page.tsx',
  'frontend/src/app/portal/teacher/page.tsx',
  'frontend/src/app/portal/transport/page.tsx',
];

const projectRoot = path.join(__dirname, '..', '..');

filesToFix.forEach((fileRelPath) => {
  const filePath = path.join(projectRoot, fileRelPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileRelPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace }`/api/ with }/api/ to correct template strings
  content = content.replace(/\}`\/api\//g, "}/api/");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed backticks syntax in: ${fileRelPath}`);
});

console.log('Template string syntax fix complete.');
