import Settings from "./Settings";
import ChooseWord from "./ChooseWord";
import Winners from "./Winners";
import Canvas from "./Canvas";
import DrawCanvas from "./DrawCanvas";
import WordSelection from "./WordSelection";
import { Player } from "@/lib/types";
import RoundResult from "./RoundResult";

interface OutletProps{
  show : string;
  wordChoices : string[];
  drawerName : string;
  word : string;
  wordLength: number;
  winners : Player[],
  roundResult : {name : string, roundScore : number}[],
}

export default function Outlet({show,wordChoices,drawerName,word,wordLength,winners,roundResult} : OutletProps){
  if(show === "settings") return <Settings/>
  else if(show === "choose-word") return <ChooseWord wordChoices={wordChoices} />
  else if(show === "round-result") return <RoundResult players={roundResult}/>
  else if(show === "winners") return <Winners winners={winners}/>
  else if(show === "canvas") return <Canvas wordLength={wordLength}/>
  else if(show=='draw-canvas') return <DrawCanvas word={word}/>
  else if(show=="word-selection") return <WordSelection drawerName={drawerName}/>
}