import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react"
import { Loading } from "@empirica/core/player/react"
import { TextBox } from "./TextBox"
import { EstimateSubmit } from "./EsimateSubmit"

export function EstimatePage() {
  const game = useGame()
  const player = usePlayer()

  if (!game | !player | (!game.hasEnded && player.get("preEstimate"))) {
    return (
      <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <div className="h-9/10 p-y-20 flex flex-col space-y-10 justify-center">
        <div className="flex min-h-max w-400px self-center">
          <TextBox type="Question" />
        </div>
        <div className="h-300px w-400px self-center">
          <EstimateSubmit />
        </div>
      </div>
    </div>
  )
}
