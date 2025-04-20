import { Player } from "@/lib/types";
import { Card } from "./ui/card";

export default function LeaderBoard({ players }: { players: Player[] }) {
  return (
    <Card className="w-64 bg-white/90 backdrop-blur-sm overflow-auto">
      <div className="p-4">
        <h2 className="font-bold mb-4">Players</h2>
        <div className="space-y-2">
          {players.map((player: Player, index: number) => (
            <PlayerCard key={player.id} rank={index+1} player={player} />
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
