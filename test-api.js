const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign({ sub: "819a59ee-1a9c-411a-9e19-c61de35f0e60", role: "CUSTOMER" }, "pointdrop-super-secret-key");

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/transactions/me',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => { console.log("RESPONSE:", data); });
});

req.on('error', error => { console.error(error); });
req.end();
