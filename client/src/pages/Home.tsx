import { Link, useLocation } from "wouter";

const Home = () => {
  const [, navigate] = useLocation();

  const handleStart = () => {
    navigate("/profile");
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-raleway font-semibold text-primary mb-4">Welcome to Business Baraka Finder</h2>
          <p className="mb-4 text-neutral-700">Our tool helps small businesses like yours find the right support based on your unique profile and needs, all while respecting ethical principles.</p>
          
          <div className="bg-neutral-50 border-l-4 border-primary p-4 mb-6">
            <h3 className="font-raleway font-medium text-primary mb-2">What is "Baraka"?</h3>
            <p className="text-sm text-neutral-600">Baraka (بركة) refers to the blessing that brings divine favor and prosperity. Our tool aims to provide you with business support options that align with ethical principles and bring sustainable growth.</p>
          </div>
          
          <h3 className="font-raleway font-medium text-primary mb-2">How it works:</h3>
          <ol className="list-decimal pl-5 mb-6 text-neutral-700 space-y-2">
            <li>Complete a short profile about your business</li>
            <li>Our system matches your needs with available support</li>
            <li>Review your personalized recommendations</li>
            <li>Take action on the opportunities that suit you best</li>
          </ol>
          
          <button 
            onClick={handleStart}
            className="bg-primary hover:bg-primary-light text-white font-medium py-3 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Start Your Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="hidden md:block arabian-pattern">
          <div className="bg-white/90 p-6 rounded-lg border border-neutral-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.462 5.204a.75.75 0 0 0 1.076 0l3-3a.75.75 0 0 0-1.06-1.06l-2.47 2.47-2.471-2.47a.75.75 0 0 0-1.06 1.06l3 3zM9.462 14.796a.75.75 0 0 1 1.076 0l3 3a.75.75 0 1 1-1.06 1.06l-2.47-2.47-2.471 2.47a.75.75 0 0 1-1.06-1.06l3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-3 font-raleway font-medium text-primary">Ethical Business Support</h3>
            </div>
            <p className="text-neutral-600 mb-6">Our recommendations focus on responsible financing, sustainable growth, and community benefit.</p>
            
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-3 font-raleway font-medium text-primary">Balanced Approach</h3>
            </div>
            <p className="text-neutral-600 mb-6">We consider your business goals while promoting fair, transparent, and ethical business practices.</p>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5c0 .526-.27.988-.659 1.256a6.012 6.012 0 01-2.706 1.912 6.042 6.042 0 010-2.641zM11.998 14h.002a6.061 6.061 0 00-2.652-.425c-.387-.307-.857-.5-1.348-.5-.5 0-.961.193-1.348.5a5.972 5.972 0 00-2.652.425 6.01 6.01 0 018-.001zM13.4 10.507c1.022.272 2.006.76 2.968 1.465-.24.226-.495.434-.763.627-.772.558-1.67.863-2.605.874-.934.011-1.839-.285-2.617-.835a7.19 7.19 0 01-.762-.626c.962-.705 1.946-1.193 2.968-1.465a4.428 4.428 0 00.811-.17z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-3 font-raleway font-medium text-primary">Community Impact</h3>
            </div>
            <p className="text-neutral-600">Find support that helps your business thrive while making a positive impact on society.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
