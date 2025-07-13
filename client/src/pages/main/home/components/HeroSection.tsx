import { PlayCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroBannerSectionImage from '@/assets/hero-section.png';

const HeroSection = () => {
  return (
    <section className="relative h-[calc(100vh-78px)] overflow-hidden rounded-b-4xl bg-gradient-to-r from-[#FCEED5] to-[#FFE7BA] px-8 py-16">
      <div className="mx-auto flex max-w-7xl items-center">
        {/* Text content */}
        <div className="mt-20 flex-1 space-y-6 z-[10] relative">
          <div className="relative">
            <h1 className="relative z-[1] text-6xl leading-tight font-bold text-[#003459]">
              One More Friend
            </h1>
            <div className="absolute -top-0.5 -left-5 z-0 h-20 w-20 rotate-12 rounded-2xl bg-[#F7DBA7]  opacity-30 sm:opacity-100 transition-opacity duration-300" />
          </div>
          <h2 className="text-4xl font-bold text-[#003459]">
            Thousands More Fun!
          </h2>
          <p className="max-w-lg text-[#003459]/80">
            Having a pet means you have more joy, a new friend, a happy person
            who will always be with you to have fun. We have 200+ different pets
            that can meet your needs!
          </p>
          <div className="flex space-x-4">
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

      {/* Decorative background shapes */}
      <div className="absolute right-28 -bottom-60 z-[2] aspect-square w-[635px] rotate-[25deg] rounded-[99px] bg-[#F7DBA7]  opacity-30 sm:opacity-100 transition-opacity duration-300" />
      <div className="absolute right-40 -bottom-60 z-[1] aspect-square w-[635px] rotate-[10deg] rounded-[99px] bg-[#002A48]  opacity-30 sm:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-[630px] left-5 z-[0] aspect-square w-[635px] rotate-[60deg] rounded-[99px] bg-[#F7DBA7]  opacity-30 sm:opacity-100 transition-opacity duration-300" />

      {/* Image */}
      <img
        src={HeroBannerSectionImage}
        className="absolute bottom-0 right-0 z-[5] opacity-80 sm:opacity-100 transition-opacity duration-300"
        alt="Hero banner image"
      />
    </section>
  );
};

export default HeroSection;
