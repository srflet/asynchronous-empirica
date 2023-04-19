import React from "react"
import { InfoIcon } from "./SvgIcon"

export function MobileBanner({
  view,
  setView,
  showOverlay,
  setShowOverlay,
  isMobile,
}) {
  function handleClick(event) {
    event.preventDefault()
    const target = event.target.value
    setView(target)
  }
  return (
    <div className="w-full min-w-max justify-evenly flex flex-wrap  row-start-1 col-start-1 row-span-1 p-y-1 col-span-1 bg-gray-800 border border-solid rounded">
      <button
        value="estimate"
        className={`p-x-2 p-y-1 rounded ${
          view === "estimate"
            ? "bg-gray-300 shadow shadow-gray-500 text-black"
            : "hover:bg-gray-600 bg-gray-800 text-white "
        }`}
        onClick={handleClick}
      >
        Other Estimates
      </button>
      <button
        value="vote"
        className={`p-x-2 p-y-1 rounded ${
          view === "vote"
            ? "bg-gray-300 shadow shadow-gray-500 text-black"
            : "hover:bg-gray-600 bg-gray-800 text-white"
        }`}
        onClick={handleClick}
      >
        Vote/Comment
      </button>
      <button
        value="comments"
        className={`p-x-2 p-y-1 rounded ${
          view === "comments"
            ? "bg-gray-300 shadow shadow-gray-500 text-black"
            : "hover:bg-gray-700 bg-gray-800 text-white"
        }`}
        onClick={handleClick}
      >
        Vote Tally
      </button>
      <InfoIcon
        showOverlay={showOverlay}
        setShowOverlay={setShowOverlay}
        isMobile={isMobile}
      />
    </div>
  )
}
