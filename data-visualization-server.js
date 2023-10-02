const cors = require('cors');
const express = require('express');
const { initServer } = require('./utils/server');
const { initSocket } = require('./utils/socket');
const { getUniversalData, getSingleChartData } = require('./filters');

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: '200mb'
  })
);

const server = initServer(app);

const io = initSocket(server, socket => {
  console.log('A user connected =>', socket.id);

  socket.on('initFilters', async () => {
    socket.emit('initFilters', await getUniversalData());
  });

  socket.on('getSingleChartData', async filters => {
    socket.emit('getSingleChartData', await getSingleChartData(filters));
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected =>', socket.id);
  });
});
