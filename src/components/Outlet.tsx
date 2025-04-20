import Settings from "./Settings";
import ChooseWord from "./ChooseWord";
import Winners from "./Winners";
import DrawCanvas from "./DrawCanvas";
import Canvas from "./Canvas";

interface OutletProps{
  show : string;
  wordChoices : string[]
}

export default function Outlet({show,wordChoices} : OutletProps){
  if(show === "settings") return <Settings/>
  else if(show === "choose-word") return <ChooseWord wordChoices={wordChoices} />
  else if(show === "winners") return <Winners/>
  else if(show === "canvas") return <Canvas/>
  else if(show=='draw-canvas') return <DrawCanvas/>
}