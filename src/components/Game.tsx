"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";
import { toast } from "react-toastify";
import Outlet from "@/components/Outlet";
import LeaderBoard from "@/components/Leaderboard";
import ChatBox from "@/components/ChatBox";
import { useRouter, useSearchParams } from "next/navigation";
import { Message, Player } from "@/lib/types";

interface GameProps {
  name: string;
  event: string;
  roomId: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  setHome: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function Game({
  name,
  event,
  roomId,
  setRoomId,
  messages,
  setMessages,
  setHome,
}: GameProps) {

  const router = useRouter();
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [show, setShow] = useState<string>("settings");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players,setPlayers] = useState<Player[]>([]);
  const [wordChoices,setWordChoices] = useState<string[]>([]);
  const [drawerName,setDrawerName] = useState<string>("");
  const [word,setWord] = useState<string>("");
  const [wordLength,setWordLength] = useState<number>(0); 
  const [winners,setWinners]= useState<Player[]>([]);

  useEffect(() => {
    const skt = getSocket();
    setSocket(skt);

    if (!skt) {
      toast.error("Failed to initialize socket connection");
      router.push("/");
      return;
    }

    if (event === "create" && name && !roomId) {
      // Handle room creation
      skt.emit("create-room", { name });
      skt.on("room-created", (roomId: string) => {
        setRoomId(roomId);
      });
     
    } else if (event === "join" && name) {
      // Handle room joining
      skt.emit("join-room", { name, roomId });
    } else {
      toast.error("Invalid event or parameters");
      router.push("/");
    }

    const handleError = (message: string) => {
      toast.error(message);
    };

    const handleChooseWord = (words: string[]) => {
        setWordChoices(words);
        setShow("choose-word");
    };

    const updateLeaderboard = ({players} : {players : Player[]})=>{
        setPlayers(players);
    }

    const showWordSelection = (drawer: string)=>{
      setDrawerName(drawer);
      setShow("word-selection");
    }
    const handleStartDrawing = (word:string)=>{
      setWord(word)
      setShow("draw-canvas");
    }
    const handleShowCanvas = ({wordLength}: {wordLength : number})=>{
      setWordLength(wordLength)
      setShow("canvas");
    }
    const handleShowWinners = ({winners}:{winners : Player[]})=>{
      setWinners(winners);
      setShow("winners");
    }

    if (skt) {
      skt.on("choose-word", handleChooseWord);
      skt.on("error", handleError);
      skt.on("update-leaderboard",updateLeaderboard);
      skt.on("word-selection",showWordSelection);
      skt.on("start-drawing",handleStartDrawing)
      skt.on("show-canvas",handleShowCanvas);
      skt.on("winners",handleShowWinners);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      skt.off("error", handleError);
      skt.off("choose-word", handleChooseWord);
      skt.off("room-created");
      skt.off("update-leaderboard",updateLeaderboard)
      skt.off("word-selection",showWordSelection);
      skt.off("start-drawing",handleStartDrawing);
      skt.off("show-canvas",handleShowCanvas);
      skt.off("winners",handleShowWinners)
    };
  }, [event, name, router]);

  if (!socket) {
    return null; // or a loading state
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
    >
      <header className="bg-white/10 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-white font-bold">Draw.io</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full px-4 py-1 text-white">
            Room: {roomId}
          </div>
          <div className="bg-white/20 rounded-full px-4 py-1 text-white">
            Round: {round}/{totalRounds}
          </div>
          <div className="bg-yellow-500 rounded-full px-4 py-1 text-white font-bold">
            {timeLeft}s
          </div>
        </div>
      </header>

      <div className="flex flex-1 p-4 gap-4 max-h-[calc(100vh-80px)]">
        <LeaderBoard players={players} />
        <Outlet show={show} wordChoices={wordChoices} drawerName={drawerName} word={word} wordLength={wordLength} winners={winners} />
        <ChatBox messages={messages} />
      </div>
    </div>
  );
}
