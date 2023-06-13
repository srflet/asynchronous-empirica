import React, { useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"
import { CommentCard } from "./CommentCard"

// TODO map statemtns to CommentCard ==> need comment (text) and yes, no uncertain count

export function CommentList({ index }) {
  const game = useGame()
  const player = usePlayer()

  if (!game || !player) {
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

  if (isLocked) {
    return (
      <div className="h-full border border-solid rounded shadow p-4 overflow-x-hidden flex flex-col space-y-2">
        <ul>
          <lh>To unlock social features:</lh>
          {currentEstimate === undefined && <li>Enter an estimate</li>}
          {myComments.length < requiredComments && (
            <li>
              Enter {requiredComments - myComments.length} more comment
              {requiredComments - myComments.length > 1 && "s"}
            </li>
          )}
          {myVotedComments.length < requiredVotes && (
            <li>
              Vote on {requiredVotes - myVotedComments.length} more comment
              {requiredVotes - myVotedComments.length > 1 && "s"}
            </li>
          )}
        </ul>
      </div>
    )
  }
  return (
    <div className="h-full border border-solid rounded shadow p-4 overflow-x-hidden flex flex-col space-y-2">
      <h1 className="m-b-2">Community Votes: </h1>
      {comments.map((_s, _index) => (
        <CommentCard
          key={_index}
          comment={_s.text}
          agree={_s.agree}
          uncertain={_s.uncertain}
          disagree={_s.disagree}
          commentId={_s.id}
          index={index}
        />
      ))}
    </div>
  )
}
