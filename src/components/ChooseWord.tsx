import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { Button } from "./ui/button";

export default function ChooseWord({wordChoices} : {wordChoices : string[]}){
    return <div>
        {wordChoices.map((word,index)=><Word key={index} word={word}/>)}
    </div>
}

function Word({word} : {word : string}){
    const [socket,setSocket] = useState<Socket | null>(null);

    useEffect(()=>{
        const skt = getSocket();
        setSocket(skt);
    },[])

    return <Button
    onClick={()=>{
        socket?.emit("word-choosen",word);
    }}
    >
        {word}
    </Button>

}