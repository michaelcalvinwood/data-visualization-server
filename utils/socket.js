const socketio = require('socket.io');

exports.initSocket = (server, handler) => {
  const options = {
    cors: {
      origin: '*'
    }
  };

  const io = socketio(server, options);

  io.on('connection', handler);

  return io;
};
