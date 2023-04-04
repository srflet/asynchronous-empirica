import React, { useState } from "react"
import { usePlayer } from "@empirica/core/player/classic/react"
import Markdown from "marked-react"

export function QuestionCard({
  text,
  index,
  setQuestionView,
  question,
  setShowOverlay,
}) {
  const [showMore, setShowMore] = useState(false)
  const player = usePlayer()

  function handleShowMore(event) {
    event.preventDefault()
    event.stopPropagation()
    console.log("show more clicked")
    setShowMore(!showMore)
  }

  function handleClick(event) {
    event.preventDefault()
    console.log("clicked")
    setQuestionView(index)
    console.log(index)
    setShowOverlay(false)
  }
  if (!player) {
    return null
  }

  const mkdwn =
    "## The Homebrewery *V3*\n\nWelcome traveler from an antique land. Please sit and tell us of what you have seen. The unheard of monsters, who slither and bite. Tell us of the wondrous items and and artifacts you have found, their mysteries yet to be unlocked. Of the vexing vocations and surprising skills you have seen.\n\n### Homebrew D&D made easy\n\nThe Homebrewery makes the creation and sharing of authentic looking Fifth-Edition homebrews easy. It uses [Markdown](https://help.github.com/articles/markdown-basics/) with a little CSS magic to make your brews come to life.\n\n**Try it!** Simply edit the text on the left and watch it *update live* on the right. Note that not every button is visible on this demo page. Click New {{fas,fa-plus-square}} in the navbar above to start brewing with all the features!"

  return (
    <div
      className="flex flex-col border border-solid rounded shadow bg-gray-100 py-2 px-4 hover:bg-white text-sm font-medium"
      onClick={(e) => handleClick(e)}
    >
      <h1 className="text-left">Question {index + 1}</h1>
      <div className="flex flex-wrap">
        <h2 className="text-left">{question}</h2>
        <p
          className="text-black hover:text-gray-500 ml-4"
          onClick={(e) => handleShowMore(e)}
        >
          <strong>[show {showMore ? "less" : "more"}]</strong>
        </p>
      </div>
      {showMore && <Markdown>{mkdwn}</Markdown>}
    </div>
  )
}
