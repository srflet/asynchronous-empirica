import { ClassicListenersCollector } from "@empirica/core/admin/classic"
export const Empirica = new ClassicListenersCollector()
import { postmarkApiKey } from "./sensitive"
var cron = require("node-cron")
const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const postmark = require("postmark")

// function shuffle(array) {

// }

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

function sendVerificationEmail(verificationCode, emailAddress) {
  const client = new postmark.ServerClient(postmarkApiKey)
  client.sendEmail({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: "asynchronous empirica",
    TextBody: `Your verification code is: ${verificationCode}`,
  })
}

function sendURLEmail(url, emailAddress) {
  const client = new postmark.ServerClient(postmarkApiKey)
  client.sendEmail({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: "asynchronous empirica",
    TextBody: `Your magic link is: ${url}. Please use this for future access.\n`,
  })
}

async function sendGmail(text) {
  // Replace the placeholders with your own values
  const CLIENT_ID =
    "1027200070944-rnh22gqdi0q20sr3tt4km6de0ssi0d9a.apps.googleusercontent.com"
  const CLIENT_SECRET = "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"
  const REDIRECT_URI = "https://developers.google.com/oauthplayground"
  const REFRESH_TOKEN =
    "1//04sTnYvMuajguCgYIARAAGAQSNwF-L9IrjvoCzdZ9FbAYH6G8LZGTkrUwn3oCfvxR09XpOCPIVE-PoyWkq1r7aDl036eI7fGTLYw"
  const EMAIL_FROM = "s.fletcher.17.ucl@gmail.com"
  const EMAIL_TO = "s.fletcher.17@ucl.ac.uk"
  const EMAIL_SUBJECT = "test email"
  const EMAIL_CONTENT = `${text}`

  // Set up the OAuth 2.0 client with your credentials
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  )
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

  // Use the Gmail API client library to send the email
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_FROM,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken(),
      },
    })
    const mailOptions = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: EMAIL_SUBJECT,
      text: EMAIL_CONTENT,
    }
    const result = await transporter.sendMail(mailOptions)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

// ------------------- Batch callbacks ---------------------------

// Empirica.on("batch", (ctx, { batch }) => {
//   if (!batch.get("initialized")) {
//     const { config } = batch.get("config")
//     if (config?.nMaxParticipants) {
//       ctx.globals.set("nMaxParticipants", config.nMaxParticipants)
//     }

//     console.log(config)
//     console.log(config.launchDate)
//     console.log(config.endDate)
//     console.log(config.dispatchWait)
//     console.log(config.treatmentFile)
//     console.log(`Batch status: ${batch.status}`) //not work
//     console.log(`Batch running: ${batch.running}`) //not work
//     batch.set("maxParticipants", config.nParticipants)

//   try {
//     const treatmentFile = `${empiricaDir}/${config.treatmentFile}`;
//     const treatments = getTreatments(treatmentFile, config.useTreatments);
//     dispatchers.set(batch.id, makeDispatcher({ treatments }));

//     batch.set("treatments", treatments);
//     batch.set("launchDate", config.launchDate);
//     batch.set("endDate", config.endDate);
//     batch.set("dispatchWait", config.dispatchWait);
//     batch.set("initialized", true);
//     console.log(`Initialized Batch ${batch.id}`);
//   } catch (err) {
//     console.log(`Failed to create batch with config:`);
//     console.log(JSON.stringify(config));
//     console.log(err);
//     batch.set("status", "failed");
//   }
// } else {
//   // put the following outside the idempotency check
//   // so that if the server restarts and the batch already exists,
//   // we can repopulate the dispatchers map
//   const treatments = batch.get("treatments");
//   if (
//     !dispatchers.has(batch.id) &&
//     batch.get("status") !== "failed" &&
//     batch.get("status") !== "terminated" &&
//     treatments?.filter((t) => t.factors).length > 0
//   ) {
//     console.log("rebuilding dispatcher");
//     dispatchers.set(batch.id, makeDispatcher({ treatments }));
//   }
//   }
// })

Empirica.on("player", function (ctx, { player }) {
  // console.log("****Player was called here*******")
  // add batch selection logic here
  // set player batch id
  // this is where we can check if the batch is full/max players
  // check if batch full/check if url wrong => send error message
})

Empirica.on("player", "sendVerification", function (ctx, { player }) {
  console.log("!!!!!!!!!!!!! Sending verification email !!!!!!!!!!")
  if (!player.get("sendVerification")) {
    return
  }

  console.log(player.get("verifiedStatus"))

  if (player.get("verifiedStatus") === true) {
    return
  }

  const verificationCode = player.get("verificationCode")
  const emailAddress = player.get("emailAddress")
  console.log(emailAddress)
  if (verificationCode === undefined || emailAddress === undefined) {
    player.set("sendVerification", true)
    return
  }
  sendVerificationEmail(verificationCode, emailAddress)
  console.log({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: "asynchronous empirica",
    TextBody: `Your verification code is: ${verificationCode}`,
  })
  player.set("sendVerification", false)
  return
})

