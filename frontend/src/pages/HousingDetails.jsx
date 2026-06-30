const reviews = [
    {
      student: "Verified Student",
      rating: "4.5",
      text: "The location is convenient and close to classes. The rooms are decent, but it can get noisy sometimes.",
    },
    {
      student: "Verified Student",
      rating: "4.0",
      text: "Good option for first-year students. I liked the community, but the laundry area gets crowded.",
    },
];

function HousingDetails() {
    return (
        <main className="page">
            <section className="details-header">
                <h1>Piedmont Central</h1>
                <p>Georgia State University · On-Campus Dorm · Rating: 4.2/5</p>
            </section>

            <section className="card">
                <h2>Housing Information</h2>
                <p><strong>Housing Type:</strong> On-Campus Dorm</p>
                <p><strong>Location:</strong> Atlanta, Georgia</p>
                <p><strong>Amenities:</strong> Study rooms, dining access, laundry, Wi-Fi</p>
                <p><strong>Best For:</strong> Students who want to live close to campus.</p>
            </section>

            <section>
                <h2>Student Reviews</h2>

                <div className="card-grid">
                    {reviews.map((review, index) => (
                        <div className="card" key={index}>
                            <h3>{review.student}</h3>
                            <p><strong>Rating:</strong> {review.rating}/5</p>
                            <p>{review.text}</p>
                            <button>Report Review</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="card">
                <h2>Write a Review</h2>

                <form className="form">
                    <label>Rating</label>
                    <select>
                        <option>5 stars</option>
                        <option>4 stars</option>
                        <option>3 stars</option>
                        <option>2 stars</option>
                        <option>1 star</option>
                    </select>

                    <label>Review</label>
                    <textarea placeholder="Write your housing review"></textarea>
                    <button type="submit">Submit Review</button>
                </form>
            </section>
        </main>
    );
}
  
export default HousingDetails;