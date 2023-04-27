import React, { useState, useEffect } from "react"
import {
  usePlayers,
  usePlayer,
  useGame,
} from "@empirica/core/player/classic/react"

export function MedianBox({ index }) {
  const players = usePlayers()
  const player = usePlayer()
  const game = useGame()

  // const [isLocked, setIsLocked] = useState(true)

  // useEffect(() => {
  //   if (!player) {
  //     return
  //   }

  //   if (!player.get("currentEstimate")) {
  //     return
  //   }

  //   const currentEstimate = player.get("currentEstimte")[`${index}`]
  //   currentEstimate !== undefined && setIsLocked(false)
  // }, [])

  function median(array) {
    const sorted = array.sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2
    }

    return sorted[middle]
  }

  if (!game || !player || !players || !player.get("currentEstimate")) {
    return "Loading..."
  }

  const comments = game.get("comments")[`${index}`]
  const myComments = comments.filter(
    (_comment) => _comment.author === player.id
  )

  const myVotedComments = player.get("seenComments")[`${index}`]

  const requiredVotes = game.get("treatment").numberPreVotes
  const requiredComments = game.get("treatment").numberPreComments

  const currentEstimate = player.get("currentEstimate")?.[`${index}`]

  const isLocked =
    (myComments.length < requiredComments) |
    (myVotedComments.length < requiredVotes) |
    (currentEstimate === undefined)

  const otherPlayers = players.reduce((accumulator, _player) => {
    if (
      _player.get("currentEstimate") !== undefined &&
      _player.id !== player.id &&
      _player.get("nickname") !== undefined
    ) {
      return [...accumulator, _player]
    }
    return accumulator
  }, [])
  // could be otherAnswers = otherPlayers.reduce
  const answers = players.reduce((accumulator, _player) => {
    if (_player.get("currentEstimate")?.[`${index}`] !== undefined) {
      return [
        ...accumulator,
        parseInt(_player.get("currentEstimate")[`${index}`]),
      ]
    }
    return accumulator
  }, [])

  return (
    <div className="h-full p-4 flex flex-col space-y-2 border border-solid rounded shadow">
      <h1>Median Answer: </h1>
      {isLocked ? (
        <div>
          <p>
            <strong>
              <em>
                To unlock, enter an estimate, vote on {requiredVotes} comments,
                and enter {requiredComments} comments.
              </em>
            </strong>
          </p>
        </div>
      ) : (
        answers.length >= 1 && (
          <div className="bg-white border border-black border-solid rounded flex p-2 justify-center align-center">
            <p>{median(answers)}</p>
          </div>
        )
      )}
    </div>
  )
}
