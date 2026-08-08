import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full px-4 bg-gray-50/50">
      <div className="max-w-md w-full p-8 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        {/* Simple Compass / Lost Icon */}
        <div className="w-20 h-20 mb-8 text-[#0891b2] bg-[#0891b2]/10 rounded-2xl flex items-center justify-center rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
          </svg>
        </div>
        
        <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Destination Not Found</h2>
        
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Oops! Looks like you have wandered off the map. The page you are looking for does not exist or has been moved.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-[#0891b2] rounded-xl hover:bg-[#067a96] transition-all duration-200 gap-2 w-full active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
