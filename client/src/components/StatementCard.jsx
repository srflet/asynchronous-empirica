import React from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function StatementCard({
  statement,
  agree,
  uncertain,
  disagree,
  personal,
  statementId,
}) {
  const player = usePlayer()

  if (!player) {
    return null
  }

  const myVote =
    player
      .get("seenStatements")
      ?.find((_statement) => _statement.id === statementId)?.vote || ""

  return (
    <div className="flex flex-col border border-solid rounded shadow">
      <p className="max-h-100px self-left text-left overflow-auto p-4 m-auto">
        {statement}
      </p>
      <div className="justify-evenly flex flex-wrap p-b-2">
        <p
          className={`${
            myVote === "agree" &&
            "bg-green-500 px-2 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          }`}
        >
          Agree: {agree || 0}
        </p>
        <p
          className={`${
            myVote === "uncertain" &&
            "bg-gray-500 px-2 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          }`}
        >
          Uncertain: {uncertain || 0}
        </p>
        <p
          className={`${
            myVote === "disagree" &&
            "bg-red-500 px-2 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          }`}
        >
          Disagree: {disagree || 0}
        </p>
      </div>
    </div>
  )
}
