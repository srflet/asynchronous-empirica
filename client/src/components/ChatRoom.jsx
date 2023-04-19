import React from "react"
import { useGame } from "@empirica/core/player/classic/react"
import { Message } from "./Message"

export function ChatRoom({ index }) {
  const game = useGame()
  if (!game) {
    return null
  }

  const messages = game.get("messages")?.[`${index}`] || []

  // const sortedMessages = messages.sort((a, b) => a.timeStamp < b.timeStamp)

  const sortedMessages = messages

  return (
    <div className="h-4/5 min-h-100px flex flex-col-reverse space-y-2 p-2 border rounded shadow bg-gray-100 overflow-auto snap-end">
      {sortedMessages.map((_message, index) => (
        <Message
          key={index}
          text={_message.text}
          sender={_message.sender}
          timeStamp={_message.timeStamp}
        />
      ))}
    </div>
  )
}
