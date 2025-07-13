/**
 * Node modules
 */
import { PlayCircleIcon } from 'lucide-react';

/**
 * Assets
 */
import PetBannerImage from '@/assets/pet-banner.png';

/**
 * Components
 */
import { Button } from '@/components/ui/button';

const PetBanner = () => {
  return (
    <div className="relative mx-auto mb-16 flex h-96 max-w-7xl items-center overflow-hidden rounded-lg bg-[#003459]">
      <div className="absolute -bottom-[580px] -left-52 aspect-square w-[800px] rotate-[30deg] rounded-[99px] bg-[#002A48]" />
      <div className="absolute -top-[380px] -right-56 aspect-square w-[800px] rotate-[30deg] rounded-[99px] bg-[#FCEED5]" />
      <img
        src={PetBannerImage}
        alt="Pet banner image"
        className="absolute bottom-0 z-10  opacity-80 sm:opacity-100 transition-opacity duration-300"
      />
      <div className="z-10 mx-14 flex-1 space-y-4 text-right">
        <h1 className="relative text-6xl leading-tight font-bold text-[#003459]">
          One More Friend
        </h1>
        <h2 className="text-4xl font-bold text-[#003459]">
          Thousands More Fun!
        </h2>
        <p className="ml-auto max-w-[450px] text-sm text-[#003459]/80">
          Having a pet means you have more joy, a new friend, a happy person who
          will always be with you to have fun. We have 200+ different pets that
          can meet your needs!
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            size="lg"
            className="border-[#003459] bg-transparent text-[#003459] hover:bg-[#003459] hover:text-white"
          >
            View Intro
            <PlayCircleIcon className="size-5" />
          </Button>
          <Button size="lg" className="bg-[#003459] hover:bg-[#003459]/90">
            Explore Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetBanner;
