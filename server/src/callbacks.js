import { ClassicListenersCollector } from "@empirica/core/admin/classic"
export const Empirica = new ClassicListenersCollector()
import { usePlayers } from "@empirica/core/player/classic/react"
var cron = require("node-cron")

// ------------------- Batch callbacks ---------------------------

Empirica.on("batch", (_, { batch }) => {
  if (!batch.get("initialized")) {
    const { config } = batch.get("config")
    console.log(config)
    console.log(config.launchDate)
    console.log(config.endDate)
    console.log(config.dispatchWait)
    console.log(config.treatmentFile)
    batch.set("maxParticipants", config.nParticipants)
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
  }
})

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
    console.log(`Batch ID: ${_batch.id}`)
    console.log(`Batch has ended: ${_batch.hasEnded}`)
    console.log(`Batch Time: ${_batch.createdAt}`)
    const allTreatments = _batch.get("config").config.treatments
    allTreatments.forEach((_treatment) => {
      console.log(_treatment.treatment.factors)

      treatmentVector = [
        ...treatmentVector,
        {
          batchId: _batch.id,
          hasEnded: _batch.hasEnded,
          treatment: _treatment.treatment.factors,
          treatmentName: _treatment.treatment.name,
        },
      ]
    })
  })

  console.log(treatmentVector)

  const sortedTreatmentVector = treatmentVector.sort((a, b) =>
    a.batchId > b.batchId ? 1 : -1
  )
  console.log("\n---------sorted vector\n")
  console.log(sortedTreatmentVector)
  console.log(`filter params:`)
  console.log(filterParams)
  Object.entries(filterParams).forEach((_param) => console.log(_param))

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
  const selectectedBatch = filteredBatches[0] // TODO choose a way of selecting from the filtered batches
  const batchId = selectectedBatch.batchId
  console.log(batchId)
  console.log(selectectedBatch)
  console.log("\n---------treatments vector END----------\n")

  const batch = Array.from(ctx.scopesByKind("batch").values()).find(
    (_batch) => _batch.id === batchId
  )

  Array.from(ctx.scopesByKind("batch").values()).map((_batch) => {
    console.log(`Batch id: ${_batch.id}`, _batch.id === batchId)
  })

  console.log(batch)

  if (batch.games.length === 0) {
    console.warn("no games found")
    // return
  }

  const availableGames = batch.games
    .filter((_game) => {
      return _game.players.length < selectectedBatch.treatment.playerCount
    })
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
  console.log(`Number of potential games: \n ${availableGames.length}`)

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
        `game 1 timestamp: ${_game.get("timestamp")}`,
        game.get("timestamp")
      )
    })
    console.log(game.get("timestamp"))

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
    treatment: selectectedBatch.treatment,
    timestamp: new Date().getTime(),
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
