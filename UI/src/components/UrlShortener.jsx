import { useState } from 'react';
import CopyIcon from './icons/CopyIcon.jsx';
import CheckIcon from './icons/CheckIcon.jsx';
import '../styles/globals.css';
import LoaderIcon from './icons/LoaderIcon.jsx';
import LinkIcon from './icons/Link.jsx';

function UrlShortener() {
  const [isLoading, setIsLoading] = useState(false);
  const [urlResult, setUrlResult] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isCheckHidden, setIsCheckHidden] = useState(true);

  const handleCopy = (e) => {
    e.preventDefault();
    setIsCheckHidden(false);
    window.navigator.clipboard.writeText(urlResult);
    setTimeout(() => {
      setIsCheckHidden(true);
    }, 1500);
  };

  return (
    <div id='url-form'>
      <form
        className='flex justify-center mt-8'
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          setIsAlertOpen(false);
          const fields = new FormData(e.target);
          const url = fields.get('url');
          const API_URL = import.meta.env.PUBLIC_API_URL;
          fetch(`${API_URL}/shortUrl`, {
            method: 'POST',
            body: JSON.stringify({
              fullUrl: url,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((responseJson) => {
              const { result } = responseJson;
              setUrlResult(result);
              setIsAlertOpen(true);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
        }}
      >
        <div className='relative w-full'>
          <input
            className='px-4 py-2 text-xl rounded-y-md rounded-l-md bg-midnight border-y-2 border-l-2 border-gray-300 w-full focus:border-slate-200 focus:bg-midnightLight transition-colors'
            placeholder='https://url-shortener.com'
            type='url'
            name='url'
            required
          />
          <div className='absolute text-red-400 inset-y-0 max-sm:hidden right-0 flex items-center pr-4'>
            <img
              src='/url.svg'
              alt='url'
              className='text-white'
              width={22}
              height={22}
            />
          </div>
        </div>
        <button
          className='border-2 rounded-r-md px-2 border-gray-300 bg-light text-midnightLight font-semibold hover:bg-neutral-300 transition-colors duration-200 disabled:bg-neutral-800'
          id='submit-button'
          disabled={isLoading}
        >
          {isLoading ? (
            <div className='animate-spin'>
              <LoaderIcon />
            </div>
          ) : (
            <div>
              <span className='max-sm:hidden'>Shorten</span>
              <LinkIcon className='hidden max-sm:block text-black' />
            </div>
          )}
        </button>
      </form>
      {urlResult && (
        <div className='mt-12' id='url-form'>
          {isAlertOpen && (
            <div className='space-y-4 relative mb-4 w-fit mx-auto'>
              <div
                className='p-4 mb-4 text-[#53f948] rounded bg-[#163e1b] font-medium'
                role='alert'
              >
                <span>Url generated successfully </span>
              </div>
            </div>
          )}
          <div className='relative'>
            <div className='p-4 flex items-center justify-between rounded-md bg-midnightLight border-gray-300 z-10'>
              <a
                href={urlResult}
                target='_blank'
                className='underline text-indigo-600'
              >
                {urlResult}
              </a>
              <button
                onClick={handleCopy}
                type='button'
                title='Copy Link'
                className='text-green-600'
              >
                {isCheckHidden ? <CopyIcon /> : <CheckIcon />}
              </button>
            </div>
            <div className='absolute w-full z-[-1] rounded-md bg-neutral-700 blur-sm top-0 h-14' />
          </div>
        </div>
      )}
    </div>
  );
}

export default UrlShortener;
