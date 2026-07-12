function StarRating({ rating, showNumber = true }) {
  if (rating == null || rating === "No ratings yet" || isNaN(Number(rating))) {
    return <span className="star-rating star-rating-empty">No ratings yet</span>;
  }

  const numeric = Number(rating);
  const fullStars = Math.round(numeric);

  return (
    <span className="star-rating" title={`${numeric.toFixed(1)} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < fullStars ? "star star-filled" : "star star-empty"}>
          ★
        </span>
      ))}
      {showNumber && <span className="star-rating-number">{numeric.toFixed(1)}</span>}
    </span>
  );
}

export default StarRating;
