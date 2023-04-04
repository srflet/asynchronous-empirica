import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"

export function StatementSubmit({ index }) {
  const [statement, setStatement] = useState("")
  const player = usePlayer()
  const game = useGame()

  function handleSubmit(event) {
    event.preventDefault()

    if (statement.trim().length === 0) {
      console.log("whitespace only")
      return
    }

    console.log(statement)

    let gameStatements = game.get("statements")

    const prevStatements = gameStatements[`${index}`]
    const newStatements = [
      ...prevStatements,
      {
        id:
          player.get("nickname") +
          "_" +
          Math.random().toString(36).substring(2, 15),
        text: statement,
        timeStamp: new Date().getTime(),
        author: player.id,
        agree: 0,
        disagree: 0,
        uncertain: 0,
      },
    ]

    setStatement("")

    gameStatements[`${index}`] = newStatements

    game.set("statements", gameStatements)
    // game.append("messages", {
    //   text: message,
    //   timeStamp: new Date(TimeSync.serverTime(null, 1000)),
    //   author: player.get("nickname")
    // })

    if (player.get("gameStage") === "introStatementSubmit") {
      const myStatements = newStatements.filter(
        (_statement) => _statement.author === player.id
      )
      console.log(
        "🚀 ~ file: StatementSubmit.jsx:51 ~ handleSubmit ~ myStatements:",
        myStatements
      )

      console.log(index, game.get("treatment").questions.length)

      if (myStatements.length >= 2) {
        if (index < game.get("treatment").questions.length - 1) {
          player.set("introIndex", player.get("introIndex") + 1)
          player.set("gameStage", "introEstimate")
          return
        }
        player.set("gameStage", "game")
      }
    }
  }

  return (
    <div className="h-full border-solid rounded border shadow flex flex-col p-6 space-y-2">
      <h1 className="m-b-2">Statement Submit: </h1>

      <div className="flex flex-col space-y-2">
        <div className="w-full h-auto min-h-max p-2 border border-transparent xl:text-lg rounded text-sm font-medium rounded leading-snug">
          <textarea
            type="text"
            className=" p-4 w-full " //px-0 resize-none xl:text-lg text-md text-gray-500 bg-transparent placeholder-gray-300 border rounded leading-snug p-4"
            id="statement-input"
            name="statement"
            placeholder="...type your statement here"
            value={statement}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e)
              }
            }}
            onChange={(e) => setStatement(e.target.value)}
            autoComplete="off"
          ></textarea>
        </div>
        <div className="flex flex-wrap justify-end">
          <button
            type="submit"
            className="w-1/3 flex text-center justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
