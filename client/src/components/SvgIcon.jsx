import React from "react"

export function InfoIcon({ showOverlay, setShowOverlay, isMobile }) {
  function handleClick() {
    setShowOverlay(!showOverlay)
  }
  return (
    <svg
      className={`${
        isMobile
          ? "h-25px w-25px self-center fill-white hover:bg-gray-700"
          : "h-1/2 w-1/2 fill-black"
      } hover:border hover:border-solid hover:rounded hover:shadow`}
      clip-rule="evenodd"
      fill-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
    >
      <path d="M13.25 7c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25zm10.75 5c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-2 0c0-5.514-4.486-10-10-10s-10 4.486-10 10 4.486 10 10 10 10-4.486 10-10zm-13-2v2h2v6h2v-8h-4z" />
    </svg>
  )
}
