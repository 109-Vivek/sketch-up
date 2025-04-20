import { Player } from "@/lib/types";

export default function Winners({winners} : { winners : Player[]}){
    return (<div>
        {winners.map((player: Player, index: number) => (
                    <PlayerCard key={player.id} rank={index+1} player={player} />
                  ))}
    </div>)
    return <div>Winners</div>
}

function PlayerCard({
    player,
    rank,
  }: {
    player: { id: string; name: string; score: number; isDrawing: boolean };
    rank: number;
  }) {
    return (
      <div
        className={`p-2 rounded-md flex justify-between items-center ${
          player.isDrawing ? "bg-green-100" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          {player.isDrawing && (
            <span className="text-xs bg-green-500 text-white px-1 rounded">
              Drawing
            </span>
          )}
          <span>{rank}</span>
          <span>{player.name}</span>
          <span className="font-bold">{player.score}</span>
        </div>
      </div>
    );
  }