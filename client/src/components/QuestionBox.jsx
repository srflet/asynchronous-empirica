import React, { useState, useEffect } from "react"
import { useGame } from "@empirica/core/player/classic/react"

export function QuestionBox() {
  const game = useGame()

  if (!game){
    return "Loading..."
  }

  const treatment = game.get("treatment")
  const question = `This is a question about ${treatment.question.toUpperCase()}. This is filler text for the question. What do you think?`

  return (
    <div className="row-start-1 col-start-3 row-span-5 col-span-3">
      <div className="h-full p-8 space-y-10 border border-solid rounded shadow flex flex-col">
        <h1>Question: </h1>
        <p>{question}</p>
        </div>
      </div>
       )
}
