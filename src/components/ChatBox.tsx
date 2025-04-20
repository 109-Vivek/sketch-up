import { Message } from "@/lib/types";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

export default function ChatBox({messages} : {messages : Message[]}) {
  const [guess, setGuess] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleSendGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      socket?.emit("guess", { guess });
      setGuess("");
    }
  };

  useEffect(() => {
    const skt = getSocket();
    setSocket(skt);

    return () => {
      if (skt) {
        //
      }
    };
  }, []);

  return (
    <div className="w-80 flex flex-col bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-100 border-b">
        <h2 className="font-bold">Chat</h2>
      </div>

      <div className="flex-1 p-4 overflow-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{ backgroundColor: msg.color }}
            className={`p-2 rounded text-white`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendGuess} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your guess here..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
