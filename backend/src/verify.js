const http = require('http');

const postRequest = (path, body) => {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(responseBody),
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(dataString);
    req.end();
  });
};

const getRequest = (path, token) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(responseBody),
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
};

async function runTests() {
  console.log('--- STARTING BACKEND API VERIFICATION SUITE ---');

  try {
    // 1. Test Health check
    console.log('\n[TEST 1] Querying health check...');
    const health = await getRequest('/api/health');
    console.log(`Response Code: ${health.statusCode}`);
    console.log(`Response Data:`, health.body);

    // 2. Test Admin Account Login
    console.log('\n[TEST 2] Verifying Admin account login...');
    const adminLogin = await postRequest('/api/auth/login', {
      email: 'admin@highiq.edu.ng',
      password: 'password123',
    });
    console.log(`Response Code: ${adminLogin.statusCode}`);
    console.log(`Logged in user:`, adminLogin.body.user);
    const adminToken = adminLogin.body.token;

    // 3. Test Teacher Account Login
    console.log('\n[TEST 3] Verifying Teacher account login...');
    const teacherLogin = await postRequest('/api/auth/login', {
      email: 'teacher@highiq.edu.ng',
      password: 'password123',
    });
    console.log(`Response Code: ${teacherLogin.statusCode}`);
    console.log(`Logged in user:`, teacherLogin.body.user);
    const teacherToken = teacherLogin.body.token;

    // 4. Test Student Account Login
    console.log('\n[TEST 4] Verifying Student account login...');
    const studentLogin = await postRequest('/api/auth/login', {
      email: 'student@highiq.edu.ng',
      password: 'password123',
    });
    console.log(`Response Code: ${studentLogin.statusCode}`);
    console.log(`Logged in user:`, studentLogin.body.user);
    const studentToken = studentLogin.body.token;

    // 5. Test Teacher Submitting Grade (Which triggers AI comments!)
    console.log('\n[TEST 5] Submitting Grade & Triggering AI report comments...');
    const gradeSubmit = await postRequest('/api/grades/submit', {
      studentId: studentLogin.body.user.id,
      subject: 'STEM Robotics',
      ca1: 18,
      ca2: 19,
      exam: 54,
      term: '1st Term',
      session: '2025/2026',
    });
    // Since studentLogin.body.user.id is the User ID, wait, does prisma require Student ID instead of User ID?
    // Let's check how the database handles it.
    console.log(`Response Code: ${gradeSubmit.statusCode}`);
    console.log(`Grade Submit result:`, gradeSubmit.body);

    console.log('\n--- VERIFICATION SUITE COMPLETE ---');
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

runTests();
