import React from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function Message({ text, author, nickname, timeStamp, successive }) {
  const player = usePlayer()
  if (!player) {
    return null
  }

  function handleClick() {
    console.log(text, successive)
  }

  const isSender = author === player.id

  return (
    <div
      className={`px-2 ${!successive && "py-1"} flex flex-col w-3/5 ${
        isSender ? "self-end" : "self-start"
      }`}
    >
      {!successive && (
        <p className="text-start mx-2 justify-self-start">{nickname}:</p>
      )}
      <div
        className={`p-4 min-h-max w-full flex flex-col border rounded ${
          isSender ? "bg-green-100 text-right" : "bg-blue-100 text-left"
        }`}
      >
        <span onClick={handleClick} className="hyphens-auto">
          {text}
        </span>
        <p className="text-sm text-gray-500 justify-self-end text-end">
          {timeStamp}
        </p>
      </div>
    </div>
  )
}

//   return (
//     <div className="flex flex-col space-y-2">
//       <p className="text-start justify-self-start">{nickname}</p>
//       <div
//         className={`p-6 m-2 min-h-max w-3/5 flex flex-col border rounded ${
//           isSender
//             ? "self-end bg-green-100 text-right"
//             : "self-start bg-blue-100 text-left"
//         }`}
//       >
//         <span className="hyphens-auto">{text}</span>
//         <p className="text-sm text-gray-500 justify-self-end text-end">
//           {timeStamp}
//         </p>
//       </div>
//     </div>
//   )
// }
