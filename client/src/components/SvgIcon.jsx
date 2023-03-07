import React from "react"

export function InfoIcon({ showInstructions, setShowInstructions, isMobile }) {
  function handleClick() {
    setShowInstructions(!showInstructions)
  }
  return (
    <svg
      className={`${
        isMobile ? "h-25px w-25px self-center" : "h-1/2 w-1/2"
      } hover:border hover:border-solid hover:rounded hover:shadow`}
      clip-rule="evenodd"
      fill-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
    >
      <path
        d="m22 16.75c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75z"
        fill-rule="nonzero"
      />
    </svg>
  )
}
