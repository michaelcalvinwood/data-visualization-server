const { readFileSync } = require('fs');
const https = require('https');

const getSSLKeys = () => {
  const { NODE_ENV } = process.env;

  const isDev = NODE_ENV === 'dev';

  return {
    key: readFileSync(
      isDev ? './ssl/localhost-key.pem' : '/etc/ssl-keys/pymnts.com/pymnts.key'
    ),
    cert: readFileSync(
      isDev ? './ssl/localhost.pem' : '/etc/ssl-keys/pymnts.com/pymnts.com.pem'
    )
  };
};

exports.initServer = (app, port = 443) => {
  const sslKeys = getSSLKeys();

  const httpsServer = https.createServer(sslKeys, app);

  httpsServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${port}`);
  });

  return httpsServer;
};
