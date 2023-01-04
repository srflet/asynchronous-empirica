import React, { useState } from "react"
import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"

export function StatementSubmit() {
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

    const prevStatements = game.get("statements")
    const newStatements = [
      ...prevStatements,
      {
        id:
          player.get("nickname") +
          "_" +
          Math.random().toString(36).substring(2, 15),
        text: statement,
        timeStamp: new Date().getTime(),
        author: player.get("nickname"),
        yes: 0,
        no: 0,
        pass: 0,
      },
    ]

    setStatement("")

    game.set("statements", newStatements)
    // game.append("messages", {
    //   text: message,
    //   timeStamp: new Date(TimeSync.serverTime(null, 1000)),
    //   author: player.get("nickname")
    // })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-4 pt-2 pb-4 border-t">
        <textarea
          className="chat-textarea w-full m-0 px-0 resize-none xl:text-lg text-md text-gray-500 bg-transparent placeholder-gray-300 border-0 border-b-2 border-white focus:ring-0 focus:outline-none focus:border-b-2 focus:border-gray-500 leading-snug tabular-nums"
          id="statement-input"
          name="statement"
          placeholder="Type your statement here..."
          value={statement}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e)
            }
          }}
          onChange={(e) => setStatement(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-empirica-600 hover:bg-empirica-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </form>
  )
}
