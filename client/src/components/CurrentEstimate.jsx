import React, { useState, useEffect } from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function CurrentEstimate({ index }) {
  const player = usePlayer()
  const [updating, setUpdating] = useState(false)
  const [estimate, setEstimate] = useState(undefined)

  useEffect(() => {
    if (!player) {
      return
    }

    if (player.get("currentEstimate")) {
      return
    }

    let preEstimate = player.get("preEstimate")
    console.log(preEstimate)
    player.set("currentEstimate", preEstimate)
    console.log(
      "🚀 ~ file: CurrentEstimate.jsx:17 ~ useEffect ~ currentEstObj:",
      player.get("currentEstimate")
    )
  }, [])

  // TODO Add only change to current index
  // useEffect(() => {
  //   if (!player) {
  //     return
  //   }

  //   if (!player.get("currentEstimate")) {
  //     return
  //   }

  //   let currentEstObj = player.get("currentEstimate")
  //   currentEstObj[`${index}`] = player.get("preEstimate")[`${index}`]
  //   player.set("currentEstimate", currentEstObj)
  //   console.log(
  //     "🚀 ~ file: CurrentEstimate.jsx:17 ~ useEffect ~ currentEstObj:",
  //     currentEstObj
  //   )
  // }, [index])

  function handleClick(event) {
    console.log(player.get("currentEstimate"))
    if (updating) {
      if (!estimate) {
        alert("Please enter an estimate")
        return
      }
      let currentEstimateObj = player.get("currentEstimate") || {}
      currentEstimateObj[`${index}`] = estimate
      player.set("currentEstimate", currentEstimateObj)
      setEstimate(undefined)
      setUpdating(!updating)

      return
    }
    setUpdating(!updating)

    return
  }

  function handleClose() {
    setUpdating(!updating)
  }

  return (
    <div className="border border-solid rounded shadow h-full p-4 space-y-4 flex flex-col">
      <h1>{updating ? "Update your estimate:" : "Current estimate:"}</h1>
      {!updating ? (
        <div className="border w-2/3 rounded border-solid self-center">
          <p
            className={`text-center p-2 ${
              player.get("currentEstimate") ? "text-black" : "text-gray-500"
            }`}
          >
            {player.get("currentEstimate")
              ? player.get("currentEstimate")[`${index}`]
              : "you have not made an estimate..."}
          </p>
        </div>
      ) : (
        <input
          className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
          type="number"
          id="inputEstimate"
          value={estimate}
          placeholder={player.get("currentEstimate")[`${index}`]}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick(e)
            }
          }}
          onChange={(e) => setEstimate(e.target.value)}
        />
      )}
      <div
        className={`flex flex-wrap p-1 ${
          updating ? "justify-evenly" : "justify-end"
        }`}
      >
        <button
          className="bg-gray-500 py-2 px-4 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
          onClick={handleClick}
        >
          {updating ? "Submit" : "Update"}
        </button>
        {updating && (
          <button
            className="bg-gray-500 py-2 px-4 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
            onClick={handleClose}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
