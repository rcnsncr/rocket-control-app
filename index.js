const express = require("express")
const app = express()
require("dotenv").config()
const http = require("http").createServer(app)
const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

var ApiFecthController = require('./controllers/ApiFecthController');
var NetSocketController = require('./controllers/NetSocketController');

const delayData = 3000;
const delaySocket = 3250;

var Data

let loadDatas = async () => {
    try {
        var w = await ApiFecthController.fetchWeather();
        var rL = await ApiFecthController.fetchRockets();
        if (rL != null && Array.isArray(rL)) {
            var teleData = await NetSocketController.startListenSocket(rL);
            if (teleData) {
                Data = {
                    "weather": w,
                    "rockets": teleData
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

let repeatFunc = async () => {
    await loadDatas();
    setTimeout(async () => {
        await loadDatas();
        console.log("Datas loaded!!!");
        repeatFunc();
    }, delayData);
}

repeatFunc();

io.cor
io.on("connection", (socket) => {
  console.log("Start new connection!");
  let socketPoller = () => {
      socket.emit('r-data', Data)
      setTimeout(() => {
          socket.emit('r-data', Data)
          console.log("Sent data to connection!");
          socketPoller()
      }, delaySocket);
  }

  socketPoller()

  socket.on("disconnect", () => {
      console.log("Connection failed!");
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT;
http.listen(PORT, () =>console.log(`Server running on port: http://localhost:${PORT}`));
