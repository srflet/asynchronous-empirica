import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"

export function MessageSubmit() {
  const game = useGame()
  const player = usePlayer()
  const [newMessage, setNewMessage] = useState({})

  if (!game || !player) {
    return "Loading..."
  }

  function handleChange(event) {
    setNewMessage({
      text: event.target.value,
      sender: player.id,
      timeStamp: new Date().getTime(),
    })
  }

  function handleSubmit() {
    console.log(game.get("messages"))
    if (!newMessage) {
      return
    }
    const messages = game.get("messages") || []
    const newMessages = [...messages, newMessage]

    setNewMessage({})

    game.set("messages", newMessages)
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
