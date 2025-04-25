import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const ProcessingScreen = () => {
  const [, navigate] = useLocation();

  // Query to check if matching process is complete
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/match-status'],
    retry: 3,
    refetchInterval: 1000, // Poll every second
  });

  useEffect(() => {
    // If the matching is complete, navigate to results
    if (data && data.isComplete) {
      navigate("/results");
    }
    
    // Fallback in case the API doesn't respond correctly - navigate after 3 seconds
    const timeout = setTimeout(() => {
      navigate("/results");
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [data, navigate]);

  if (isError) {
    navigate("/results");
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 text-center">
      <div className="py-10">
        <div className="inline-block p-4 rounded-full bg-neutral-100 mb-6">
          <div className="w-16 h-16 border-4 border-t-primary border-neutral-200 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-raleway font-semibold text-primary mb-4">Finding Your Perfect Matches</h2>
        <p className="text-neutral-600 max-w-md mx-auto">
          We're analyzing your business profile to find the most suitable support options that align with ethical principles...
        </p>
      </div>
    </section>
  );
};

export default ProcessingScreen;
