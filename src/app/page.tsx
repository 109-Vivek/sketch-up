"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Message } from "@/lib/types";
import { getSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import Game from "@/components/Game";
import Home from "@/components/Home";

export default function App() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages,setMessages] = useState<Message[]>([]);
  const [home,setHome] = useState<boolean>(true);
  const [event,setEvent] = useState<string>("create");

  
  useEffect(()=>{
    const skt = getSocket();
    setSocket(skt);

    if (!skt) {
      toast.error("Failed to initialize socket connection");
      router.push("/");
      return;
    }

    function handleMessage(data: Message) {
      const { name, message, color } = data;
      setMessages((prev) => [...prev, { name, message, color }]);
    }

    function handleError(message : string){
      toast.error(message);
    }


    if(skt){
      skt.on("message",handleMessage);
      skt.on("error",handleError);
    }

    return ()=>{
      skt.off("message",handleMessage);
      skt.off("error",handleError);
    }
  },[])

  if(home) return <Home name={name} setName={setName} roomId={roomId} setRoomId={setRoomId} setHome={setHome} setEvent={setEvent} />
  else return <Game event={event} setEvent={setEvent} name={name} roomId={roomId} setHome={setHome} setRoomId={setRoomId} messages={messages} setMessages={setMessages}/>
}

