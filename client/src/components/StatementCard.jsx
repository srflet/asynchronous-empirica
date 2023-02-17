import React from 'react'

export function StatementCard({statement, agree, pass, disagree}) {
    return (
        <div className="flex flex-col border border-solid rounded shadow">
            <p className="self-left text-left p-4 m-auto">{statement}</p>
            <div className="justify-evenly flex flex-wrap p-b-2">
                <p className="">Agree: {agree || 0}</p>
                <p className="">Pass: {pass || 0}</p>
                <p className="">Disagree: {disagree || 0}</p>
            </div>
            
        </div>
    )
}
