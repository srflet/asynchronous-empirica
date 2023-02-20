import React from 'react'

export function MobileBanner({view, setView}) {

    function handleClick(event){
        event.preventDefault()
        const target = event.target.value
        console.log("🚀 ~ file: MobileBanner.jsx:8 ~ handleClick ~ target:", target)

        setView(target)
    }
    return (
        <div className="w-full min-w-max bg-black justify-evenly flex flex-wrap border row-start-1 col-start-1 row-span-1 col-span-1 border-solid border shadow">
            <button value="estimate" className={`p-x-2 p-y-1 border border-solid text-white ${view==='estimate' ? "hover:bg-blue-400 bg-blue-500" : "hover:bg-gray-400 bg-gray-500"}`} onClick={handleClick}>Other Estimates</button>
            <button value="vote" className={`p-x-2 p-y-1 border border-solid text-white ${view==='vote' ? "hover:bg-blue-400 bg-blue-500" : "hover:bg-gray-400 bg-gray-500"}`} onClick={handleClick}>Vote/Comment</button>
            <button value="statements" className={`p-x-2 p-y-1 border border-solid text-white ${view==='statements' ? "hover:bg-blue-400 bg-blue-500" : "hover:bg-gray-400 bg-gray-500"}`} onClick={handleClick}>Vote Tally</button>
        </div>
    )
}
