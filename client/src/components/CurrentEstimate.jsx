import React, { useState, useEffect } from "react"
import { usePlayer } from "@empirica/core/player/classic/react"

export function CurrentEstimate({ index }) {
  const player = usePlayer()
  const [updating, setUpdating] = useState(false)
  const [estimate, setEstimate] = useState(undefined)

  // useEffect(() => {
  //   if (!player) {
  //     return
  //   }

  //   if (player.get("currentEstimate")) {
  //     return
  //   }

  //   let preEstimate = player.get("preEstimate")
  //   console.log(preEstimate)
  //   player.set("currentEstimate", preEstimate)
  //   console.log(
  //     "🚀 ~ file: CurrentEstimate.jsx:17 ~ useEffect ~ currentEstObj:",
  //     player.get("currentEstimate")
  //   )
  // }, [])

  // TODO Add only change to current index
  useEffect(() => {
    if (!player) {
      return
    }

    if (player.get("currentEstimate")) {
      return
    }

    let currentEstObj = {
      0: undefined,
      1: undefined,
      2: undefined,
    }
    player.set("currentEstimate", currentEstObj)
    console.log(
      "🚀 ~ file: CurrentEstimate.jsx:17 ~ useEffect ~ currentEstObj:",
      currentEstObj
    )
  }, [])

  function handleClick(event) {
    console.log(player.get("currentEstimate"))
    if (updating) {
      if (!estimate) {
        alert("Please enter an estimate")
        return
      }
      let currentEstimateObj = player.get("currentEstimate")
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
    <div className="border border-solid rounded shadow h-full p-4 space-y-2 flex flex-col">
      <h1>{updating ? "Update your estimate:" : "Current estimate:"}</h1>
      <div className="flex justify-between">
        {!updating && (
          <div className="border w-3/5 rounded border-solid self-center flex justify-center">
            <p
              className="min-w-max max-w-max max-h-min text-center p-2 text-black hover:cursor-pointer hover:text-blue-500"
              onClick={handleClick}
            >
              {player.get("currentEstimate")?.[`${index}`]
                ? player.get("currentEstimate")?.[`${index}`]
                : "[enter your estimate]"}
            </p>
          </div>
        )}

        {updating && (
          <>
            <input
              className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              type="number"
              id="inputEstimate"
              value={estimate}
              placeholder={`${
                player.get("currentEstimate")[`${index}`] ||
                "No estimate entered."
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClick(e)
                }
              }}
              onChange={(e) => setEstimate(e.target.value)}
            />
            <button
              className="h-40px px-2 bg-gray-500 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              onClick={handleClick}
            >
              Submit
            </button>
            <button
              className="h-40px px-2 bg-gray-500 hover:bg-gray-400 rounded border border-transparent rounded shadow-sm text-sm font-medium text-white"
              onClick={handleClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
