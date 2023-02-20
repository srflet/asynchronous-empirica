import React, { useState } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { QuestionBox } from "./components/QuestionBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { StatementBox } from "./components/StatementBox"
import { StatementSubmit } from "./components/StatementSubmit"
import { StatementList } from "./components/StatementList"
import { Chat } from "./components/Chat"
import {MobileBanner} from "./components/MobileBanner"


export function GameScreenMobile() {

  const [view, setView] = useState("estimate") // can be estimate | vote | statements

  const isChat = true
  return (
    <div className="h-9/10 min-w-350px max-w-400px flex flex-col m-4 align-center space-y-4">
      <MobileBanner view={view} setView={setView}/>
      <EndDateBox />
      <QuestionBox />
      {view==="estimate" && 
      (
        <>
      <CurrentEstimate />
      {isChat ? <Chat /> : <PlayerList /> }
      </>
      )}

      {view==="vote" && 
      (
        <>
      <StatementBox />
      <StatementSubmit />
      </>
      )
      }

    {view==="statements" && 
      (
        <>
      <StatementList />
      </>
      )}

    </div>
  )
}
