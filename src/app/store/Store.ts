import { Room } from "./Room";
import { Player } from "./Player";
import { io } from "../../../server";

class Store {
  private store: Map<string, Room>;
  private globalRoomId: number = 0;

  constructor() {
    this.store = new Map<string, Room>();
  }

  getRoom(roomId: string) {
    return this.store.get(roomId);
  }

  createRoom(host: Player) {
    const roomId = (this.globalRoomId++).toString();
    const room = new Room(roomId, host);
    this.store.set(roomId, room);
    io.socketsJoin(roomId); 
    return room;
  }

  deleteRoom(roomId: string) {
    const room = this.store.get(roomId);
    if (!room) return;
    this.store.delete(roomId);
  }

  findRoomBySocketId(socketId: string) {
    for (const room of this.store.values()) {
      if (room.players.some((player) => player.socket.id === socketId)) {
        return room;
      }
    }
  }
}

export const store = new Store();
