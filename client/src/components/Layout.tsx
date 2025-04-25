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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Business Barakah Finder
              </Link>
              <p className="text-neutral-600 mt-2">Ethically-guided business support matching for your journey</p>
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
              <p>© {new Date().getFullYear()} Business Barakah Finder. All rights reserved.</p>
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
