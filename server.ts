import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { store } from "./src/app/store/Store";
import { Player } from "./src/app/store/Player";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Export io instance
export let io: Server;

app.prepare().then(() => {
  const httpServer = createServer(handler);
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("create-room", ({ name }) => {
      const host = new Player(socket.id, name, socket);
      const room = store.createRoom(host);
      socket.join(room.id)
      socket.emit("room-created", room.id);
    });

    socket.on("join-room", ({ name, roomId }) => {
      const player = new Player(socket.id, name, socket);
      const room = store.getRoom(roomId);
      socket.join(roomId);
      room?.addPlayer(player);
    });

    socket.on("start-game",({drawTime,rounds} : {drawTime : number,rounds : number})=>{
      const room = store.findRoomBySocketId(socket.id);
      if(room?.host.id!==socket.id)
      {
        socket.emit("error",{
          message : "Only host can start the game!"
        })
        return ;
      }
      room.startGame(drawTime,rounds)
    })

    socket.on("word-choosen",(word)=>{
      const room = store.findRoomBySocketId(socket.id);
      if(room?.players[room.currentTurnIndex].id !== socket.id)
      {
        socket.emit("error",{
          message : "It's not your turn"
        })
      }
      if (room?.wordSelectionTimer) {
        clearTimeout(room.wordSelectionTimer as NodeJS.Timeout);
      }
      room?.startDrawing(word);
    })


    socket.on("guess", ({ guess }) => {
      const room = store.findRoomBySocketId(socket.id);
      const player = room?.players.find(
        (player) => player.socket.id === socket.id
      );
      if (player?.guessed || room?.currentWord !== guess) {
        io.to(`${room?.id}`).emit("message", {
          name: player?.name,
          message: guess,
          color: "black",
        });
      } else {
        if (player) {
          player.guessed = true;
        }
        io.to(`${room?.id}`).emit("message", {
          name: "",
          message: `${name} guessed the word`,
          color: "green",
        });
        
        //if everyone guessed the word then clear the drawTimer
        if(room?.hasEveryoneGuessed)
        {
          if (room.drawTimer) {
            clearTimeout(room.drawTimer);
          }
          room?.endDrawingRound();
        }
      }
    });

    socket.on("disconnect", () => {
      const room = store.findRoomBySocketId(socket.id);
      room?.removePlayer(socket.id);
      if (room?.host.socket.id === socket.id && room.players.length === 1) {
        store.deleteRoom(room.id);
      } else room?.removePlayer(socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
