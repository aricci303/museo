const express = require('express');
const app = express();
const path = require('path')
const { WebSocketServer } = require('ws')

const sockserver = new WebSocketServer({ port: 443 })

const port = 3000;

let channel

app.use('/static', express.static(path.join(__dirname, 'public')))

app.post('/play', (req, res) => {
    console.log("play");
    sockserver.clients.forEach(client => {
        console.log("distributing playing...: ")
        client.send("play")
      })
    res.send('ok');
  });

  app.post('/pause', (req, res) => {
    console.log("play");
    sockserver.clients.forEach(client => {
        console.log("distributing playing...: ")
        client.send("pause")
      })
    res.send('ok');
  });

app.get('/', (req, res) => {
  res.send('Hello from MuseumPlayground!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})

sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', data => {
      sockserver.clients.forEach(client => {
        console.log(`distributing message: ${data}`)
        client.send(`${data}`)
      })
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
   })