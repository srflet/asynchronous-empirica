import { EmpiricaClassic } from "@empirica/core/player/classic"
import { EmpiricaContext } from "@empirica/core/player/classic/react"
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react"
import React from "react"
import "virtual:windi.css"
import { Game } from "./Game"
import { GameSimple } from "./GameSimple"
import { GameScreen } from "./GameScreen"
import { ExitSurvey } from "./intro-exit/ExitSurvey"
import { Introduction } from "./intro-exit/Introduction"
import { NewPlayer } from "./intro-exit/NewPlayer"

export default function App() {
  const urlParams = new URLSearchParams(window.location.search)
  const playerKey = urlParams.get("participantKey") || ""

  const { protocol, host } = window.location
  const url = `${protocol}//${host}/query`

  function introSteps({ game, player }) {
    return [Introduction]
  }

  function exitSteps({ game, player }) {
    return [ExitSurvey]
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu />
        <div className="h-full">
          <EmpiricaContext
            playerCreate={NewPlayer}
            unmanagedAssignment
            disableNoGames
            disableConsent
            exitSteps={exitSteps}
          >
            <GameSimple />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  )
}
