"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Socket } from "socket.io-client"
import { getSocket } from "@/lib/socket"


export default function Settings() {
  const [rounds, setRounds] = useState("3")
  const [drawTime, setDrawTime] = useState("80");
  const [socket,setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  useEffect(()=>{
    const skt = getSocket();
    setSocket(skt);
  },[])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (name) {
      const data = {name,rounds : parseInt(rounds),drawTime : parseInt(drawTime)} 
      if(socket) socket.emit("create-room",data);
      if(socket) socket.on("room-created",(roomId : string)=>{
        router.push(`/game/${roomId}?name=${encodeURIComponent(name)}&host=true`)
      });
    }
  }

  function handleStart(){
    socket?.emit("start-game",{
      drawTime,rounds
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
    >
      <Card className="w-full max-w-md">
        <form onSubmit={handleCreate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="rounds" className="text-sm font-medium">
                Number of Rounds
              </label>
              <Select value={rounds} onValueChange={setRounds}>
                <SelectTrigger id="rounds">
                  <SelectValue placeholder="Select rounds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Rounds</SelectItem>
                  <SelectItem value="3">3 Rounds</SelectItem>
                  <SelectItem value="5">5 Rounds</SelectItem>
                  <SelectItem value="10">10 Rounds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="drawTime" className="text-sm font-medium">
                Drawing Time (seconds)
              </label>
              <Select value={drawTime} onValueChange={setDrawTime}>
                <SelectTrigger id="drawTime">
                  <SelectValue placeholder="Select draw time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="80">80 seconds</SelectItem>
                  <SelectItem value="120">120 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!socket} className="w-full bg-purple-500 hover:bg-purple-600"
            onClick={handleStart}
            >
              Start
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
