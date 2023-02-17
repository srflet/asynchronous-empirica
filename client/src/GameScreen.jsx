import React, { useState } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { QuestionBox } from "./components/QuestionBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { StatementBox } from "./components/StatementBox"
import { StatementSubmit } from "./components/StatementSubmit"
import { StatementList } from "./components/StatementList"
import { Chat } from "./components/Chat"


export function GameScreen() {

  const isChat = true
  return (
    <div className="h-9/10 max-h-12/13 min-h-screen-md grid gap-4 grid-cols-7 grid-rows-15 m-4 ">
      <CurrentEstimate />
      <QuestionBox />
      <EndDateBox />
      {isChat ? <Chat /> : <PlayerList />}
      <StatementBox />
      <StatementList />
      <StatementSubmit />
    </div>
  )
}
