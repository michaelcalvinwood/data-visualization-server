const listenPort = 443;
const hostname = 'dv-sql.pymnts.com'
const privateKeyPath = `/etc/ssl-keys/pymnts.com/pymnts.key`;
const fullchainPath = `/etc/ssl-keys/pymnts.com/pymnts.com.pem`;

const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
socketio = require('socket.io');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  

  httpsServer.listen(listenPort, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${listenPort}`);
});

/*
 * SocketIo Server
 */

const io = socketio(httpsServer, {cors: {origin: "*"}});

io.on('connection', (socket) => {
  console.log('socketio connection', socket.id);
  socket.on('echo', (msg) => socket.emit('echo', msg));
});

