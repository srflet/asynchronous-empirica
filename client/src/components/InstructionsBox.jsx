import React, { useState, useEffect } from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function InstructionsBox() {
  const player = usePlayer()
  if (!player) {
    return
  }

  return (
    <div className="absolute bg-white top-1/3 right-1/3 w-400px height-200px justify-self-center block z-10 object-center">
      <div className="h-full p-8 space-y-10 border-1 border-black border-solid rounded shadow flex flex-col">
        <h1>Instructions: </h1>
        <p>Instructions filler</p>
        <p>Your id: {player.id}</p>
      </div>
    </div>
  )
}