Empirica.on("player", "sendMagicLink", function (ctx, { player }) {
  console.log("!!!!!!!!!!!!! Sending magic link email !!!!!!!!!!")
  if (!player.get("sendMagicLink")) {
    return
  }

  const encryptedId = player.get("encryptedId")
  console.log(encryptedId)
  const url = `http://64.227.30.245:3000/?participantKey=${encryptedId}`
  const emailAddress = player.get("emailAddress")
  console.log(emailAddress)
  if (url === undefined || emailAddress === undefined) {
    player.set("sendMagicLink", true)
    return
  }
  sendURLEmail(url, emailAddress)
  console.log({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: "asynchronous empirica",
    TextBody: `Your magic link is: ${url}`,
  })
  player.set("sendMagicLink", false)
  return
})

Empirica.on("player", "nickname", function (ctx, { player }) {
  const nickname = player.get("nickname")
  const game = player.currentGame

  let gameMessages = game.get("messages")
  game.get("treatment").questions.forEach((_treatment, index) => {
    gameMessages[index] = [
      ...gameMessages[index],
      {
        text: `${nickname} has joined the game`,
        author: "system",
        nickname: "",
        timeStamp: new Date().getTime(),
      },
    ]
  })

  game.set("messages", gameMessages)

  return
})

Empirica.on("player", "join", function (ctx, { player }) {
  console.log("!!!!!!!!!!!!! FIRING PLAYER JOIN!!!!!!!!!!")
  if (!player.get("join")) {
    return
  }

  const filterParams = player.get("filterParams")
  // console.log(`filter key is: ${filterParams}`)

  // console.log("\n---------treatments vector START----------\n")
  let treatmentVector = []
  const allBatches = Array.from(ctx.scopesByKind("batch").values())
  // console.log(`Batch ID: ${allBatches.length}`)
  // console.log(`Number of batches: ${allBatches.length}`)
  allBatches.forEach((_batch) => {
    if (!_batch.isRunning) {
      return
    }
    // console.log(`Batch ID: ${_batch.id}`)
    // console.log(`Batch has ended: ${_batch.hasEnded}`)
    // console.log(`Batch is running : ${_batch.isRunning}`)
    const allTreatments = _batch.get("config").config.treatments
    // console.log("-------- LOOK HERE FOR CONFIGS -----------")
    allTreatments.forEach((_treatment) => {
      // console.log(_treatment.treatment.factors)
      // console.log("here")
      // console.log(_treatment.treatment)

      const currentPlayerCount =
        _batch.get(`${_treatment.treatment.name}PlayerCount`) || 0

      // console.log(
      //   `Current player count: ${currentPlayerCount}\nMax player count ${_treatment.treatment.factors.playerCount}`
      // )

      if (currentPlayerCount < _treatment.treatment.factors.playerCount) {
        treatmentVector = [
          ...treatmentVector,
          {
            batchId: _batch.id,
            hasEnded: _batch.hasEnded,
            treatment: _treatment.treatment.factors,
            treatmentName: _treatment.treatment.name,
          },
        ]
      }

      if (!_batch.get(`${_treatment.treatment.name}PlayerCount`)) {
        _batch.set(`${_treatment.treatment.name}PlayerCount`, 0)
      }

      // console.log(
      //   `Number of players in ${_treatment.treatment.name} is: ${_batch.get(
      //     `${_treatment.treatment.name}PlayerCount`
      //   )}`
      // )
    })
  })

  if (player.currentRound) {
    // TODO look here for bug in intro - blank page needed to refresh before seeing nickname screen
    // case where join is called every refresh, reasigning the player to the game and filling spaces
    console.log(`player: ${player.id} has already been assigned to a game`)
    return
  }

  // console.log(treatmentVector)

  if (treatmentVector.length === 0) {
    // console.log("Error is no batches")
    player.set("error", true)
    player.set("errorCode", "noBatches")
    return
  }

  //01GPK2Z2A02VC5JYCHSCYPMRBA

  const sortedTreatmentVector = treatmentVector.sort((a, b) =>
    a.batchId > b.batchId ? 1 : -1
  )
  // console.log("\n---------sorted vector\n")
  // console.log(sortedTreatmentVector)
  // console.log(filterParams)

  // Object.entries(filterParams)?.forEach((_param) => console.log(_param))

  let filteredBatches = sortedTreatmentVector
  if (filterParams) {
    filteredBatches = sortedTreatmentVector.filter(function (_treatment) {
      return Object.keys(filterParams).every(function (key) {
        if (!Object.keys(_treatment.treatment).includes(key)) {
          return true
        }
        if (key === "question") {
          return _treatment.treatment[key].includes(filterParams[key])
        }
        return _treatment.treatment[key] === filterParams[key]
      })
    })
  }

  // console.log("\n---------available batches\n")
  // console.log(filteredBatches)

  if (filteredBatches.length === 0) {
    // console.log("no games")
    player.set("error", true)
    player.set("errorCode", "gamesFull")
    return
  }

  let finalTreatmentVector = []
  filteredBatches.forEach((_batch) => {
    const observedTreatments = finalTreatmentVector.map((entry) => {
      return entry?.treatmentName
    })
    if (observedTreatments.includes(_batch.treatmentName)) {
      return
    }
    finalTreatmentVector = [...finalTreatmentVector, _batch]
  })
  // console.log("\n---------final vector\n")
  // console.log(finalTreatmentVector)

  shuffleArray(finalTreatmentVector) //shuffles vector in place
  let selectedTreatment = finalTreatmentVector[0] // TODO choose a way of selecting from the filtered batches

  // console.log("\n---------selected batch is:\n")

  // console.log(selectedTreatment)
  // console.log(selectedTreatment.treatment.config)
  // console.log(typeof selectedTreatment.treatment.config)
  const batchId = selectedTreatment.batchId
  // console.log(batchId)
  // console.log(`Error is: ${player.get("errorCode")}`)

  const batch = Array.from(ctx.scopesByKind("batch").values()).find(
    (_batch) => _batch.id === batchId
  )

  const currentPlayerCount = batch.get(
    `${selectedTreatment.treatmentName}PlayerCount`
  )

  Array.from(ctx.scopesByKind("batch").values()).map((_batch) => {
    console.log(`Batch id: ${_batch.id}`, _batch.id === batchId)
  })

  if (batch.games.length === 0) {
    console.warn("no games found")
    // return
  }
  // if (batch.games.length > 0) {
  //   batch.games.forEach((_game) => {
  //     console.log(_game.get("treatment"))
  //   })
  // }

  const availableGames = batch.games
    .filter(function (_game) {
      const curentPlayerCount = _game.players.length || 0
      return curentPlayerCount < selectedTreatment.treatment.playerCount
    })
    .sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : -1))
  // console.log(`Number of potential games: \n ${availableGames.length}`)

  // availableGames.forEach((_game) => {
  //   console.log(_game.get("treatment"))
  // })

  const game =
    availableGames.length === 1
      ? availableGames[0]
      : availableGames[Math.floor(Math.random() * availableGames.length)]

  console.log(`number of games available is: ${availableGames.length}`)

  if (game) {
    console.log("game found")
    player.set("join", false)
    if (game.get("messages") === undefined) {
      const messagesObject = game
        .get("treatment")
        .questions.reduce((acc, _q) => {
          return [...acc, []]
        }, [])

      game.set("messages", messagesObject)
    }
    // console.log("Game here")

    // availableGames.forEach((_game) => {
    //   console.log(
    //     `game 1 timeStamp: ${_game.get("timeStamp")}`,
    //     game.get("timeStamp")
    //   )
    // })
    // console.log(game.get("timeStamp"))

    const oldIds = game.get("playersIds")
    const newIds = oldIds.includes(player.id)
      ? oldIds
      : [player.id, ...oldIds] || []
    // console.log(`old ids:${oldIds}`)
    // console.log(`new ids:${newIds}`)
    game.set("playersIds", newIds)
    game.assignPlayer(player)
    batch.set(
      `${selectedTreatment.treatmentName}PlayerCount`,
      currentPlayerCount + 1
    )

    return
  }

  // console.log("No game here")

  console.log(`********************** STATMENTS FROM TREATMENT********\n`)
  console.log(selectedTreatment.treatment.prePopulatedComments)
  console.log(`***********************************\n`)

  let prePopulatedComments = selectedTreatment.treatment.prePopulatedComments
  if (
    typeof prePopulatedComments === "string" ||
    prePopulatedComments instanceof String
  ) {
    prePopulatedComments = prePopulatedComments
      .split("##")
      .reduce((accumulator, _comments, index) => {
        return {
          ...accumulator,
          [index]: _comments.split("%%").map((_comment, subIndex) => {
            return {
              id: `prePopulate_${subIndex}`,
              text: _comment,
              timeStamp: null,
              author: "prePopulated",
              agree: 0,
              disagree: 0,
              uncertain: 0,
            }
          }),
        }
      }, {})

    selectedTreatment.treatment["prePopulatedComments"] = prePopulatedComments
  }

  // console.log("prepopulated comments array: ", prePopulatedComments)

  // Object.entries(prePopulatedComments).forEach(([key, value]) => {
  //   console.log(prePopulatedComments[key])
  // })

  // console.log(prePopulatedComments["0"])
  let questionsArray = selectedTreatment.treatment.questions
  if (typeof questionsArray === "string" || questionsArray instanceof String) {
    questionsArray = questionsArray.split("%%").map((_questionInfo) => {
      const _questionSplit = _questionInfo.split("&&")
      return {
        question: _questionSplit[0],
        moreDetails: _questionSplit[1],
      }
    })
    selectedTreatment.treatment["questions"] = questionsArray
  }

  // console.log("----- Selected treatment with questions array ------")
  // console.log(selectedTreatment)

  batch.addGame({
    playersIds: [player.id],
    comments: prePopulatedComments,
    treatment: selectedTreatment.treatment,
    timeStamp: new Date().getTime(),
  })
  console.log("game added")
  player.set("join", true)
  // setTimeout(() => {
  //   player.set("join", true)
  // }, 1000)
})

