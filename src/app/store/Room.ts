import { io } from "../../../server";
import { Player } from "./Player";

const defaultWords = [
  "Darshan",
  "Vivek",
  "Chhipa",
  "Chirag",
  "Akshat",
  "Shrey",
];

export class Room {
  id: string;
  rounds: number = 3;
  drawTime: number = 80;
  host: Player;
  players: Player[] = [];
  words: string[] = defaultWords;
  currRound: number = 1;
  currentWord: string = "";
  currentTurnIndex: number = 0;
  isGameActive: boolean = false;

  wordChoices: string[] = [];
  wordSelectionTimer: NodeJS.Timeout | null = null;
  drawStartTime: number = 0;
  drawTimer: NodeJS.Timeout | null = null;

  constructor(roomId: string, host: Player) {
    this.id = roomId;
    this.host = host;
    this.addPlayer(host);
  }

  addPlayer(player: Player) {
    if (this.isGameActive) {
      io.to(this.id).emit("error", {
        message: "Game is already running",
      });
      return;
    }
    this.players.push(player);
    io.to(this.id).emit("message", {
      name: "",
      message: `${player.name} joined the room`,
      color: "green",
    });
    this.sendLeaderBoard();
  }

  removePlayer(socketId: string) {
    const player = this.players.find((p) => p.socket.id === socketId);
    if (!player) return;

    const index = this.players.indexOf(player);
    this.players.splice(index, 1);

    io.to(this.id).emit("message", {
      name: "",
      message: `${player.name} left the room!`,
      color: "red",
    });

    if (index === this.currentTurnIndex && this.isGameActive) {
      clearTimeout(this.wordSelectionTimer!);
      clearTimeout(this.drawTimer!);
      this.changeTurn();
    } else if (index < this.currentTurnIndex) {
      this.currentTurnIndex--;
    }

    if (player === this.host && this.players.length > 0) {
      this.changeHost();
    }
    this.sendLeaderBoard();
  }

  changeHost() {
    const newHostIndex =
      (this.players.indexOf(this.host) + 1) % this.players.length;
    this.host = this.players[newHostIndex];
    io.to(this.id).emit("message", {
      name: "",
      message: `${this.host.name} is host now!`,
      color: "orange",
    });
  }

  getThreeRandomWords() {
    return [...this.words].sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  startGame(drawTime: number, rounds: number) {
    if (this.players.length < 2) {
      io.to(this.id).emit("error", {
        message: "There should be a minimum of two players",
      });
      return;
    }
    if (this.isGameActive) {
      io.to(this.id).emit("error", {
        message: "Game is already running",
      });
      return;
    }
    this.drawTime = drawTime;
    this.rounds = rounds;
    this.isGameActive = true;
    this.startTurn();
  }

  changeTurn() {
    if (this.players.length === 0) return;

    // Reset drawing state
    this.players.forEach((p) => {
      p.isDrawing = false;
      p.guessTimestamp = 0;
      p.roundScore = 0;
      p.guessed = false;
    });

    if (this.currentTurnIndex >= this.players.length - 1) {
      this.currentTurnIndex = 0;
      this.currRound++;
      if (this.currRound > this.rounds) {
        this.endGame();
        return;
      }
    } else {
      this.currentTurnIndex++;
    }
    this.startTurn();
  }

  startTurn() {
    this.startWordSelection();
  }

  startWordSelection(){
    const drawer = this.players[this.currentTurnIndex];
    drawer.isChoosingWord = true;
    this.wordChoices = this.getThreeRandomWords();
    io.to(this.id).except(drawer.id).emit('word-selection', drawer.name);
    drawer.socket.emit("choose-word",this.wordChoices);

    this.wordSelectionTimer = setTimeout(() => {
      const randomWord =
        this.wordChoices[Math.floor(Math.random() * this.wordChoices.length)];
      this.startDrawing(randomWord);
    }, 15000);

    this.sendLeaderBoard();
  }

  hasEveryoneGuessed(){
    this.players.forEach((player)=>{
      if(!player.guessed && player.id !== this.players[this.currentTurnIndex].id ) return false;
    })
    return true;
  }


  startDrawing(word: string) {
    const drawer = this.players[this.currentTurnIndex];
    drawer.isDrawing = true;
    
    this.currentWord = word;
    this.drawStartTime = new Date().getTime();
    drawer.socket.emit("start-drawing", { word });
    const dummy : string[] = [];
    io.to(this.id).except(drawer.id).emit("show-canvas",{wordLength : this.currentWord.length })
    this.drawTimer = setTimeout(()=>{
      this.endDrawingRound();
    },this.drawTime*1000)
  }

  endDrawingRound() {
    this.calculateScore();
    this.pushRoundResults();
    this.sendLeaderBoard();
    this.changeTurn();
    
  }

  calculateScore() {
    this.players.forEach((player) => {
      if (player.isDrawing) return;
      const timeTaken = player.guessTimestamp
        ? player.guessTimestamp - this.drawStartTime
        : this.drawTime * 1000;
      const clamped = Math.max(0, Math.min(timeTaken, this.drawTime * 1000));
      player.roundScore = Math.round(
        ((this.drawTime * 1000 - clamped) * 4) / 1000
      );
      player.score += player.roundScore;
    });
  }

  pushRoundResults() {
    const temp = this.players.map((p) => ({
      name: p.name,
      roundScore: p.roundScore,
    }));
    io.to(this.id).emit("round-result",temp);
  }

  pushWinners() {
    const winners = [...this.players]
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(3, this.players.length))
      .map((player) => ({
        id: player.id,
        name: player.name,
        score: player.score,
      }));
    io.to(this.id).emit("winners", { winners });
  }

  resetDefaults() {
    this.currRound = 1;
    this.currentWord = "";
    this.currentTurnIndex = 0;
    this.isGameActive = false;
    this.wordChoices = [];
    this.drawStartTime = 0;
    clearTimeout(this.wordSelectionTimer!);
    clearTimeout(this.drawTimer!);
    this.wordSelectionTimer = null;
    this.drawTimer = null;
  }

  endGame() {
    this.pushWinners();
    this.resetDefaults();
  }

  sendLeaderBoard() {
    const leaderboard = [...this.players]
      .sort((a, b) => b.score - a.score)
      .map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        isDrawing: p.isDrawing,
      }));
    io.to(this.id).emit("update-leaderboard", { players: leaderboard });
  }

  getPlayer(playerId: string) {
    return this.players.find((player) => player.id === playerId);
  }

  getAllPlayers() {
    return this.players;
  }
}
