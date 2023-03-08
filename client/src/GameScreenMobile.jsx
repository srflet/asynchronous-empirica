import React, { useState } from "react"
import { CurrentEstimate } from "./components/CurrentEstimate"
import { TextBox } from "./components/TextBox"
import { EndDateBox } from "./components/EndDateBox"
import { PlayerList } from "./components/PlayerList"
import { StatementBox } from "./components/StatementBox"
import { StatementSubmit } from "./components/StatementSubmit"
import { StatementList } from "./components/StatementList"
import { Chat } from "./components/Chat"
import { MobileBanner } from "./components/MobileBanner"
import { InstructionsBox } from "./components/InstructionsBox"

export function GameScreenMobile({ showInstructions, setShowInstructions }) {
  const [view, setView] = useState("estimate") // can be estimate | vote | statements

  const isChat = false
  return (
    <div className="relative h-full w-full justify-center">
      <div
        className={`h-9/10 min-w-350px max-w-400px flex flex-col m-4 align-center space-y-4 ${
          showInstructions && "opacity-20"
        }`}
      >
        <MobileBanner
          view={view}
          setView={setView}
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
          isMobile={true}
        />
        <EndDateBox />
        <TextBox type="Question" />
        {view === "estimate" && (
          <>
            <CurrentEstimate />
            {isChat ? <Chat /> : <PlayerList />}
          </>
        )}

        {view === "vote" && (
          <>
            <StatementBox />
            <StatementSubmit />
          </>
        )}

        {view === "statements" && (
          <>
            <StatementList />
          </>
        )}
      </div>
      {showInstructions && (
        <InstructionsBox
          isMobile={true}
          setShowInstructions={setShowInstructions}
        />
      )}
    </div>
  )
}
