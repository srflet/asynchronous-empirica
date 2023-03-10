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

  const playersAnswered  = players.reduce((accumulator, _player) => {
    if (_player.get("currentEstimate") !== undefined) {
      return [...accumulator, _player]
    }
    return accumulator
  }, [])

  const allAnswers = players.reduce((accumulator, _player) => {
    if (_player.get("currentEstimate") !== undefined) {
      return [...accumulator, _player.get("currentEstimate")]
    }
    return accumulator
  }, [])


  
  const mean = allAnswers.reduce((accumulator, answer) => accumulator + parseInt(answer), 0,) / allAnswers.length

  return (
    <div className="h-full p-4 flex flex-col space-y-2 border border-solid rounded shadow">
      <h1 >Other Players: </h1>
      {allAnswers.length >= 1 && (
      <div className="bg-white border border-black border-solid rounded flex flex-wrap p-6 justify-between">
        <p>Average:</p>
        <p>{mean}</p>
      </div>)}
      <div className="bg-gray-100 h-full flex flex-col space-y-2 border border-solid rounded shadow">
      {otherPlayers.map((_player, index) => (
        <PlayerCard
          key={index}
          name={_player.get("nickname")}
          estimate={_player.get("currentEstimate")}
        />
      ))}
      </div>
    </div>
  )
}
