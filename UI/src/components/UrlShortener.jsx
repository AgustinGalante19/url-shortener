import { useState } from "react"
import CloseIcon from "./icons/CloseIcon.jsx"
import CopyIcon from "./icons/CopyIcon.jsx"

function UrlShortener() {
  const [isLoading, setIsLoading] = useState(false)
  const [urlResult, setUrlResult] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  return (
    <div>
      <form
        className='flex justify-center mt-8'
        onSubmit={(e) => {
          e.preventDefault()
          setIsLoading(true)
          const fields = new FormData(e.target)
          const url = fields.get("url")
          const API_URL = import.meta.env.PUBLIC_API_URL
          fetch(`${API_URL}/shortUrl`, {
            method: "POST",
            body: JSON.stringify({
              fullUrl: url,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((responseJson) => {
              const { result } = responseJson
              setUrlResult(result)
              setIsAlertOpen(true)
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false))
        }}
      >
        <div className='relative'>
          <input
            className='px-4 py-2 text-xl rounded-y-md rounded-l-md bg-midnight border-y-2 border-l-2 border-gray-300 w-96 focus:border-slate-200 focus:bg-midnightLight transition-colors'
            placeholder='https://url-shortener.com'
            type='url'
            name='url'
            required
          />
          <div className='absolute text-red-400 inset-y-0 right-0 flex items-center pr-4'>
            <img src='/url.svg' alt='url' width={22} height={22} />
          </div>
        </div>
        <button
          className='border-2 rounded-r-md px-2 border-gray-300 bg-light text-midnightLight font-semibold hover:bg-transparent hover:text-light transition-colors duration-200 disabled:bg-neutral-800 disabled:text-white'
          id='submit-button'
          disabled={isLoading}
        >
          Shorten
        </button>
      </form>
      {urlResult && (
        <div className='mt-12'>
          {isAlertOpen && (
            <div className='space-y-4 relative mb-4'>
              <button
                className='absolute right-0 mr-2 mt-2'
                type='button'
                onClick={() => setIsAlertOpen(false)}
              >
                <CloseIcon />
              </button>
              <div
                class='p-4 mb-4 text-green-800 rounded bg-green-50 dark:bg-neutral-800 dark:text-green-500 font-medium'
                role='alert'
              >
                <span>✅Url generated successfully </span>
              </div>
            </div>
          )}
          <div className='p-4 flex items-center justify-between rounded-md bg-midnightLight border-2 border-gray-300'>
            <span>{urlResult}</span>
            <button>
              <CopyIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UrlShortener
