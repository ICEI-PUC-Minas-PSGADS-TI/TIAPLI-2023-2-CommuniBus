// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const cors = require('cors');
// const redis = require('redis'); 

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// const redisClient = redis.createClient();


// io.on('connection', (socket) => {
//   console.log('New WebSocket Connection');

//   // Envia os post-its existentes para novas conexões
//   redisClient.lrange('postits', 0, -1, (err, postits) => {
//     if (err) {
//       console.error('Erro ao recuperar os post-its:', err);
//       return;
//     }
//     socket.emit('postits', postits);
//   });

//   // Escuta por novos post-its e transmite para todos os clientes
//   socket.on('sendMessage', (data) => {
//     io.emit('receiveMessage', data); // Transmita para todos os clientes
//     redisClient.rpush('postits', data, (err) => {
//       if (err) {
//         console.error('Erro ao salvar o post-it:', err);
//       }
//     });
//   });
// });

// const PORT = process.env.PORT || 5500;
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

//   // // Limpa todos os dados do banco de dados atual
//   // redisClient.flushall()
//   //   .then(() => {
//   //     console.log('Dados do banco de dados limpos com sucesso!');
//   //   })
//   //   .catch((error) => {
//   //     console.error('Erro ao limpar os dados do banco de dados:', error);
//   //   });


