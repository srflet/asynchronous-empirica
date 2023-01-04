import { ClassicListenersCollector } from "@empirica/core/admin/classic"
export const Empirica = new ClassicListenersCollector()

Empirica.on("player", "answer", function (ctx, { player }) {
  if (!player.get("answer")) {
    return
  }

  const batch = Array.from(ctx.scopesByKind("batch").values())[0]
  if (!batch) {
    console.warn("no batches")

    return
  }

  const topics = batch.get("topics") || []

  if (topics.length === 0) {
    return
  }

  const topic = topics[Math.floor(Math.random() * topics.length)]
  const game = batch.games.find((game) => game.get("topic").id === topic.id)
  if (game) {
    game.assignPlayer(player)
    player.set("answer", null)
    return
  }

  batch.addGame({
    topic,
    playersIds: [player.id],
  })
})

Empirica.on("player", "join", function (ctx, { player }) {
  if (!player.get("join")) {
    return
  }

  const condition = player.get("condition")

  console.log(`condition is: ${condition}`)

  console.log("\n\n---------batch info START----------\n")

  console.log(
    `\nnumber of batches: ${
      Array.from(ctx.scopesByKind("batch").values()).length
    }\n`
  )
  console.log("\n---------batch info END----------\n\n")

  const batch = Array.from(ctx.scopesByKind("batch").values())[0]
  if (batch.games.length === 0) {
    console.warn("no games found")
    // return
  }

  console.log(`number of games available is: ${batch.games.length}`)

  const game = batch.games.filter(
    (_g) => _g.get("gameCondition") === condition
  )[0]
  // console.log(game)
  if (game) {
    console.log("Game here")
    const oldIds = game.get("playersIds")
    const newIds = [player.id, ...oldIds]
    console.log(`old ids:${oldIds}`)
    console.log(`new ids:${newIds}`)
    game.set("playersIds", newIds)
    game.assignPlayer(player)
    player.set("join", null)
    return
  } else {
    console.log("No game here")
  }

  const factors = batch
    .get("config")
    .config.treatments.find((_treatment) =>
      _treatment.treatment.name.toLowerCase().includes(condition)
    ).treatment.factors
  // console.log(batch.get("config").config.treatments.length)
  console.log(batch.get("config").config.treatments)

  console.log(`---------treatments here---------\n${factors}`)

  // factors = batch
  //   .get("config")
  //   .config.treatments.find((_treatment) =>
  //     _treatment.name.toLowerCase().includes(condition)
  //   )
  // console.log(factors)

  batch.addGame({
    playersIds: [player.id],
    gameCondition: condition,
    statements: [],
    treatment: factors,
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

Empirica.on("player", "create", function (ctx, { player }) {
  const topic = player.get("create")
  if (!topic) {
    return
  }

  const batch = Array.from(ctx.scopesByKind("batch").values())[0]
  if (!batch) {
    console.warn("no batches")

    return
  }

  player.set("create", null)

  // Set random id on topic
  topic.id = Math.random().toString(36).substring(2, 15)

  console.log("player create", topic)

  const topics = batch.get("topics") || []
  topics.push(topic)
  batch.set("topics", topics)

  const playerTopics = player.get("topics") || []
  playerTopics.push(topic)
  player.set("topics", playerTopics)
})

Empirica.onGameStart(({ game }) => {
  //
  // Select some stuff other players have said
  //
  console.log("game started")
  const round = game.addRound({ name: "Conversation" })
  round.addStage({ name: "Conversation", duration: 604800 })
})

Empirica.onRoundStart(({ round }) => {})

Empirica.onStageStart(({ stage }) => {})

Empirica.onStageEnded(({ stage }) => {})

Empirica.onRoundEnded(({ round }) => {})

Empirica.onGameEnded(({ game }) => {})
