import React from "react"
import { useGame } from "@empirica/core/player/classic/react"
import { Message } from "./Message"
import { useEffect, useRef } from "react"

export function ChatRoom({ index }) {
  const game = useGame()

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const messages = game.get("messages")?.[`${index}`] || []

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!game) {
    return null
  }

  // const sortedMessages = messages.sort((a, b) => a.timeStamp < b.timeStamp)

  const sortedMessages = messages
  console.log(sortedMessages)

  function handleClick() {
    sortedMessages.map((_message, i, arr) => {
      if (i < 1) {
        return
      }

      console.log(_message.author, arr[i - 1].author)
      console.log(_message.author === arr[i - 1].author)
    })
  }

  return (
    <div className="h-4/5 min-h-100px flex flex-col space-y-2 border rounded shadow bg-gray-100 overflow-auto snap-end">
      {sortedMessages.map((_message, i, arr) => (
        <Message
          key={i}
          text={_message.text}
          author={_message.author}
          timeStamp={_message.timeStamp}
          nickname={_message.nickname}
          successive={i > 0 ? _message.author === arr[i - 1].author : false}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
