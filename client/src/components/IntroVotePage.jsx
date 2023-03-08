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
    <div className="h-9/10 max-h-12/13 min-h-screen-md grid gap-4 grid-cols-11 grid-rows-15 m-4">
      <TextBox type="Instructions" />
      <EstimateSubmit />
    </div>
  )
}
