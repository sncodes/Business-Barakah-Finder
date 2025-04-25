import { Link } from "wouter";
import { ReactNode } from "react";
import { useLocation } from "wouter";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();

  // Calculate progress based on current route
  const getProgress = () => {
    switch (location) {
      case "/": return 0;
      case "/profile": return 33;
      case "/processing": return 66;
      case "/results": return 100;
      default: return 0;
    }
  };

  return (
    <>
      <div className="min-h-screen geometric-pattern">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <Link href="/" className="text-3xl md:text-4xl font-raleway font-bold text-primary inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Business Baraka Finder
              </Link>
              <p className="text-neutral-600 mt-2">Ethically-guided business support matching for your journey</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/" className="text-primary hover:text-primary-dark transition">Help</Link>
              <span className="mx-2 text-neutral-300">|</span>
              <Link href="/" className="text-primary hover:text-primary-dark transition">About</Link>
            </div>
          </header>

          {/* Progress Bar */}
          {location !== "/" && (
            <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-8 overflow-hidden">
              <div 
                className="bg-secondary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          )}

          {/* Main Content */}
          <main>
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-neutral-200 text-neutral-500 text-sm flex flex-col md:flex-row justify-between items-center">
            <div>
              <p>© {new Date().getFullYear()} Business Baraka Finder. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/" className="hover:text-primary">Terms of Service</Link>
              <Link href="/" className="hover:text-primary">Contact</Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Layout;
