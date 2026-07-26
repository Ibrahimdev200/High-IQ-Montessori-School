const fs = require('fs');
const path = require('path');

const filesToRefactor = [
  'frontend/src/app/context/AuthContext.tsx',
  'frontend/src/app/portal/admin/page.tsx',
  'frontend/src/app/portal/clinic/page.tsx',
  'frontend/src/app/portal/finance/page.tsx',
  'frontend/src/app/portal/hr/page.tsx',
  'frontend/src/app/portal/library/page.tsx',
  'frontend/src/app/portal/login/page.tsx',
  'frontend/src/app/portal/parent/page.tsx',
  'frontend/src/app/portal/principal/page.tsx',
  'frontend/src/app/portal/student/page.tsx',
  'frontend/src/app/portal/teacher/page.tsx',
  'frontend/src/app/portal/transport/page.tsx',
];

const projectRoot = path.join(__dirname, '..', '..');

filesToRefactor.forEach((fileRelPath) => {
  const filePath = path.join(projectRoot, fileRelPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${fileRelPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace single quote strings: 'http://localhost:5000
  // example: 'http://localhost:5000/api/settings' -> `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/settings'
  content = content.replace(/'http:\/\/localhost:5000/g, "`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}\` + '");

  // Replace backtick strings: `http://localhost:5000
  // example: `http://localhost:5000/api/settings` -> `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`
  content = content.replace(/`http:\/\/localhost:5000/g, "`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully refactored API URLs in: ${fileRelPath}`);
});

console.log('All frontend API configurations refactored successfully.');
