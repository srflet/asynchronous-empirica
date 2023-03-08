import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"

export function StatementBox() {
  const game = useGame()
  const player = usePlayer()
  const [currentStatement, setCurrentStatement] = useState({})
  const [voted, setVoted] = useState(true)
  const statements = game ? game.get("statements") : []
  const seenStatements = player ? player.get("seenStatements") : []

  useEffect(() => {
    if (!player || !game) {
      1
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

  function handleVote(event) {
    event.preventDefault()
    const vote = event.target.value

    const { no, uncertain, yes, ...thisStatement } = currentStatement

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

  if (!game || !player) {
    return "Loading statements..."
  }

  return (
    <div className="h-full border border-solid rounded shadow flex flex-col p-6 space-y-2">
      <h1 className="m-b-2">Statement: </h1>
      {currentStatement && (
        <div className="h-4/5">
          <div className="m-4 h-auto max-h-2/3 border-solid rounded border">
            <p className="max-h-80px overflow-auto text-center">
              {currentStatement.text}
            </p>
          </div>
          <div className="flex felx-wrap justify-around">
            <button
              className="bg-green-500 py-2 px-4 hover:bg-green-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value="agree"
              onClick={handleVote}
            >
              Agree
            </button>
            <button
              className="bg-gray-500 py-2 px-4 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value="uncertain"
              onClick={handleVote}
            >
              Uncertain
            </button>
            <button
              className="bg-red-500 py-2 px-4 hover:bg-red-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              value="disagree"
              onClick={handleVote}
            >
              Disagree
            </button>
          </div>
        </div>
      )}
      {!currentStatement && (
        <h1 className="m-b-2">
          You have voted on all statements, please wait for more or add your own
        </h1>
      )}
    </div>
  )
}
