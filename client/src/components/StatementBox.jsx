import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"

export function StatementBox({ index }) {
  const game = useGame()
  const player = usePlayer()
  const [currentStatement, setCurrentStatement] = useState({})
  const [voted, setVoted] = useState(true)
  const statements = game ? game.get("statements") : {}
  const seenStatements = player ? player.get("seenStatements") : {}

  useEffect(() => {
    console.log("firing use effect to make intro statements")
    if (!player | !game) {
      return
    }

    if (player.get("introStatements") !== undefined) {
      return
    }

    console.log(statements)
    console.log("game and player exsit")

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

    const prePopStatements = Object.entries(statements).reduce(
      (accumulator, [key, value], index) => {
        console.log(key, value)
        return {
          ...accumulator,
          [index]: value.reduce((sub_accumulator, _statement) => {
            if (_statement.author === "prePopulated") {
              return [...sub_accumulator, _statement]
            }
            return sub_accumulator
          }, []),
        }
      },
      {}
    )

    console.log(prePopStatements)

    // const prePopStatements = statements.map((_statements, index) => {
    //   console.log(_statements)
    //   console.log(typeof _statements)
    //   return {
    //     [index]: _statements[`${index}`].reduce((accumulator, _statement) => {
    //       if (_statement.author === "prePopulated") {
    //         return [...accumulator, _statement]
    //       }
    //       return accumulator
    //     }, []),
    //   }
    // })

    console.log(
      "🚀 ~ file: StatementBox.jsx:48 ~ prePopStatements ~ prePopStatements:",
      prePopStatements
    )

    const introStatements = Object.entries(prePopStatements).reduce(
      (accumulator, [key, value], index) => {
        console.log(value)
        let statementArray = value
        shuffleArray(statementArray)
        return {
          ...accumulator,
          [index]: statementArray.slice(0, nStatements),
        }
      },
      {}
    )

    player.set("introStatements", introStatements)
    console.log(
      "🚀 ~ file: StatementBox.jsx:69 ~ useEffect ~ introStatements:",
      introStatements
    )
  }, [])

  useEffect(() => {
    console.log("changing statement #95")
    if (!player || !game) {
      return
    }
    console.log("changing statement #99")

    // console.log("firing effect statements to vote")
    // console.log(player.get("seenStatements")[`${index}`])
    const seenStatementIds = player
      .get("seenStatements")
      [`${index}`].map((_statement) => _statement.id)

    let useStatements =
      player.get("gameStage") === "introVote"
        ? player.get("introStatements")[`${index}`]
        : statements[`${index}`].slice()

    // console.log(`player stage is: ${player.get("gameStage")}`)
    // console.log(
    //   "🚀 ~ file: StatementBox.jsx:61 ~ useEffect ~ useStatements:",
    //   useStatements
    //)

    let statementsToVote = useStatements.filter(
      (_statement) => !seenStatementIds.includes(_statement.id)
    )

    if (!statementsToVote) {
      setCurrentStatement({})

      return
    }
    console.log("changing statement #127")

    if (!currentStatement) {
      setCurrentStatement(
        statementsToVote[Math.floor(Math.random() * statementsToVote.length)]
      )
      setVoted(false)

      return
    }

    console.log("changing statement #139")

    if (voted) {
      setCurrentStatement(
        statementsToVote[Math.floor(Math.random() * statementsToVote.length)]
      )
      setVoted(false)

      return
    }
    console.log("changing statement #150")
  }, [seenStatements, statements])

  useEffect(() => {
    console.log("changing statement #95")
    if (!player || !game) {
      return
    }
    console.log("changing statement #99")

    // console.log("firing effect statements to vote")
    // console.log(player.get("seenStatements")[`${index}`])
    const seenStatementIds = player
      .get("seenStatements")
      [`${index}`].map((_statement) => _statement.id)

    let useStatements =
      player.get("gameStage") === "introVote"
        ? player.get("introStatements")[`${index}`]
        : statements[`${index}`].slice()

    let statementsToVote = useStatements.filter(
      (_statement) => !seenStatementIds.includes(_statement.id)
    )

    setCurrentStatement(
      statementsToVote[Math.floor(Math.random() * statementsToVote.length)]
    )
    setVoted(false)
  }, [index])

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

    let seenStatements = player.get("seenStatements")
    const previousStatements = seenStatements[`${index}`]
    const newStatements = [
      ...previousStatements,
      {
        ...thisStatement,
        vote: vote,
      },
    ]

    seenStatements[`${index}`] = newStatements

    updateGameStatements(index, currentStatement, vote)

    player.set("seenStatements", seenStatements)
    setVoted(true)

    console.log(newStatements)

    if (
      player.get("gameStage") === "introVote" &&
      newStatements.length === game.get("treatment").numberPreStatements
    ) {
      console.log("!!!!!!!!!!!!!!!!!Voted on all intro statements!!!!!!!!!!!!")
      player.set("gameStage", "introStatementSubmit")
    }
  }

  function updateGameStatements(index, thisStatement, vote) {
    let gameStatements = game.get("statements")

    const questionStatements = gameStatements[`${index}`]

    const previousStatements = questionStatements.filter(
      (_statement) => _statement.id !== thisStatement.id
    )

    console.log(previousStatements)

    const currentStatement = questionStatements.find(
      (_statement) => _statement.id === thisStatement.id
    )

    // console.log(currentStatement)

    const newStatements = [
      ...previousStatements,
      {
        ...currentStatement,
        [vote]: currentStatement[vote] + 1,
      },
    ]

    gameStatements[`${index}`] = newStatements

    game.set("statements", gameStatements)
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
