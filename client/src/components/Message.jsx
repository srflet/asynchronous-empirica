import React from 'react'
import {
    usePlayer,
  } from "@empirica/core/player/classic/react"

export function Message({text, sender, timeStamp}) {
    const player = usePlayer()
    if (!player){
        return null
    }

    const isSender = sender === player.id

    console.log(text, sender, timeStamp)

    return (
        <div className={`p-6 m-2 min-h-max w-3/5 flex flex-wrap border rounded ${isSender ? "self-end bg-green-100 text-right" : "self-start bg-blue-100 text-left"}`}>
            <span>{text}</span>
        </div>
    )
}
