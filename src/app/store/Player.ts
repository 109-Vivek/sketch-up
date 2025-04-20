import { Socket } from "socket.io";

export class Player {
    id : string;
    name: string;
    score: number = 0;
    socket : Socket;
    guessed : boolean = false;
    isDrawing : boolean = false;
    isChoosingWord : boolean = false;
    guessTimestamp : number | null = null;
    roundScore : number = 0;
    
    constructor(id: string, name: string,socket:Socket) {
        this.id = id;
        this.name = name;
        this.socket = socket
    }
  
    resetScore(): void {
        this.score = 0;
    }
}
