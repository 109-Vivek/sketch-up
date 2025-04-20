import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Users } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface HomeProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  setEvent: React.Dispatch<React.SetStateAction<string>>;
  setHome: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home({ name, setName, roomId, setRoomId, setEvent, setHome }: HomeProps) {
  const router = useRouter();
  const [error, setError] = useState({ name: "", roomId: "" });

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <BackgroundPattern />
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-8 px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            <span className="text-yellow-300">S</span>
            <span className="text-green-300">k</span>
            <span className="text-pink-300">e</span>
            <span className="text-purple-300">t</span>
            <span className="text-white">c</span>
            <span className="text-orange-300">h</span>
            <span className="text-cyan-300">-</span>
            <span className="text-yellow-300">U</span>
            <span className="text-green-300">p</span>
          </h1>
          <Pencil className="h-10 w-10 text-yellow-300 animate-bounce" />
        </div>

        <p className="text-white text-xl max-w-md text-center">
          Draw, guess, and have fun with friends in this multiplayer drawing game!
        </p>

        <div className="w-full max-w-md space-y-4">
          <h2 className="text-white text-lg font-semibold">Create a New Room</h2>
          <div className="space-y-2">
            <label htmlFor="create-name" className="text-sm font-medium text-white">
              Your Name
            </label>
            <Input
              id="create-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError((prev) => ({ ...prev, name: e.target.value ? "" : prev.name }));
              }}
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>
          <Button
            className="w-full h-16 text-lg bg-purple-500 hover:bg-purple-600 shadow-lg transition-all hover:scale-105"
            onClick={() => {
              if (!name) {
                setError((prev) => ({ ...prev, name: "Please enter your name first." }));
                return;
              }
              setEvent("create");
              setHome(false);
            }}
          >
            <Pencil className="mr-2 h-5 w-5" />
            Create Room
          </Button>
        </div>

        <div className="w-full max-w-md space-y-4">
          <h2 className="text-white text-lg font-semibold">Join an Existing Room</h2>
          <div className="space-y-2">
            <label htmlFor="join-name" className="text-sm font-medium text-white">
              Your Name
            </label>
            <Input
              id="join-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError((prev) => ({ ...prev, name: e.target.value ? "" : prev.name }));
              }}
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="roomId" className="text-sm font-medium text-white">
              Room ID
            </label>
            <Input
              id="roomId"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                setError((prev) => ({ ...prev, roomId: e.target.value ? "" : prev.roomId }));
              }}
            />
            {error.roomId && <p className="text-red-500 text-sm">{error.roomId}</p>}
          </div>
          <Button
            className="w-full h-16 text-lg bg-green-500 hover:bg-green-600 shadow-lg transition-all hover:scale-105"
            onClick={() => {
              if (!name) {
                setError((prev) => ({ ...prev, name: "Please enter your name first." }));
                return;
              }
              if (!roomId.trim()) {
                setError((prev) => ({ ...prev, roomId: "Please enter a room ID." }));
                return;
              }
              setEvent("join");
              setHome(false);
            }}
          >
            <Users className="mr-2 h-5 w-5" />
            Join Room
          </Button>
        </div>

        <Card className="p-6 mt-8 max-w-md bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-2">How to Play</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a room or join an existing one</li>
            <li>Take turns drawing the given word</li>
            <li>Guess what others are drawing</li>
            <li>Score points for correct guesses</li>
            <li>The player with the most points wins!</li>
          </ol>
        </Card>
      </div>

      <footer className="absolute bottom-4 text-white/70 text-sm">
        © 2025 Draw.io - A fun drawing game
      </footer>
    </div>
  );
}

function BackgroundPattern() {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M20,20 Q30,10 40,20 T60,20" stroke="white" fill="none" strokeWidth="2" />
          <circle cx="80" cy="20" r="5" fill="white" />
          <rect x="20" y="60" width="10" height="10" fill="white" />
          <path d="M70,60 L80,70 L90,60 Z" fill="white" />
          <path d="M10,80 C20,90 30,90 40,80" stroke="white" fill="none" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern)" />
    </svg>
  );
}