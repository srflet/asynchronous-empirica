import React from "react"
import {
    useGame,
  } from "@empirica/core/player/classic/react"
import { Message } from "./Message"



export function ChatRoom() {
    const game = useGame()
    if (!game) {
        return null
    }

    const messages = game.get("messages") || []

    const sortedMessages = messages.sort((a, b) => a.timeStamp < b.timeStamp)

    console.log(messages)
    console.log(sortedMessages)

    return (
        <div className="h-4/5 flex flex-col-reverse space-y-2 p-2 border rounded shadow bg-gray-100 overflow-x-hidden snap-end">
            {sortedMessages.map((_message, index) => 
                <Message key={index} text={_message.text} sender={_message.sender} timeStamp={_message.timeStamp} />
            )}
            
        </div>
    )
}


