const housingOptions = [
    {
      name: "Piedmont Central",
      type: "On-Campus Dorm",
      school: "Georgia State University",
      price: "$$$",
      rating: "4.2",
      distance: "On campus",
    },
    {
      name: "University Commons",
      type: "On-Campus Apartment",
      school: "Georgia State University",
      price: "$$$",
      rating: "4.0",
      distance: "On campus",
    },
    {
      name: "Aspen Heights Atlanta",
      type: "Off-Campus Apartment",
      school: "Georgia State University",
      price: "$$$$",
      rating: "3.8",
      distance: "Near campus",
    },
  ];

function HousingSearch() {
    return (
        <main className="page">
        <h1>Search Student Housing</h1>
  
        <p>
          Browse sample dorms and apartments. Later, users will be able to filter
          by school, distance, price range, rating, housing type, and amenities.
        </p>
  
        <div className="filter-bar">
          <input type="text" placeholder="Search by school or housing name" />
  
          <select>
            <option>All Housing Types</option>
            <option>On-Campus Dorm</option>
            <option>Off-Campus Apartment</option>
          </select>
  
          <select>
            <option>Any Rating</option>
            <option>4 stars and up</option>
            <option>3 stars and up</option>
          </select>
        </div>
  
        <div className="card-grid">
          {housingOptions.map((housing, index) => (
            <div className="card" key={index}>
              <h2>{housing.name}</h2>
              <p><strong>Type:</strong> {housing.type}</p>
              <p><strong>School:</strong> {housing.school}</p>
              <p><strong>Price:</strong> {housing.price}</p>
              <p><strong>Rating:</strong> {housing.rating}/5</p>
              <p><strong>Distance:</strong> {housing.distance}</p>
              <a href="/housing-details" className="primary-btn">View Reviews</a>
            </div>
          ))}
        </div>
      </main>
    );
  }
  
  export default HousingSearch;