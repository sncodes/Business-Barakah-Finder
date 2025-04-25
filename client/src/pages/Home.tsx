import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const [, navigate] = useLocation();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [scrolling, setScrolling] = useState(false);

  const handleStart = () => {
    navigate("/profile");
  };

  const scrollToSection = (index: number) => {
    if (scrolling) return;
    
    setScrolling(true);
    setActiveSection(index);
    
    sectionsRef.current[index]?.scrollIntoView({
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setScrolling(false);
    }, 1000);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    if (scrolling) return;
    
    if (e.deltaY > 0 && activeSection < sectionsRef.current.length - 1) {
      // Scroll down
      scrollToSection(activeSection + 1);
    } else if (e.deltaY < 0 && activeSection > 0) {
      // Scroll up
      scrollToSection(activeSection - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrolling) return;
      
      if (e.key === 'ArrowDown' && activeSection < sectionsRef.current.length - 1) {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' && activeSection > 0) {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, scrolling]);

  return (
    <div className="h-screen overflow-hidden">
      {/* Navigation Dots */}
      <div className="fixed right-10 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === i 
                  ? "bg-primary w-4 h-4" 
                  : "bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Scroll to section ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Section 1: Hero */}
      <section 
        ref={(el) => (sectionsRef.current[0] = el)}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-white to-neutral-50 snap-start"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-secondary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-raleway font-bold text-primary mb-6">Business Barakah Finder</h1>
          <p className="text-xl md:text-2xl text-neutral-600 mb-8">Find ethical support resources for your business journey</p>
          <button 
            onClick={handleStart}
            className="bg-primary hover:bg-primary-light text-white font-medium py-4 px-8 rounded-full transition duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="mt-12 animate-bounce">
            <button onClick={() => scrollToSection(1)} aria-label="Scroll down" className="text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: What is Barakah */}
      <section 
        ref={(el) => (sectionsRef.current[1] = el)}
        className="h-screen w-full flex items-center justify-center arabian-pattern snap-start"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/95 p-8 md:p-12 rounded-xl shadow-xl">
            <h2 className="text-3xl md:text-4xl font-raleway font-bold text-primary mb-6">What is "Barakah"?</h2>
            <div className="text-lg space-y-4 text-neutral-700">
              <p>
                <span className="text-xl font-medium text-primary">Barakah (بركة)</span> refers to the blessing that brings divine favor and prosperity. 
              </p>
              <p>
                In Islamic tradition, Barakah represents the beneficent force from Allah that flows through the physical and spiritual spheres as prosperity, protection, and happiness.
              </p>
              <p>
                Our tool aims to provide your business with support options that align with ethical principles and bring sustainable growth with Barakah in every step of your journey.
              </p>
            </div>
            <div className="flex justify-center mt-10">
              <button onClick={() => scrollToSection(2)} aria-label="Next section" className="text-primary hover:text-primary-dark transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How it works */}
      <section 
        ref={(el) => (sectionsRef.current[2] = el)}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white snap-start"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-raleway font-bold text-primary mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h3 className="ml-3 font-raleway font-medium text-xl text-primary">Create Your Profile</h3>
              </div>
              <p className="text-neutral-600">Share some basic information about your business type, industry, team size, and growth goals.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">2</div>
                <h3 className="ml-3 font-raleway font-medium text-xl text-primary">Matching Process</h3>
              </div>
              <p className="text-neutral-600">Our system analyzes your profile and matches you with the most relevant ethical business support resources.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">3</div>
                <h3 className="ml-3 font-raleway font-medium text-xl text-primary">Review Results</h3>
              </div>
              <p className="text-neutral-600">Get personalized recommendations and strategic insights tailored to your business situation.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary transition-transform hover:scale-105">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">4</div>
                <h3 className="ml-3 font-raleway font-medium text-xl text-primary">Take Action</h3>
              </div>
              <p className="text-neutral-600">Apply for resources, download your results, or have them emailed to you for future reference.</p>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button onClick={() => scrollToSection(3)} aria-label="Next section" className="text-primary hover:text-primary-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Call to action */}
      <section 
        ref={(el) => (sectionsRef.current[3] = el)}
        className="h-screen w-full flex items-center justify-center bg-gradient-to-t from-primary/10 to-white snap-start"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-raleway font-bold text-primary mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
            Start your journey today to discover ethical business support resources that align with your values and help your business grow with Barakah.
          </p>
          <button 
            onClick={handleStart}
            className="bg-primary hover:bg-primary-light text-white font-medium py-4 px-10 rounded-full transition duration-300 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Begin Now
          </button>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="p-4">
              <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">Ethical</h3>
              <p className="text-neutral-600">Resources that align with ethical financing principles</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">Personalized</h3>
              <p className="text-neutral-600">Tailored to your unique business profile and needs</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">Growth-focused</h3>
              <p className="text-neutral-600">Resources designed to help your business thrive</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
