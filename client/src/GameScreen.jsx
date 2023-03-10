import React, { useState } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { TextBox } from "./components/TextBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { StatementBox } from "./components/StatementBox"
import { StatementSubmit } from "./components/StatementSubmit"
import { StatementList } from "./components/StatementList"
import { Chat } from "./components/Chat"
import { InfoIcon } from "./components/SvgIcon"
import { InstructionsBox } from "./components/InstructionsBox"

export function GameScreen({ showInstructions, setShowInstructions, isChat }) {
  
  isChat =false
  return (
    <div className="relative h-9/10 w-full justify-center">
      <div
        className={`h-9/10 max-h-12/13 min-h-screen-md grid gap-4 grid-cols-11 grid-rows-15 m-4 ${
          showInstructions && "opacity-20"
        }`}
      >
        <div className="row-start-1 col-start-1 row-span-3 col-span-3">
          <CurrentEstimate />
        </div>
        <div className="row-start-1 col-start-4 row-span-4 col-span-5">
          <TextBox type="Question" />
        </div>
        <div className="row-start-1 col-start-9 row-span-2 col-span-2">
          <EndDateBox />
        </div>
        <div className="row-start-1 col-start-11 row-span-2 col-span-1 flex flex-wrap items-center justify-center">
          <InfoIcon
            showInstructions={showInstructions}
            setShowInstructions={setShowInstructions}
          />
        </div>
        <div className="row-start-4 col-start-1 row-span-11 col-span-3">
          {isChat ? <Chat /> : <PlayerList />}
        </div>
        <div className="row-start-5 col-start-4 row-span-5 col-span-5">
          <StatementBox />
        </div>
        <div className="row-start-3 col-start-9 row-span-12 col-span-3">
          <StatementList />
        </div>
        <div className="row-start-10 col-start-4 row-span-5 col-span-5">
          <StatementSubmit />
        </div>
      </div>
      {showInstructions && (
        <InstructionsBox setShowInstructions={setShowInstructions} />
      )}
    </div>
  )
}
