import { useLocation } from "wouter";

const MatchesPage = () => {
  const { state } = useLocation();
  const matchesData = state;

  return (
    <section className="bg-slate-700 rounded-lg shadow-md p-6 md:p-8 text-white">
      <h2 className="text-2xl font-raleway font-semibold mb-6">Your Matching Support Options</h2>
      {matchesData?.matches ? (
        <ul>
          {matchesData.matches.map((match, index) => (
            <li key={index} className="mb-4 p-4 rounded-md bg-slate-800">
              <h3 className="font-semibold">{match.name}</h3>
              <p className="text-gray-300">{match.description}</p>
              {match.applyUrl && (
                <a
                  href={match.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-2"
                >
                  Apply Here
                </a>
              )}
              {match.amount && <p className="text-gray-300 mt-1">Amount: {match.amount}</p>}
              {match.deadline && <p className="text-gray-300 mt-1">Deadline: {match.deadline}</p>}
              {match.type && <p className="text-gray-300 mt-1">Type: {match.type}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
      {matchesData?.insights && matchesData.insights.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Personalized Insights:</h3>
          <ul className="list-disc pl-5">
            {matchesData.insights.map((insight, index) => (
              <li key={index} className="mb-1">{insight}</li>
            ))}
          </ul>
        </div>
      )}
      {matchesData?.businessProfile && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Your Business Profile:</h3>
          <p className="text-gray-300">Business Type: {matchesData.businessProfile.businessType}</p>
          <p className="text-gray-300">Industry Sector: {matchesData.businessProfile.industrySector}</p>
          <p className="text-gray-300">Team Size: {matchesData.businessProfile.teamSize}</p>
          <p className="text-gray-300">Funding Stage: {matchesData.businessProfile.fundingStage}</p>
          {matchesData.businessProfile.growthGoals && matchesData.businessProfile.growthGoals.length > 0 && (
            <p className="text-gray-300">Growth Goals: {matchesData.businessProfile.growthGoals.join(", ")}</p>
          )}
          {matchesData.businessProfile.notes && <p className="text-gray-300">Notes: {matchesData.businessProfile.notes}</p>}
        </div>
      )}
    </section>
  );
};

export default MatchesPage;
