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
import { Overlay } from "./components/Overlay"

export function GameScreenMobile({
  showOverlay,
  setShowOverlay,
  isChat,
  questionView,
  setQuestionView,
}) {
  const [view, setView] = useState("estimate") // can be estimate | vote | statements

  return (
    <div className="relative h-full w-full justify-center align-center">
      <div
        className={`h-9/10 min-w-350px max-w-400px flex flex-col m-4 align-center space-y-4 ${
          showOverlay && "opacity-20 pointer-events-none touch-none"
        }`}
      >
        <MobileBanner
          view={view}
          setView={setView}
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
          isMobile={true}
        />
        <EndDateBox />
        <TextBox type="Question" index={questionView} />
        {view === "estimate" && (
          <>
            <CurrentEstimate index={questionView} />
            {isChat ? (
              <Chat index={questionView} />
            ) : (
              <PlayerList index={questionView} />
            )}
          </>
        )}

        {view === "vote" && (
          <>
            <StatementBox index={questionView} />
            <StatementSubmit index={questionView} />
          </>
        )}

        {view === "statements" && (
          <>
            <StatementList index={questionView} />
          </>
        )}
      </div>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setQuestionView={setQuestionView}
          isMobile={true}
          questionView={questionView}
        />
      )}
    </div>
  )
}
