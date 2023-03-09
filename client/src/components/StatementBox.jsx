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
    console.log("firing use effect to make intro statements")
    if (!player | !game) {
      return
    }

    if (player.get("introStatements") !== undefined) {
      return
    }

    console.log(statements)
    console.log("game and player exist")

    console.log(`game stage is ${player.get("gameStage")}`)

    if (!player.get("gameStage") === "introVote") {
      return
    }
    console.log("in intro")

    const nStatements = game.get("treatment").numberPreStatements
    console.log(
      "🚀 ~ file: StatementBox.jsx:28 ~ useEffect ~ nStatements:",
      nStatements
    )

    let prePopStatements = JSON.parse(JSON.stringify(statements))
    console.log(
      "🚀 ~ file: StatementBox.jsx:32 ~ useEffect ~ prePopStatements:",
      prePopStatements
    )

    shuffleArray(prePopStatements)
    let statementsForIntro = prePopStatements.slice(0, nStatements)
    console.log(
      "🚀 ~ file: StatementBox.jsx:26 ~ useEffect ~ statementsForIntro:",
      statementsForIntro
    )

    player.set("introStatements", statementsForIntro)
  }, [])

  useEffect(() => {
    if (!player || !game) {
      return
    }
    console.log("firing effect statements to vote")
    const seenStatementIds = player
      .get("seenStatements")
      .map((_statement) => _statement.id)

    let useStatements =
      player.get("gameStage") === "introVote"
        ? player.get("introStatements")
        : statements.slice()

    console.log(`player stage is: ${player.get("gameStage")}`)
    console.log(
      "🚀 ~ file: StatementBox.jsx:61 ~ useEffect ~ useStatements:",
      useStatements
    )

    let statementsToVote = useStatements.filter(
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

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

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

    if (
      player.get("gameStage") === "introVote" &&
      newStatements.length === game.get("treatment").numberPreStatements
    ) {
      console.log("!!!!!!!!!!!!!!!!!Voted on all intro statements!!!!!!!!!!!!")
      player.set("gameStage", "game")
    }
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
