const chatModel = require('../models/chatModel');

const hourDate = () => {
  const date = new Date();
  const dmy = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  const hourMinS = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `${dmy} ${hourMinS}`;
};

const onlineUsers = {};

module.exports = (io) => io.on('connection', async (socket) => {
  onlineUsers[socket.id] = `Anonimo-${socket.id.slice(0, 8)}`;
  io.emit('updateOnlineList', onlineUsers);

  socket.on('message', async ({ chatMessage, nickname }) => {
    await chatModel.saveMessage({ message: chatMessage, nickname, timestamp: hourDate() });
    io.emit('message', `${hourDate()} - ${nickname}: ${chatMessage}`);
  });

  socket.on('updateName', ({ nick, id }) => { 
    onlineUsers[id] = nick; 
    io.emit('updateOnlineList', onlineUsers);
  });

  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('updateOnlineList', onlineUsers);
  });
});
