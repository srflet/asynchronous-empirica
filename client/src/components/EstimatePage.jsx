import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
  useStage,
} from "@empirica/core/player/classic/react"
export function EstimatePage() {
  const game = useGame()
  const player = usePlayer()
  const [estimate, setEstimate] = useState("")

  if (!game | !player) {
    return <p>loading...</p>
  }
  const treatment = game.get("treatment")
  const question = treatment.question
  const estimateType = game.hasEnded ? "postEstimate" : "preEstimate"
  return (
    <div className="h-full flex flex-col items-center m-auto space-x-4">
      <div className="flex items-center justify-center space-x-20"></div>
      <h2>{question}</h2>
      <h1>
        Please answer in the box below and click <em>submit</em> to continue.
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          player.set(`${estimateType}`, estimate)
        }}
        class="w-96 bg-teal-50 prose p-8 rounded-lg shadow"
      >
        <p>
          <label htmlFor="topic" class="block">
            Estimate:
          </label>
          <input
            autoFocus
            type="text"
            onChange={(e) => setEstimate(e.target.value)}
            value={estimate}
          />
        </p>

        <div class="space-x-1">
          <button class="px-2 py-1 bg-teal-500 text-white" type="submit">
            Submit
          </button>
          <button
            class="px-2 py-1 bg-teal-500 text-white"
            onClick={(e) => console.log(game.hasEnded)}
          >
            {" "}
            Has Game Ended?{" "}
          </button>
        </div>
      </form>
    </div>
  )
}