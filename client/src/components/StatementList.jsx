import React from 'react'
import { useGame } from "@empirica/core/player/classic/react"
import { StatementCard } from './StatementCard'

// TODO map statemtns to StatementCard ==> need statement (text) and yes, no pass count


export function StatementList() {
    const game = useGame()

    if (!game) {
        return "Loading..."
    }

    const statements = game.get("statements")

    return (
        <div className="row-start-4 col-start-6 row-span-12 col-span-2 border-solid rounded border shadow p-4 overflow-x-hidden flex flex-col space-y-2">
            <h1 className="m-b-2">Statements: </h1>
            {statements.map((_s, index) => 
                    <StatementCard key={index} statement={_s.text} agree={_s.agree} pass={_s.pass} disagree={_s.disagree}/>
                )
            }
             </div> )
}