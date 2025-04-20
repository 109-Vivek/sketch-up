import Settings from "./Settings";
import ChooseWord from "./ChooseWord";
import Winners from "./Winners";
import Canvas from "./Canvas";
import DrawCanvas from "./DrawCanvas";
import WordSelection from "./WordSelection";
import { Player } from "@/lib/types";

interface OutletProps{
  show : string;
  wordChoices : string[];
  drawerName : string;
  word : string;
  wordLength: number;
  winners : Player[]
}

export default function Outlet({show,wordChoices,drawerName,word,wordLength,winners} : OutletProps){
  if(show === "settings") return <Settings/>
  else if(show === "choose-word") return <ChooseWord wordChoices={wordChoices} />
  else if(show === "winners") return <Winners winners={winners}/>
  else if(show === "canvas") return <Canvas wordLength={wordLength}/>
  else if(show=='draw-canvas') return <DrawCanvas word={word}/>
  else if(show=="word-selection") return <WordSelection drawerName={drawerName}/>
}