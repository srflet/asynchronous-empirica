import React, { useState } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { QuestionBox } from "./components/QuestionBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { StatementBox } from "./components/StatementBox"
import { StatementSubmit } from "./components/StatementSubmit"
import { StatementList } from "./components/StatementList"
import { Chat } from "./components/Chat"
import { InfoIcon } from "./components/SvgIcon"
import { InstructionsBox } from "./components/InstructionsBox"

export function GameScreen({ showInstructions, setShowInstructions }) {
  const isChat = true
  return (
    <div className="relative h-full w-full justify-center">
      <div
        className={`h-9/10 max-h-12/13 min-h-screen-md grid gap-4 grid-cols-11 grid-rows-15 m-4 ${
          showInstructions && "opacity-20"
        }`}
      >
        <CurrentEstimate />
        <QuestionBox />
        <EndDateBox />
        <div className="row-start-1 col-start-11 row-span-2 col-span-2 flex flex-wrap items-center justify-center">
          <InfoIcon
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        </div>
        {isChat ? <Chat /> : <PlayerList />}
        <StatementBox />
        <StatementList />
        <StatementSubmit />
      </div>
      {showInstructions && (
        <InstructionsBox setShowInstructions={setShowInstructions} />
      )}
    </div>
  )
}
