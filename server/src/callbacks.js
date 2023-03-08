import { ClassicListenersCollector } from "@empirica/core/admin/classic"
export const Empirica = new ClassicListenersCollector()

var cron = require("node-cron")

// function shuffle(array) {

// }

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
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
  console.log("****Player was called here*******")

  // add batch selection logic here
  // set player batch id
  // this is where we can check if the batch is full/max players
  // check if batch full/check if url wrong => send error message
})

Empirica.on("player", "join", function (ctx, { player }) {
  if (!player.get("join")) {
    return
  }

  const filterParams = player.get("filterParams")
  console.log(`filter key is: ${filterParams}`)

  console.log("\n---------treatments vector START----------\n")
  let treatmentVector = []
  const allBatches = Array.from(ctx.scopesByKind("batch").values())
  console.log(`Batch ID: ${allBatches.length}`)
  console.log(`Number of batches: ${allBatches.length}`)
  allBatches.forEach((_batch) => {
    if (!_batch.isRunning) {
      return
    }
    console.log(`Batch ID: ${_batch.id}`)
    console.log(`Batch has ended: ${_batch.hasEnded}`)
    console.log(`Batch is running : ${_batch.isRunning}`)
    const allTreatments = _batch.get("config").config.treatments
    allTreatments.forEach((_treatment) => {
      console.log(_treatment.treatment.factors)

      const currentPlayerCount =
        _batch.get(`${_treatment.treatment.name}PlayerCount`) || 0

      console.log(
        `Current player count: ${currentPlayerCount}\nMax player count ${_treatment.treatment.factors.playerCount}`
      )

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

      console.log(
        `Number of players in ${_treatment.treatment.name} is: ${_batch.get(
          `${_treatment.treatment.name}PlayerCount`
        )}`
      )
    })
  })

  console.log(treatmentVector)

  if (treatmentVector.length === 0) {
    console.log("Error is no batches")
    player.set("error", true)
    player.set("errorCode", "noBatches")
    return
  }

  //01GPK2Z2A02VC5JYCHSCYPMRBA

  const sortedTreatmentVector = treatmentVector.sort((a, b) =>
    a.batchId > b.batchId ? 1 : -1
  )
  console.log("\n---------sorted vector\n")
  console.log(sortedTreatmentVector)
  // console.log(filterParams)

  Object.entries(filterParams)?.forEach((_param) => console.log(_param))

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

  console.log("\n---------available batches\n")
  console.log(filteredBatches)

  if (filteredBatches.length === 0) {
    console.log("no games")
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
  console.log("\n---------final vector\n")
  console.log(finalTreatmentVector)

  shuffleArray(finalTreatmentVector) //shuffles vector in place
  const selectedTreatment = finalTreatmentVector[0] // TODO choose a way of selecting from the filtered batches

  console.log("\n---------selected batch is:\n")

  console.log(selectedTreatment)

  const batchId = selectedTreatment.batchId
  console.log(batchId)
  console.log(`Error is: ${player.get("errorCode")}`)

  const batch = Array.from(ctx.scopesByKind("batch").values()).find(
    (_batch) => _batch.id === batchId
  )

  const currentPlayerCount = batch.get(
    `${selectedTreatment.treatmentName}PlayerCount`
  )
  batch.set(
    `${selectedTreatment.treatmentName}PlayerCount`,
    currentPlayerCount + 1
  )

  Array.from(ctx.scopesByKind("batch").values()).map((_batch) => {
    console.log(`Batch id: ${_batch.id}`, _batch.id === batchId)
  })

  if (batch.games.length === 0) {
    console.warn("no games found")
    // return
  }
  if (batch.games.length > 0) {
    batch.games.forEach((_game) => {
      console.log(_game.get("treatment"))
    })
  }

  const availableGames = batch.games
    .filter(function (_game) {
      const curentPlayerCount = _game.players.length || 0
      return (
        _game.get("treatment").question ===
          selectedTreatment.treatment.question &&
        curentPlayerCount < selectedTreatment.treatment.playerCount
      )
    })
    .sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : -1))
  console.log(`Number of potential games: \n ${availableGames.length}`)

  availableGames.forEach((_game) => {
    console.log(_game.get("treatment"))
  })

  const game =
    availableGames.length === 1
      ? availableGames[0]
      : availableGames[Math.floor(Math.random() * availableGames.length)]

  console.log(`number of games available is: ${availableGames.length}`)

  // console.log(game)
  if (game) {
    player.set("join", null)
    console.log("Game here")

    availableGames.forEach((_game) => {
      console.log(
        `game 1 timeStamp: ${_game.get("timeStamp")}`,
        game.get("timeStamp")
      )
    })
    console.log(game.get("timeStamp"))

    const oldIds = game.get("playersIds")
    const newIds = oldIds.includes(player.id) ? oldIds : [player.id, ...oldIds]
    console.log(`old ids:${oldIds}`)
    console.log(`new ids:${newIds}`)
    game.set("playersIds", newIds)
    game.assignPlayer(player)
    return
  }

  console.log("No game here")

  batch.addGame({
    playersIds: [player.id],
    gameCondition: filterParams.question,
    statements: [],
    treatment: selectedTreatment.treatment,
    timeStamp: new Date().getTime(),
  })
})

Empirica.on("game", function (ctx, { game }) {
  for (const playerID of game.get("playersIds")) {
    const player = ctx.scopesByKind("player").get(playerID)
    if (player) {
      game.assignPlayer(player)
    } else {
      console.warn("player not found", playerID)
    }
  }
})

Empirica.on("player", "gameID", function (ctx, { player }) {
  console.log("player:gameID was called now")
  // console.log(player.currentGame)
  player.currentGame.start()

  !player.get("seenStatements") && player.set("seenStatements", [])
})

Empirica.onGameStart(({ game }) => {
  // cron.schedule("*/2 * * * * *", () => {
  //   if (!game) {
  //     return
  //   }

  //   console.log(`\n\ngame: ${game.id}\n players: ${game.get("playersIds")}`)
  //   game.players.map((_player) => {
  //     return console.log(_player.id)
  //   })
  // })
  console.log("game started")
  const round = game.addRound({ name: "Conversation" })
  round.addStage({ name: "Conversation", duration: 604800 })
})

Empirica.onRoundStart(({ round }) => {})

Empirica.onStageStart(({ stage }) => {})

Empirica.onStageEnded(({ stage }) => {})

Empirica.onRoundEnded(({ round }) => {})

Empirica.onGameEnded(({ game }) => {})
