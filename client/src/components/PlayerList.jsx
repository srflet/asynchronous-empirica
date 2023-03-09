import React from "react"
import { usePlayers, usePlayer } from "@empirica/core/player/classic/react"
import { PlayerCard } from "./PlayerCard"

export function PlayerList() {
  const players = usePlayers()
  const player = usePlayer()

  if (!player || !players) {
    return "Loading..."
  }

  const otherPlayers = players.filter((_p) => _p.id !== player.id)
  const otherPlayerEls = players.map((_p) => {
    return (
      <li>
        {_p.get("nickname")} | {_p.get("currentEstimate")}
      </li>
    )
  })

  const otherPlayersCards = players.map((_p) => {
    return (
      <PlayerCard
        name={_p.get("nickname")}
        estimate={_p.get("currentEstimate")}
      />
    )
  })

  return (
    <div className="h-full flex flex-col space-y-2 border border-solid rounded shadow">
      <h1 className="p-t-6">Player List: </h1>
      {otherPlayers.map((_player, index) => (
        <PlayerCard
          key={index}
          name={_player.get("nickname")}
          estimate={_player.get("currentEstimate")}
        />
      ))}
    </div>
  )
}
