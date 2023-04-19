import {
  useGame,
  usePlayer,
  usePlayers,
} from "@empirica/core/player/classic/react"
import React, { useState, useEffect } from "react"
import { Timer } from "./components/Timer"
import { CommentSubmit } from "./components/CommentSubmit"
import { p } from "@antfu/utils"
import { EstimatePage } from "./components/EstimatePage"

export function Game() {
  const game = useGame()
  const players = usePlayers()
  const player = usePlayer()

  const [nickname, setNickname] = useState("")
  const [currentComment, setCurrentComment] = useState({})
  const [voted, setVoted] = useState(true)

  const comments = game ? game.get("comments") : []
  const seenComments = player ? player.get("seenComments") : []
  const [preEstimate, setPreEstimate] = useState("")

  useEffect(() => {
    if (!player) {
      return
    }
    const searchParams = new URL(document.location).searchParams
    let urlParams = {}
    for (const [key, value] of searchParams) {
      urlParams = {
        ...urlParams,
        [key]: key === "playerCount" ? parseInt(value) : value,
      }
    }

    console.log(urlParams)

    const nullParams = ["participantKey", "MID"]

    const filterParams = Object.fromEntries(
      Object.entries(urlParams).filter(
        ([key, value]) => !nullParams.includes(key)
      )
    )
    console.log("these are the filter params", filterParams)
    console.log(typeof filterParams)

    player.set("filterParams", filterParams)

    // player.set("filterKey", filterParams[0])
    // player.set("filterValue", filterParams[1])
  }, [])

  useEffect(() => {
    console.log("firing join use effect: line 65")
    if (!player) {
      return
    }
    console.log("firing join use effect: line 69")

    player.set("join", true)
  }, [])

  useEffect(() => {
    if (!player || !game) {
      return
    }
    console.log("firing effect")
    const seenCommentIds = player
      .get("seenComments")
      .map((_comment) => _comment.id)

    const commentsToVote = comments.filter(
      (_comment) => !seenCommentIds.includes(_comment.id)
    )
    if (!commentsToVote) {
      setCurrentComment({})
      return
    }

    console.log(`voted: ${voted}`)

    if (!currentComment) {
      setCurrentComment(
        commentsToVote[Math.floor(Math.random() * commentsToVote.length)]
      )
      setVoted(false)

      return
    }

    if (voted) {
      setCurrentComment(
        commentsToVote[Math.floor(Math.random() * commentsToVote.length)]
      )
      setVoted(false)

      return
    }
  }, [seenComments, comments])

  function handleSubmit(event) {
    event.preventDefault()
    if (nickname) {
      player.set("nickname", nickname)
      // player.set("join", true) for OLD version where they click join button
    }
  }

  if (!game) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        {/* <h3>Please enter your first name, or a nickname.</h3>
        <p>This is the name that other participants will see.</p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          <div className="ml-2 mt-2 space-y-1">
            <input
              className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              type="textarea"
              id="inputNickname"
              data-test="inputNickname"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="flex space-x-1 justify-center items-center ">
            <button
              className="px-2 py-1 bg-teal-500 text-white"
              onClick={handleSubmit}
            >
              Join
            </button>
          </div>
        </form> */}

        {player.get("error") && <p>Error code: {player.get("errorCode")}</p>}
      </div>
    )
  }

  function handleVote(event) {
    event.preventDefault()
    const vote = event.target.value

    const { no, uncertain, yes, ...thisStatement } = currentComment

    const prevSeenStatements = player.get("seenComments")
    const newStatements = [
      ...prevSeenStatements,
      {
        ...thisStatement,
        vote: vote,
      },
    ]

    updateGameStatements(currentComment, vote)

    player.set("seenComments", newStatements)
    setVoted(true)
  }
  // if (!messages) {
  //   return <div> Wating...</div>
  // }

  function updateGameStatements(thisStatement, vote) {
    const gameStatements = game
      .get("comments")
      .filter((_comment) => _comment.id !== thisStatement.id)

    console.log(gameStatements)

    const currentComment = game
      .get("comments")
      .find((_comment) => _comment.id === thisStatement.id)

    console.log(currentComment)

    const newStatements = [
      ...gameStatements,
      {
        ...currentComment,
        [vote]: currentComment[vote] + 1,
      },
    ]

    console.log(newStatements)

    game.set("comments", newStatements)
  }

  const treatment = game.get("treatment")
  const question = treatment.question
  const hasPreEstimate = player.get("preEstimate")
  const hasNickname = player.get("nickname")

  const treatmentListItems = Object.entries(treatment).map(([key, value]) => {
    return (
      <li>
        {key}: {value}
      </li>
    )
  })

  if (!hasNickname) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h3>Please enter your first name, or a nickname.</h3>
        <p>This is the name that other participants will see.</p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          {" "}
          <div className="ml-2 mt-2 space-y-1">
            <input
              className="mb-5 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              type="textarea"
              id="inputNickname"
              data-test="inputNickname"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="flex space-x-1 justify-center items-center ">
            <button
              className="px-2 py-1 bg-teal-500 text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (!hasPreEstimate) {
    return (
      <>
        <EstimatePage />
      </>
      // <div className="h-full flex flex-col items-center m-auto space-x-4">
      //   <div className="flex items-center justify-center space-x-20"></div>
      //   <h2>{question}</h2>
      //   <h1>
      //     Please answer in the box below and click <em>submit</em> to continue.
      //   </h1>
      //   <form
      //     onSubmit={(e) => {
      //       e.preventDefault()
      //       player.set("preEstimate", preEstimate)
      //     }}
      //     class="w-96 bg-teal-50 prose p-8 rounded-lg shadow"
      //   >
      //     <p>
      //       <label htmlFor="topic" class="block">
      //         Estimate:
      //       </label>
      //       <input
      //         autoFocus
      //         type="text"
      //         onChange={(e) => setPreEstimate(e.target.value)}
      //         value={preEstimate}
      //       />
      //     </p>

      //     <div class="space-x-1">
      //       <button class="px-2 py-1 bg-teal-500 text-white" type="submit">
      //         Submit
      //       </button>
      //     </div>
      //   </form>
      // </div>
    )
  }

  return (
    <div className="h-full flex flex-col items-center m-auto space-x-4">
      <div className="flex items-center justify-center space-x-20">
        <div className="flex items-center justify-center space-y-2">
          <h2>{question}</h2>
          <Timer />
          {/* <div>Game ID: {game.id}</div> */}
        </div>
        <ul>
          <lh>Player List</lh>
          {players.map((player) => (
            <li key={player.id}>{player.get("nickname")}</li>
          ))}
        </ul>
      </div>
      <div class="space-x-1">
        <button
          class="px-2 py-1 bg-teal-500 text-white"
          onClick={() => console.log(game.get("treatment"))}
        >
          Players
        </button>
        <button
          class="px-2 py-1 bg-teal-500 text-white"
          onClick={() => console.log(player.get("preEstimate"))}
        >
          This player
        </button>
      </div>
      {currentComment && (
        <div className="flex m-8 flex-col items-center justify-center space-y-2">
          <ul style={statementBox}>
            <lh>Statement:</lh>
            <li style={statementContainer}>
              {" "}
              <p style={statementStyle}>{currentComment.text}</p>
              <div className="flex m-8 items-center justify-center">
                <button className="m-1" value="yes" onClick={handleVote}>
                  Yes
                </button>
                <button className="m-1" value="no" onClick={handleVote}>
                  No
                </button>
                <button
                  className="m-1"
                  value="uncertainrtain"
                  onClick={handleVote}
                >
                  Uncertain
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
      {!currentComment && (
        <h1>
          You have voted on all comments, please wait for more or add your own
        </h1>
      )}
      {/* old method of displaying all comments in reverse chronological order //
        {comments && (
          <ul style={statementBox}>
            <lh>Comments</lh>
            {comments
              .sort((a, b) => b.timeStamp - a.timeStamp)
              .map((statement, index) => (
                <li style={statementContainer} key={index}>
                  {" "}
                  <p style={statementStyle}>{statement.text}</p>
                  <div className="flex m-8 items-center justify-center">
                    <button className="m-1" value="yes" onClick={handleVote}>Yes</button>
                    <button className="m-1" value="no" onClick={handleVote}>No</button>
                    <button className="m-1" value="uncertain" onClick={handleVote}>Uncertain</button>
                  </div>
                </li>
              ))}
          </ul>
        )} */}

      <CommentSubmit />
      <div>
        <ul>
          <lh>
            <strong>Treatment Info:</strong>
          </lh>
          {treatmentListItems}
        </ul>
      </div>
    </div>
  )
}

const statementStyle = {
  overflowWrap: "break-word",
  marginTop: "5px",
}

//Style variables
const statementContainer = {
  padding: "10px 15px",
  marginBottom: "15px",
  borderRadius: "5px",
  backgroundColor: "#f2f6fa",
  border: "solid",
  borderWidth: "1px",
  borderColor: "#cad2d8",
}

const statementBox = {
  padding: "30px",
  height: "400px",
  width: "100%",
  overflowY: "scroll",
  borderWidth: "1.5px",
  borderStyle: "solid",
}
