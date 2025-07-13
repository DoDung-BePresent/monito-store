import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-[#FCEED5] px-4 py-12">
      {/* Register section */}
      <div className="mx-auto max-w-7xl rounded-md bg-[#003459]">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <h2 className="text-2xl font-bold text-white sm:max-w-[380px]">
            Register Now So You Don't Miss Our Programs
          </h2>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2 sm:bg-white sm:p-2.5 sm:rounded-md">
            <Input
              placeholder="Enter your email"
              className="w-full sm:w-[400px] bg-white"
            />
            <Button className="w-full sm:w-auto bg-[#003459] hover:bg-[#003459]/90">
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation + social icons */}
      <div className="mx-auto mt-8 max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:py-10">
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {['Home', 'Category', 'About', 'Contact'].map((label) => (
              <a
                key={label}
                href="#"
                className="font-medium text-[#003459] hover:text-[#003459]/80"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <FacebookIcon />
            <TwitterIcon />
            <InstagramIcon />
            <YoutubeIcon />
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-gray-300 pt-8 text-sm text-gray-600 sm:flex-row">
          <div>© 2022 Monito. All rights reserved.</div>
          <Logo className="mt-1 sm:mt-0" />
          <div className="flex flex-wrap justify-center gap-4 sm:space-x-8">
            <a href="#" className="hover:text-[#003459]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#003459]">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
