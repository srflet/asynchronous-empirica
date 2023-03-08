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
    <div className="h-full w-full place-center">
      <div className="h-9/10 grid gap-4 grid-cols-[400px] grid-rows-3 m-4 place-center">
        <TextBox
          className="row-start-1 row-span-1 col-start-1 col-span-1"
          type="Question"
        />
        <EstimateSubmit className="row-start-2 row-span-1 col-start-1 col-span-1" />
      </div>
    </div>
  )
}
