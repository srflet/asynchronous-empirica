import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"
import { ChatRoom } from "./ChatRoom"
import { MessageSubmit } from "./MessageSubmit"

export function Chat({ index }) {
  const player = usePlayer()
  const game = useGame()

  if (!player || !game) {
    return "...Loading"
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

  if (isLocked) {
    return (
      <div className="h-full border border-solid rounded shadow p-4 overflow-x-hidden flex flex-col space-y-2">
        <p>
          <strong>
            <em>
              To unlock social features, enter an estimate{" "}
              {myComments.length < requiredComments &&
                `, enter ${
                  requiredComments - myComments.length
                } more comment(s)`}
              {myComments.length < requiredComments &&
                myVotedComments.length < requiredVotes &&
                " and "}
              {myVotedComments.length < requiredVotes &&
                `, vote on ${
                  requiredVotes - myVotedComments.length
                } more comment(s)`}
              .
            </em>
          </strong>
        </p>
      </div>
    )
  }

  return (
    <div className="h-full border-solid rounded border shadow flex flex-col space-y-2">
      <ChatRoom index={index} />
      <MessageSubmit index={index} />
    </div>
  )
}
