import React, { useState, useEffect } from "react"
import { useGame } from "@empirica/core/player/classic/react"

export function TextBox({ type, index = null }) {
  const game = useGame()

  if (!game) {
    return "Loading..."
  }

  let text = "This is filler text. To be replaced!"

  if (type === "Question") {
    const treatment = game.get("treatment")
    text = treatment.questions[index]
  }
  return (
    <>
      <div className="h-full w-auto p-8 space-y-10 border border-solid rounded shadow flex flex-col">
        <h1>{type}: </h1>
        <p>{text}</p>
      </div>
    </>
  )
}
