import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"

export function EstimateSubmit() {
  const [estimate, setEstimate] = useState("")
  const player = usePlayer()

  if (!player) {
    return null
  }

  const estimateType =
    player.get("gameStage") === "introEstimate" ? "preEstimate" : "postEstimate"

  function handleSubmit(event) {
    event.preventDefault()

    player.set("currentEstimate", estimate)
    player.set(`${estimateType}`, estimate)
    player.set("gameStage", "introVote")
  }

  return (
    <div className="border-solid rounded border shadow flex flex-col p-6 space-y-2">
      <h1 className="m-b-2">
        Submit your {estimateType === "postEstimate" && "final "}estimate:
      </h1>

      <div className="flex justify-between p-2">
        <div className="w-50px border border-transparent rounded text-sm font-medium rounded leading-snug">
          <input
            className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400"
            type="number"
            id="inputEstimate"
            value={estimate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e)
              }
            }}
            onChange={(e) => setEstimate(e.target.value)}
          />
        </div>
        <button
          className="bg-gray-500 mb-5 w-100px h-40px hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
