import React, { useState, useEffect } from "react"
import { useGame, usePlayer } from "@empirica/core/player/classic/react"
import { ChatRoom } from "./ChatRoom"
import { MessageSubmit } from "./MessageSubmit"

export function Chat({ index }) {
  return (
    <div className="h-full border-solid rounded border shadow flex flex-col space-y-2">
      <ChatRoom index={index} />
      <MessageSubmit index={index} />
    </div>
  )
}
