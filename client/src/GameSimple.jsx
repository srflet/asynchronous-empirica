import {
  useGame,
  usePlayer,
  usePlayers,
  useRound,
} from "@empirica/core/player/classic/react"
import React, { useState, useEffect } from "react"
import { Timer } from "./components/Timer"
import { CommentSubmit } from "./components/CommentSubmit"
import { EstimatePage } from "./components/EstimatePage"
import { IntroVotePage } from "./components/IntroVotePage"
import { GameScreen } from "./GameScreen"
import { GameScreenMobile } from "./GameScreenMobile"
import { Loading } from "@empirica/core/player/react"
import { IntroCommentSubmitPage } from "./components/IntroCommentSubmitPage"
import { EmailInput } from "./components/EmailInput"
import { Overlay } from "./components/Overlay"

export function GameSimple() {
  const game = useGame()
  const players = usePlayers()
  const player = usePlayer()
  const round = useRound()

  const [isMobile, setIsMobile] = useState(false)

  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [emailMatch, setEmailMatch] = useState(true)
  const [questionView, setQuestionView] = useState(undefined)

  const [currentComment, setCurrentComment] = useState({})
  const [voted, setVoted] = useState(true)

  const comments = game ? game.get("comments") : {}
  const seenComments = player ? player.get("seenComments") : {}
  const [showOverlay, setShowOverlay] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    // if (player.get("emailContact")) {
    //   if ((email.trim().length === 0) | (emailConfirm.trim().length === 0)) {
    //     return
    //   }
    //   if (email !== emailConfirm) {
    //     setEmailMatch(false)
    //     return
    //   }
    //   console.log(`email: ${email}`)
    //   console.log(`emailConfirm: ${emailConfirm}`)
    //   console.log(`Match: ${emailMatch}`)
    //   player.set("email", email)
    // }
    // setEmailMatch(true)

    if (nickname) {
      console.log("email check")

      player.set("introIndex", 0)
      player.set("gameStage", "game") //player.set("gameStage", "introEstimate")
      player.set("nickname", nickname)

      // player.set("join", true) for OLD version where they click join button
    }
  }

  useEffect(() => {
    window.screen.width <= 1000 ? setIsMobile(true) : setIsMobile(false)
  }, [window.screen.width])

  function detectWindowSize() {
    window.innerWidth <= 1000 ? setIsMobile(true) : setIsMobile(false)
  }

  window.onresize = detectWindowSize

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

    const emailContact = !("MID" in urlParams)
    player.set("emailContact", emailContact)
    console.log(`email contact: ${emailContact}`)

    const nullParams = ["participantKey", "MID"]

    const filterParams = Object.fromEntries(
      Object.entries(urlParams).filter(
        ([key, value]) => !nullParams.includes(key)
      )
    )
    console.log(
      "🚀 ~ file: GameSimple.jsx:103 ~ useEffect ~ filterParams:",
      filterParams
    )

    player.set("filterParams", filterParams)

    // player.set("filterKey", filterParams[0])
    // player.set("filterValue", filterParams[1])
  }, [])

  useEffect(() => {
    if (!player) {
      return
    }

    player.set("join", true)
  }, [])

  useEffect(() => {
    if (!player || !game) {
      return
    }

    if (questionView === undefined) {
      return
    }

    console.log(player.get("seenComments"))

    const seenCommentIds = player
      .get("seenComments")
      [`${questionView}`].map((_comment) => _comment.id)

    console.log(seenCommentIds)

    const commentsToVote = comments[`${questionView}`].filter(
      (_comment) => !seenCommentIds.includes(_comment.id)
    )
    if (!commentsToVote) {
      setCurrentComment({})
      return
    }

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

  if (!game) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        {player.get("error") && <p>Error code: {player.get("errorCode")}</p>}
      </div>
    )
  }

  const treatment = game.get("treatment")
  const hasNickname = player.get("nickname")

  if (!hasNickname) {
    player.set("gameStage", "nickname")
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
          {player.get("emailContact") && (
            <EmailInput
              email={email}
              setEmail={setEmail}
              emailConfirm={emailConfirm}
              setEmailConfirm={setEmailConfirm}
              emailMatch={emailMatch}
            />
          )}
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

  // if (player.get("gameStage") === "introEstimate") {
  //   return (
  //     <>
  //       <EstimatePage />
  //     </>
  //   )
  // }

  // if (player.get("gameStage") === "introVote") {
  //   return (
  //     <>
  //       <IntroVotePage />
  //     </>
  //   )
  // }

  // if (player.get("gameStage") === "introCommentSubmit") {
  //   return (
  //     <>
  //       <IntroCommentSubmitPage />
  //     </>
  //   )
  // }

  const isChat = treatment.communication === "chat"
  if (player.get("gameStage") === "game") {
    return (
      <div className="flex w-full h-full justify-center align-center">
        {questionView === undefined ? (
          <Overlay
            isMobile={isMobile}
            questionView={questionView}
            setQuestionView={setQuestionView}
          />
        ) : isMobile ? (
          <GameScreenMobile
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            isChat={isChat}
            questionView={questionView}
            setQuestionView={setQuestionView}
          />
        ) : (
          <GameScreen
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            isChat={isChat}
            questionView={questionView}
            setQuestionView={setQuestionView}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-empirica-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <p>{player.get("gameStage")}</p>
      <p>Game Screen</p>
      <Loading />
    </div>
  )
}
