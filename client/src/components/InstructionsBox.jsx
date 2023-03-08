import React, { useState, useEffect } from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function InstructionsBox({ isMobile, setShowInstructions }) {
  const player = usePlayer()
  if (!player) {
    return
  }

  return (
    <div
      className={`absolute bg-white ${
        isMobile ? "top-75px left-75px w-250px" : "top-1/3 right-1/3 w-400px"
      } h-auto justify-self-center block z-10 object-center`}
    >
      <div className="min-h-max p-4 space-y-2 border-1 border-black border-solid rounded shadow flex flex-col">
        <div className="flex flex-wrap justify-between">
          <h1>Instructions: </h1>
          <button
            className="bg-red-500 py-1 px-2 bg-opacity-70 hover:bg-opacity-90 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
            onClick={() => setShowInstructions(false)}
          >
            X
          </button>
        </div>
        <p className="hyphens-auto">
          Instructions filler testing the length fo the bvox and how it hanfls
          really long
          instructionsinstructionsinstructionsinstructionsinstructionsinstructionsinstructions
        </p>
        <p className="break-all">Notifications will be sent to: {player.id}</p>
      </div>
    </div>
  )
}
