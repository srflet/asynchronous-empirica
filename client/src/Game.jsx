import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"
import React, { useState, useEffect } from "react"
import { Timer } from "./components/Timer"
import { StatementSubmit } from "./components/StatementSubmit"
import { Button } from "./components/Button"

export function Game() {
  const game = useGame()
  const players = usePlayers()
  const player = usePlayer()

  const [nickname, setNickname] = useState("")
  const [currentStatement, setCurrentStatement] = useState({})
  const [voted, setVoted] = useState(true)

  const statements = game ? game.get("statements") : []
  const seenStatements = player ? player.get("seenStatements") : []

  function handleSubmit(event) {
    event.preventDefault()
    if (nickname) {
      player.set("nickname", nickname)
      player.set("join", true)
    }
  }

  useEffect(() => {
    if (!player) {
      return
    }
    const searchParams = new URL(document.location).searchParams
    const condition = searchParams.get("question")

    player.set("condition", condition)
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
              Join
            </button>
          </div>
        </form>
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

  const treatments = game.get("treatment")
  const topics = treatments.topics

  return (
    <div className="h-full flex flex-col items-center m-auto space-x-4">
      <div className="flex items-center justify-center space-x-20">
        <div className="flex items-center justify-center space-y-2">
          <h2>{topics}</h2>
          <Timer />
          {/* <div>Game ID: {game.id}</div> */}
        </div>
        <ul>
          <lh>Player List</lh>
          {players.map((player) => (
            <li key={player.id}>{player.get("nickname")}</li>
          ))}
        </ul>
      </div>
      <div class="space-x-1">
        <button
          class="px-2 py-1 bg-teal-500 text-white"
          onClick={() => console.log(seenStatements)}
        >
          Seen statements
        </button>
        <button
          class="px-2 py-1 bg-teal-500 text-white"
          onClick={() => console.log(game.get("statements"))}
        >
          All statements
        </button>
      </div>
      {currentStatement && (
        <div className="flex m-8 flex-col items-center justify-center space-y-2">
          <ul style={statementBox}>
            <lh>Statement:</lh>
            <li style={statementContainer}>
              {" "}
              <p style={statementStyle}>{currentStatement.text}</p>
              <div className="flex m-8 items-center justify-center">
                <button className="m-1" value="yes" onClick={handleVote}>
                  Yes
                </button>
                <button className="m-1" value="no" onClick={handleVote}>
                  No
                </button>
                <button className="m-1" value="pass" onClick={handleVote}>
                  Pass
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
      {!currentStatement && (
        <h1>
          You have voted on all statements, please wait for more or add your own
        </h1>
      )}
      {/* old method of displaying all statements in reverse chronological order //
        {statements && (
          <ul style={statementBox}>
            <lh>Comments</lh>
            {statements
              .sort((a, b) => b.timeStamp - a.timeStamp)
              .map((statement, index) => (
                <li style={statementContainer} key={index}>
                  {" "}
                  <p style={statementStyle}>{statement.text}</p>
                  <div className="flex m-8 items-center justify-center">
                    <button className="m-1" value="yes" onClick={handleVote}>Yes</button>
                    <button className="m-1" value="no" onClick={handleVote}>No</button>
                    <button className="m-1" value="pass" onClick={handleVote}>Pass</button>
                  </div>
                </li>
              ))}
          </ul>
        )} */}

      <StatementSubmit />
    </div>
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
