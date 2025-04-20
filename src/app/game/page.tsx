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
import { Message } from "@/lib/types";

export default function GameRoom({ params }: { params: { roomId: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const event = searchParams.get("event");
  const name = searchParams.get("name");
  const [roomId,setRoomId] = useState<string | null>(null);

  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [show, setShow] = useState<string>("settings");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);


  useEffect(() => {
    const skt = getSocket();
    setSocket(skt);
    
    if (!skt) {
      toast.error("Failed to initialize socket connection");
      router.push("/");
      return;
    }

    if (event === "create" && name && !roomId) {  // Handle room creation
      skt.emit("create-room", { name });
      skt.on("room-created", (roomId: string) => {
        setRoomId(roomId);
      });
    }
    else if (event === "join" && name) {  // Handle room joining
      setRoomId(searchParams.get("roomId"));
      skt.emit("join-room", { name, roomId: params.roomId });
    }
    else {
      toast.error("Invalid event or parameters");
      router.push("/");
    }

    function handleMessage(data: Message) {
      const { name, message, color } = data;
      setMessages((prev) => [...prev, { name, message, color }]);
    }

    const handleChooseWord = (words: string[]) => {
      // Implement word selection logic here
      console.log("Words to choose from:", words);
    };

    if(skt)
    {
      skt.on("message",handleMessage ); 
      skt.on("choose-word", handleChooseWord);
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
      skt.off("choose-word", handleChooseWord);
      skt.off("room-created");
      skt.off("message",handleMessage);//remove later
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
        {/* <LeaderBoard /> */}
        <Outlet show={"settings"} />
        <ChatBox messages={messages} />
      </div>
    </div>
  );
}