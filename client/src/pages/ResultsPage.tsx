import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EmailModal from "@/components/EmailModal";
import AdvisorContactModal from "@/components/AdvisorContactModal";
import { Support } from "@shared/schema";

const ResultsPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);

  // Fetch match results
  const { data, isLoading, isError } = useQuery<{
    matches: Support[];
    businessProfile: any;
    insights: string[];
  }>({
    queryKey: ['/api/match-results'],
  });

  const handleStartOver = () => {
    navigate("/");
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await apiRequest("GET", "/api/download-results", undefined);
      
      if (response.ok) {
        // Create a blob from the PDF stream
        const blob = await response.blob();
        // Create a link element
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "business-support-matches.pdf";
        
        // Append to the document body, click, and then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Success",
          description: "Your results have been downloaded successfully.",
        });
      } else {
        throw new Error("Failed to download PDF");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download your results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactAdvisor = () => {
    setAdvisorModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 text-center">
        <div className="py-10">
          <div className="inline-block p-4 rounded-full bg-neutral-100 mb-6">
            <div className="w-16 h-16 border-4 border-t-primary border-neutral-200 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-raleway font-semibold text-primary mb-4">Loading Your Results</h2>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 text-center">
        <div className="py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-raleway font-semibold text-primary mb-4">Error Loading Results</h2>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            We encountered an issue retrieving your results. Please try again.
          </p>
          <Button onClick={handleStartOver}>Start Over</Button>
        </div>
      </section>
    );
  }

  const { matches, businessProfile, insights } = data;

  return (
    <>
      <section>
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-raleway font-semibold text-primary">Your Recommended Support Options</h2>
              <p className="text-neutral-600 mt-1">Based on your business profile, we've found these opportunities</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEmailModalOpen(true)}
                className="flex items-center text-sm border-primary text-primary hover:bg-neutral-50 px-3 py-1.5 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Results
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="flex items-center text-sm border-primary text-primary hover:bg-neutral-50 px-3 py-1.5 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="flex items-center text-sm border-primary text-primary hover:bg-neutral-50 px-3 py-1.5 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Print
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {matches.map((support, index) => (
              <div 
                key={support.id} 
                className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-primary text-white p-4">
                  <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded mb-2">{support.type.toUpperCase()}</span>
                  <h3 className="font-raleway font-semibold text-lg">{support.name}</h3>
                </div>
                <div className="p-4">
                  <p className="text-neutral-700 text-sm mb-4">{support.description}</p>
                  {support.amount && (
                    <div className="flex items-center text-sm text-neutral-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                      <span>{support.amount}</span>
                    </div>
                  )}
                  {support.deadline && (
                    <div className="flex items-center text-sm text-neutral-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Next deadline: {support.deadline}</span>
                    </div>
                  )}
                  {support.location && (
                    <div className="flex items-center text-sm text-neutral-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{support.location}</span>
                    </div>
                  )}
                  {support.duration && (
                    <div className="flex items-center text-sm text-neutral-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{support.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-neutral-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{support.shariaCompliant ? "Ethical finance compatible" : "Standard finance option"}</span>
                  </div>
                  <a 
                    href={support.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center bg-primary hover:bg-primary-light text-white font-medium py-2 rounded transition duration-300"
                  >
                    {support.applyText || "Apply Now"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Insights Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 border-t-4 border-secondary">
          <div className="flex items-start">
            <div className="bg-secondary/10 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-raleway font-semibold text-xl text-primary mb-2">Personalised Insights</h3>
              <p className="text-neutral-700 mb-4">
                Based on your profile as a {businessProfile && businessProfile.businessType} in the {businessProfile && businessProfile.industrySector} sector with {businessProfile && businessProfile.teamSize} employees seeking {businessProfile && businessProfile.growthGoals && businessProfile.growthGoals.join(' and ')}, here are some key insights:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-raleway font-semibold text-lg text-primary mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    Business Growth
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                    {insights && insights.slice(0, Math.ceil(insights.length / 2)).map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-raleway font-semibold text-lg text-primary mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Ethical Considerations
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-600">
                    {insights && insights.slice(Math.ceil(insights.length / 2)).map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="link"
            onClick={handleStartOver}
            className="text-primary hover:text-primary-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Start Over
          </Button>
          <Button 
            onClick={handleContactAdvisor}
            className="bg-secondary hover:bg-secondary-light text-white"
          >
            Speak to an Advisor
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </section>

      <EmailModal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} />
      <AdvisorContactModal isOpen={advisorModalOpen} onClose={() => setAdvisorModalOpen(false)} />
    </>
  );
};

export default ResultsPage;
