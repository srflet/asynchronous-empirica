import React, { useState, useEffect } from "react"
import { useGame } from "@empirica/core/player/classic/react"

export function TextBox({ type }) {
  const game = useGame()

  if (!game) {
    return "Loading..."
  }

  let text = "This is filler text. To be replaced!"

  if (type === "Question") {
    const treatment = game.get("treatment")
    text = `This is a question about ${treatment.question.toUpperCase()}. This is filler text for the question. What do you think?`
  }
  return (
    <>
      <div className="h-full p-8 space-y-10 border border-solid rounded shadow flex flex-col">
        <h1>{type}: </h1>
        <p>{text}</p>
      </div>
    </>
  )
}
