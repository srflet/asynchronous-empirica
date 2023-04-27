import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"

export function MessageSubmit({ index }) {
  const game = useGame()
  const player = usePlayer()
  const [newMessage, setNewMessage] = useState({})

  if (!game || !player) {
    return "Loading..."
  }

  function handleChange(event) {
    setNewMessage({
      text: event.target.value,
      author: player.id,
      nickname: player.get("nickname") || "??",
      timeStamp: new Date().getTime(),
    })
  }

  function handleSubmit() {
    if (!newMessage) {
      return
    }
    let allMessages = game.get("messages") || []
    const messages = allMessages[`${index}`] || []
    const newMessages = [...messages, newMessage]

    allMessages[`${index}`] = newMessages

    setNewMessage({})
    game.set("messages", allMessages)
  }

  return (
    <div className="flex flex-wrap justify-evenly items-center">
      <div className="p-2 h-auto border border-transparent rounded text-sm font-medium">
        <textarea
          className="p-4"
          value={newMessage.text || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e)
            }
          }}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="w-1/4">
        <button
          type="submit"
          className="flex text-center p-2 border border-transparent rounded text-sm font-medium text-white bg-gray-500 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
