import { Player } from "@/lib/types";
import { Card } from "./ui/card";

export default function RoundResult({ players }: { players: {name : string,roundScore : number}[] }) {
  return (
    <Card className="w-64 bg-white/90 backdrop-blur-sm overflow-auto">
      <div className="p-4">
        <h2 className="font-bold mb-4">Players</h2>
        <div className="space-y-2">
          {players.map((player: {name : string,roundScore : number}, index: number) => (
            <PlayerCard key={index} rank={index+1} player={player} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function PlayerCard({
  player,
  rank,
}: {
  player: { name: string; roundScore: number};
  rank: number;
}) {
  return (
    <div
      className={`p-2 rounded-md flex justify-between items-center`}
    >
      <div className="flex items-center gap-2">
        <span>{rank}</span>
        <span>{player.name}</span>
        <span className="font-bold">{player.roundScore}</span>
      </div>
    </div>
  );
}
