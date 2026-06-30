const matches = [
    {
        name: "Reagan Marscel",
        school: "Georgia State University",
        housing: "On-Campus Dorm",
        budget: "$800",
        tags: "quiet, clean, study focused",
        score: "92%",
    },
    {
        name: "Lincoln Thomas",
        school: "Georgia State University",
        housing: "Off-Campus Apartment",
        budget: "$850",
        tags: "social, flexible, clean",
        score: "86%",
    },
    {
        name: "Jessica Tran",
        school: "Georgia Tech",
        housing: "Off-Campus Apartment",
        budget: "$900",
        tags: "night owl, gamer, clean",
        score: "78%",
    },
];
function RoommateMatches() {
    return (
        <main className="page">
            <h1>Roommate Matches</h1>
  
            <p>
                These are sample roommate matches. Later, matches will be generated from
                profile answers, tags, budget, school, and housing interests.
            </p>
  
            <div className="card-grid">
                {matches.map((match, index) => (
                    <div className="card" key={index}>
                        <h2>{match.name}</h2>
                        <p><strong>School:</strong> {match.school}</p>
                        <p><strong>Housing Interest:</strong> {match.housing}</p>
                        <p><strong>Budget:</strong> {match.budget}</p>
                        <p><strong>Tags:</strong> {match.tags}</p>
                        <p><strong>Compatibility:</strong> {match.score}</p>
                        <button>Send Roommate Request</button>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default RoommateMatches;