import React, { useState, useEffect } from "react"
import { useStageTimer } from "@empirica/core/player/classic/react"

export function EndDateBox() {
  const timer = useStageTimer()
  const [endDate, setEndDate] = useState(undefined)

  useEffect(() => {
    if (!timer) {
      return
    }
    let remaining = timer.remaining

    // if (timer?.remaining || timer?.remaining === 0) {
    //   remaining = Math.round(timer?.remaining / 1000);
    // }

    const nowSeconds = new Date().getTime()
    const nowDate = new Date(nowSeconds)
    const future = nowSeconds + remaining

    const eDate = new Date(future)
    setEndDate(eDate)
  }, [])

  if (!timer || !endDate) {
    return "Loading..."
  }

  return (
    <>
      <div className="h-full w-full p-4 space-y-2 border border-solid rounded shadow flex flex-col justify-evenly">
        <h1>End Date: </h1>
        <p className="self-center">{endDate.toLocaleDateString()}</p>
      </div>
    </>
  )
}
