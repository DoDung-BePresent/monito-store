import { Link, useLocation } from 'react-router-dom';
import { Menu, SearchIcon } from 'lucide-react';

/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/pets', label: 'Pets' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#FCEED5] to-[#FFE7BA] shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'font-semibold text-[#003459] transition-colors hover:text-[#003459]/80',
                location.pathname === link.href ? 'underline underline-offset-4' : ''
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Search + Button */}
        <div className="hidden items-center space-x-4 sm:flex">
          <div className="flex items-center rounded-md bg-white px-3">
            <SearchIcon className="text-muted-foreground size-5" />
            <Input
              className="placeholder:text-muted-foreground/50 border-none bg-transparent shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
              placeholder="Search something here!"
            />
          </div>
          <Button className="bg-[#003459] hover:bg-[#003459]/90" asChild>
            <Link to="/login">Join the community</Link>
          </Button>
        </div>

        {/* Mobile Sheet Trigger */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="text-[#003459]" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[80%] max-w-sm bg-[#FCEED5]">
              <div className="mb-6 mt-4">
                <Logo />
              </div>

              <nav className="flex flex-col space-y-4 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'text-lg font-semibold text-[#003459]',
                      location.pathname === link.href ? 'underline underline-offset-4' : ''
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center rounded-md bg-white px-3 mb-4">
                <SearchIcon className="text-muted-foreground size-5" />
                <Input
                  className="w-full placeholder:text-muted-foreground/50 border-none bg-transparent shadow-none ring-0 focus-visible:border-0 focus-visible:ring-0"
                  placeholder="Search something here!"
                />
              </div>

              <Button className="w-full bg-[#003459] hover:bg-[#003459]/90" asChild>
                <Link to="/login">Join the community</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
