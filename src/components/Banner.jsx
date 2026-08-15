import { Separator } from "@heroui/react";

const Banner = () => {
  return (
    <div className="bg-[url('/assets/Banner.png')] bg-cover bg-center text-white flex justify-between flex-col items-center gap-5 min-h-[150px] md:h-150 py-10 md:py-0">
      <div className="p-4 md:p-10 text-center flex justify-center flex-col items-center gap-3.5 flex-1 mt-10 md:mt-0">
        <h1 className="text-4xl md:text-7xl font-bold md:font-normal">
          Discover Your <br /> Next Adventure
        </h1>

        <p className="text-lg md:text-2xl px-4 md:px-0">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="flex gap-5">
          <button className="uppercase bg-cyan-500 px-5 py-3 cursor-pointer">
            Explore Now
          </button>

          <button className="uppercase px-5 py-3 bg-white/50 cursor-pointer">
            View Destination
          </button>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-sm flex flex-col sm:flex-row justify-between gap-3 sm:gap-5 w-[90%] md:w-auto p-4 sm:p-0 items-center rounded-lg sm:rounded-none mb-10 md:mb-0">
        <div className="px-3 text-center sm:text-left">
          <h3 className="text-sm font-semibold sm:font-normal">Location</h3>
          <p className="text-xs">Address, City or Zip</p>
        </div>

         <Separator variant="tertiary" orientation="vertical" className="hidden sm:block" />
         <div className="w-full h-px bg-white/20 sm:hidden"></div>

        <div className="px-3 text-center sm:text-left">
          <h3 className="text-sm font-semibold sm:font-normal">Date/Duration</h3>
          <p className="text-xs">Anytime/3 Days</p>
        </div>

        <Separator variant="tertiary" orientation="vertical" className="hidden sm:block" />
        <div className="w-full h-px bg-white/20 sm:hidden"></div>

        <div className="px-3 text-center sm:text-left">
          <h3 className="text-sm font-semibold sm:font-normal">Budget</h3>
          <p className="text-xs">$0-$3000</p>
        </div>

        <Separator variant="tertiary" orientation="vertical" className="hidden sm:block" />
        <div className="w-full h-px bg-white/20 sm:hidden"></div>

        <div className="px-3 text-center sm:text-left">
          <h3 className="text-sm font-semibold sm:font-normal">People</h3>
          <p className="text-xs">5-10</p>
        </div>

        <div className="bg-cyan-500 py-3 sm:py-2 px-8 sm:px-4 w-full sm:w-auto text-center cursor-pointer mt-2 sm:mt-0 sm:h-full flex items-center justify-center">
          <h3 className="uppercase font-semibold sm:font-normal">Search</h3>
        </div>
      </div>
    </div>
  );
};

export default Banner;