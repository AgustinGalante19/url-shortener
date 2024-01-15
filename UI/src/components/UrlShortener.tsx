import UrlIcon from "../assets/icons/url.svg"

function UrlShortener() {
  return (
    <form className='flex justify-center mt-8' id='form-url'>
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
      >
        Shorten
      </button>
    </form>
  )
}

export default UrlShortener