// OLD CODE FROM NICOLAS - was breaking games by assisgning too many players!!!!
// Empirica.on("game", function (ctx, { game }) {
//   for (const playerID of game.get("playersIds")) {
//     const player = ctx.scopesByKind("player").get(playerID)
//     if (player) {
//       game.assignPlayer(player)
//     } else {
//       console.warn("player not found", playerID)
//     }
//   }
// })

Empirica.on("player", "gameID", function (ctx, { player }) {
  console.log("player:gameID was called now")
  // player.set("joinEmailSent", false)
  // if (!player.get("joinEmailSent")) {
  //   nodemailSend(player.get("nickname"))
  //   player.set("joinEmailSent", true)
  // }

  // console.log("email should have sent")

  // console.log(player.currentGame)
  player.currentGame.start()

  // this is GOLD
  const initialSeenComments = player.currentGame
    .get("treatment")
    .questions.reduce((accumulator, _q, index) => {
      return {
        ...accumulator,
        [index]: [],
      }
    }, {})

  // console.log("!!!!!!!!!!! INTITIAL SEEN COMMENTS OBJECT !!!!!!!")
  // console.log(initialSeenComments)
  !player.get("seenComments") && player.set("seenComments", initialSeenComments)
})

Empirica.onGameStart(({ game }) => {
  // cron.schedule(
  //   "30 13 * * *",
  //   () => {
  //     if (!game) {
  //       return
  //     }

  //     game.players.forEach((_player) => {
  //       const nickname = _player.get("nickname")
  //       const time = new Date()

  //       sendGmail((text = `Hi player: ${nickname}.\n The time is ${time}`))
  //     })
  //   },
  //   {
  //     scheduled: true,
  //     timezone: "Europe/London",
  //   }
  // )
  console.log("game started")
  const endDate = new Date(game.get("treatment").endDate)
  const currentDate = new Date(endDate)
  console.log(`endDate: ${endDate} | seconds: ${endDate.getTime()}`)
  console.log(`currentDate: ${currentDate} | seconds: ${currentDate.getTime()}`)
  const duration = Math.floor(
    (currentDate.getTime() - new Date().getTime()) / 1000
  )
  console.log(`++++++++ duration of game: ${duration}++++++`)
  const round = game.addRound({ name: "Game" })
  round.addStage({ name: "Conversation", duration: duration }) //604800
  const round2 = game.addRound({ name: "FinalEstimate" })
  round2.addStage({ name: "FinalEstimate", duration: 86400 })
})

Empirica.onRoundStart(({ round }) => {
  console.log(
    `xxxxxxxxxxxxxxxxxxxName of the round is: ${round.get(
      "name"
    )}xxxxxxxxxxxxxxxxx`
  )
  // round.currentGame.players.forEach((_player) => {
  //   console.log(_player.Identifier)
  // })
})

// Empirica.on("game", "checkMessages", function (ctx, { game }) {
//   if (!game.get("checkMessages")) {
//     return
//   }
//   console.log("checking messages")
//   game.set("checkMessages", false)
//   const index = game.get("checkMessages")
//   const players = game.players
//   players.forEach((_player) => {
//     console.log(
//       _player.get("nickname"),
//       _player.get("lastSeenMessages")[`${index}`]
//     )
//   })
// })

Empirica.onStageStart(({ stage }) => {})

Empirica.onStageEnded(({ stage }) => {})

Empirica.onRoundEnded(({ round }) => {})

Empirica.onGameEnded(({ game }) => {})
