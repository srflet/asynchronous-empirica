import React, { useState, useEffect } from "react"
import { useStageTimer } from "@empirica/core/player/classic/react"
import { Timer } from "./Timer"

export function EndDateBox() {
  const timer = useStageTimer()
  const [endDate, setEndDate] = useState(undefined)

  useEffect(() => {
    console.log("----FITRING TIME CALC EFFECT-----")
    if (!timer) {
      return
    }
    let remaining = timer.remaining;
    console.log("🚀 ~ file: EndDateBox.jsx:14 ~ useEffect ~ remaining", remaining)
    // if (timer?.remaining || timer?.remaining === 0) {
    //   remaining = Math.round(timer?.remaining / 1000);
    // }
  
    const nowSeconds = new Date().getTime()
    const nowDate = new Date(nowSeconds)
    console.log("🚀 ~ file: EndDateBox.jsx:22 ~ useEffect ~ nowDate", nowDate)
    console.log("🚀 ~ file: EndDateBox.jsx:19 ~ useEffect ~ nowSeconds", nowSeconds)
    const future = nowSeconds + remaining

    console.log("🚀 ~ file: EndDateBox.jsx:25 ~ useEffect ~ this is the endDate", new Date(future))

    const eDate = new Date(future)
    setEndDate(eDate)

  }, [])


  if (!timer || !endDate){
    return "Loading..."
  }

  return (
    <div className="row-start-1 col-start-6 row-span-3 col-span-2">
      <div className="h-full p-8 space-y-10 border border-solid rounded shadow flex flex-wrap justify-evenly">
        <h1>End Date: </h1>
        <p>{endDate.toLocaleDateString()}</p>
        </div>
      </div>
       )
}
