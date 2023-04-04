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
import { Overlay } from "./components/Overlay"

export function GameScreen({
  showOverlay,
  setShowOverlay,
  isChat,
  questionView,
  setQuestionView,
}) {
  isChat = false
  return (
    <div className="relative h-full w-full justify-center align-center">
      <div
        className={`h-full max-h-12/13 min-h-screen-md grid gap-4 grid-cols-11 grid-rows-15 m-4 ${
          showOverlay && "opacity-20 pointer-events-none"
        }`}
      >
        <div className="row-start-1 col-start-1 row-span-3 col-span-3">
          <CurrentEstimate index={questionView} />
        </div>
        <div className="row-start-1 col-start-4 row-span-5 col-span-5">
          <TextBox type="Question" index={questionView} />
        </div>
        <div className="row-start-1 col-start-9 row-span-2 col-span-2">
          <EndDateBox />
        </div>
        <div className="row-start-1 col-start-11 row-span-2 col-span-1 flex flex-wrap items-center justify-center">
          <InfoIcon showOverlay={showOverlay} setShowOverlay={setShowOverlay} />
        </div>
        <div className="row-start-4 col-start-1 row-span-12 col-span-3">
          {isChat ? (
            <Chat index={questionView} />
          ) : (
            <PlayerList index={questionView} />
          )}
        </div>
        <div className="row-start-6 col-start-4 row-span-5 col-span-5">
          <StatementBox index={questionView} />
        </div>
        <div className="row-start-3 col-start-9 row-span-13 col-span-3">
          <StatementList index={questionView} />
        </div>
        <div className="row-start-11 col-start-4 row-span-5 col-span-5">
          <StatementSubmit index={questionView} />
        </div>
      </div>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setQuestionView={setQuestionView}
          isMobile={false}
          questionView={questionView}
        />
      )}
    </div>
  )
}
