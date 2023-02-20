import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"
import React, { useState, useEffect } from "react"
import { Timer } from "./components/Timer"
import { StatementSubmit } from "./components/StatementSubmit"
import { p } from "@antfu/utils"
import { EstimatePage } from "./components/EstimatePage"
import { GameScreen } from "./GameScreen"
import { GameScreenMobile } from "./GameScreenMobile"

export function GameSimple() {
  const game = useGame()
  const players = usePlayers()
  const player = usePlayer()

  const [isMobile, setIsMobile] = useState(false);

  const [nickname, setNickname] = useState("")
  const [currentStatement, setCurrentStatement] = useState({})
  const [voted, setVoted] = useState(true)

  const statements = game ? game.get("statements") : []
  const seenStatements = player ? player.get("seenStatements") : []
  const [preEstimate, setPreEstimate] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
    if (nickname) {
      player.set("nickname", nickname)
      // player.set("join", true) for OLD version where they click join button
    }
  }

  useEffect(() => {
    window.screen.width <= 1000 ? setIsMobile(true) : setIsMobile(false);
  }, [window.screen.width]);

  function detectWindowSize() {
      window.innerWidth <= 1000 ? setIsMobile(true) : setIsMobile(false);        
  }
  
  window.onresize = detectWindowSize;

  console.log("🚀 ~ file: GameSimple.jsx:48 ~ GameSimple ~ isMobile:", isMobile)

  useEffect(() => {
    if (!player) {
      return
    }
    const searchParams = new URL(document.location).searchParams
    let urlParams = {}
    for (const [key, value] of searchParams) {
      urlParams = {
        ...urlParams,
        [key]: key === "playerCount" ? parseInt(value) : value,
      }
    }

    console.log(urlParams)

    const nullParams = ["participantKey", "MID"]

    const filterParams = Object.fromEntries(
      Object.entries(urlParams).filter(
        ([key, value]) => !nullParams.includes(key)
      )
    )
    console.log("these are the filter params", filterParams)
    console.log(typeof filterParams)

    player.set("filterParams", filterParams)

    // player.set("filterKey", filterParams[0])
    // player.set("filterValue", filterParams[1])
  }, [])

  useEffect(() => {
    console.log("firing join use effect: line 65")
    if (!player) {
      return
    }
    console.log("firing join use effect: line 69")

    player.set("join", true)
  }, [])

  useEffect(() => {
    if (!player || !game) {
      return
    }
    console.log("firing effect")
    const seenStatementIds = player
      .get("seenStatements")
      .map((_statement) => _statement.id)

    const statementsToVote = statements.filter(
      (_statement) => !seenStatementIds.includes(_statement.id)
    )
    if (!statementsToVote) {
      setCurrentStatement({})
      return
    }

    console.log(`voted: ${voted}`)

    if (!currentStatement) {
      setCurrentStatement(
        statementsToVote[Math.floor(Math.random() * statementsToVote.length)]
      )
      setVoted(false)

      return
    }

    if (voted) {
      setCurrentStatement(
        statementsToVote[Math.floor(Math.random() * statementsToVote.length)]
      )
      setVoted(false)

      return
    }
  }, [seenStatements, statements])

  if (!game) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        {/* <h3>Please enter your first name, or a nickname.</h3>
        <p>This is the name that other participants will see.</p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          <div className="ml-2 mt-2 space-y-1">
            <input
              className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              type="textarea"
              id="inputNickname"
              data-test="inputNickname"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="flex space-x-1 justify-center items-center ">
            <button
              className="px-2 py-1 bg-teal-500 text-white"
              onClick={handleSubmit}
            >
              Join
            </button>
          </div>
        </form> */}

        {player.get("error") && <p>Error code: {player.get("errorCode")}</p>}
      </div>
    )
  }

  function handleVote(event) {
    event.preventDefault()
    const vote = event.target.value

    const { no, pass, yes, ...thisStatement } = currentStatement

    const prevSeenStatements = player.get("seenStatements")
    const newStatements = [
      ...prevSeenStatements,
      {
        ...thisStatement,
        vote: vote,
      },
    ]

    updateGameStatements(currentStatement, vote)

    player.set("seenStatements", newStatements)
    setVoted(true)
  }
  // if (!messages) {
  //   return <div> Wating...</div>
  // }

  function updateGameStatements(thisStatement, vote) {
    const gameStatements = game
      .get("statements")
      .filter((_statement) => _statement.id !== thisStatement.id)

    console.log(gameStatements)

    const currentStatement = game
      .get("statements")
      .find((_statement) => _statement.id === thisStatement.id)

    console.log(currentStatement)

    const newStatements = [
      ...gameStatements,
      {
        ...currentStatement,
        [vote]: currentStatement[vote] + 1,
      },
    ]

    console.log(newStatements)

    game.set("statements", newStatements)
  }

  const treatment = game.get("treatment")
  const question = treatment.question
  const hasPreEstimate = player.get("preEstimate")
  const hasNickname = player.get("nickname")

  const treatmentListItems = Object.entries(treatment).map(([key, value]) => {
    return (
      <li>
        {key}: {value}
      </li>
    )
  })

  if (!hasNickname) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h3>Please enter your first name, or a nickname.</h3>
        <p>This is the name that other participants will see.</p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          <div className="ml-2 mt-2 space-y-1">
            <input
              className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              type="textarea"
              id="inputNickname"
              data-test="inputNickname"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="flex space-x-1 justify-center items-center ">
            <button
              className="px-2 py-1 bg-teal-500 text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  }

  // if (!hasPreEstimate) {
  //   return (
  //     <>
  //       <EstimatePage />
  //     </>
  //   )
  // }

  return (
    <>
    { isMobile 
      ? <GameScreenMobile />
      : <GameScreen />
     }
     </>
  )
}

const statementStyle = {
  overflowWrap: "break-word",
  marginTop: "5px",
}

//Style variables
const statementContainer = {
  padding: "10px 15px",
  marginBottom: "15px",
  borderRadius: "5px",
  backgroundColor: "#f2f6fa",
  border: "solid",
  borderWidth: "1px",
  borderColor: "#cad2d8",
}

const statementBox = {
  padding: "30px",
  height: "400px",
  width: "100%",
  overflowY: "scroll",
  borderWidth: "1.5px",
  borderStyle: "solid",
}
