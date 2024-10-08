import { useState } from 'react';
import CopyIcon from './icons/CopyIcon.jsx';
import CheckIcon from './icons/CheckIcon.jsx';
import '../styles/globals.css';
import LoaderIcon from './icons/LoaderIcon.jsx';
import LinkIcon from './icons/Link.jsx';

function UrlShortener() {
  const [isLoading, setIsLoading] = useState(false);
  const [urlResult, setUrlResult] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState({
    isOpen: false,
    message: '',
    variant: 'success',
  });
  const [isCheckHidden, setIsCheckHidden] = useState(true);

  const handleCopy = (e) => {
    e.preventDefault();
    setIsCheckHidden(false);
    window.navigator.clipboard.writeText(urlResult);
    setTimeout(() => {
      setIsCheckHidden(true);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setIsAlertOpen({ ...isAlertOpen, isOpen: false });
      setUrlResult(null);
      const fields = new FormData(e.target);
      const url = fields.get('url');
      const API_URL = import.meta.env.PUBLIC_API_URL;
      const request = await fetch(`${API_URL}/shortUrl`, {
        method: 'POST',
        body: JSON.stringify({
          fullUrl: url,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseJson = await request.json();
      const response = responseJson;
      setUrlResult(response.result);
      setIsAlertOpen({
        isOpen: true,
        message: response.message,
        variant: request.status === 400 ? 'warning' : 'success',
      });
    } catch (err) {
      setUrlResult(null);
      setIsAlertOpen({
        isOpen: true,
        variant: 'warning',
        message: 'Something went wrong :(',
      });
      console.log('ERROR', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id='url-form'>
      <form className='flex justify-center mt-8' onSubmit={handleSubmit}>
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
            <div className='animate-spin text-white'>
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
      {isAlertOpen.isOpen && (
        <div className='space-y-4 relative mt-12 mb-4 w-fit mx-auto'>
          <div
            className={`p-4 mb-4 rounded ${
              isAlertOpen.variant === 'success'
                ? 'text-[#53f948] bg-[#163e1b]'
                : 'text-[#f9c648] bg-[#3e3716]'
            } font-medium`}
            role='alert'
          >
            <span>{isAlertOpen.message} </span>
          </div>
        </div>
      )}
      {urlResult && (
        <div id='url-form'>
          <div className='relative'>
            <div className='p-4 max-sm:p-2 flex items-center justify-between rounded-md bg-midnightLight border-gray-300 z-10'>
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
                className='text-green-600 max-sm:hidden'
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
