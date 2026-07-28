import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dormsApi } from "../api/dorms";
import { listingsApi } from "../api/listings";
import { dormReviewsApi } from "../api/dormReviews";
import { listingReviewsApi } from "../api/listingReviews";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { favoritesApi } from "../api/favorites";
import StarRating from "../components/StarRating";
import SkeletonCards from "../components/SkeletonCards";
import PhotoPlaceholder from "../components/PhotoPlaceholder";

const RATING_FIELDS = {
  dorm: [
    { key: "cleanlinessRating", label: "Cleanliness" },
    { key: "noiseRating", label: "Noise" },
    { key: "locationRating", label: "Location" },
    { key: "overallRating", label: "Overall" },
  ],
  listing: [
    { key: "landlordRating", label: "Landlord" },
    { key: "maintenanceRating", label: "Maintenance" },
    { key: "valueRating", label: "Value for money" },
    { key: "overallRating", label: "Overall" },
  ],
};

function emptyRatings(type) {
  return Object.fromEntries(RATING_FIELDS[type].map((f) => [f.key, 5]));
}

function formatPrice(price) {
  if (!price) return "Price unavailable";
  return `$${Number(price).toLocaleString()}`;
}

function normalizeAmenities(value) {
  if (Array.isArray(value) && value.length > 0) return value;

  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim());
  }

  return [
    "Wifi",
    "Laundry",
    "Study Lounge",
    "Gym",
    "Parking",
    "Pool",
    "Security",
    "Package Lockers",
    "Pet Friendly",
  ];
}

function HousingDetails() {
  const { type, id } = useParams(); // "dorm" | "listing"
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]); // only relevant for type === "dorm"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    roomId: "", // "" = "I don't know my room" -> backend falls back to a shared General room
    semester: "Fall",
    semesterYear: new Date().getFullYear(),
    body: "",
    ratings: emptyRatings(type),
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Inline "add a room" mini-form, shown when the reviewer's room
  // isn't in the list yet.
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ floor: "", roomNumber: "" });
  const [addingRoom, setAddingRoom] = useState(false);
  const [addRoomError, setAddRoomError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const placeApi = type === "dorm" ? dormsApi : listingsApi;
  const reviewApi = type === "dorm" ? dormReviewsApi : listingReviewsApi;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [placeData, reviewsData, roomsData] = await Promise.all([
          placeApi.get(id),
          reviewApi.list(id),
          type === "dorm" ? dormsApi.listRooms(id) : Promise.resolve([]),
        ]);
        setPlace(placeData);
        setReviews(reviewsData);
        setRooms(roomsData);
        if (type === 'listing' && isAuthenticated) {
          try {
            const favs = await favoritesApi.list();
            setIsFavorited(favs.includes(Number(id)));
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id, isAuthenticated]);

  function updateRating(key, value) {
    setForm((f) => ({ ...f, ratings: { ...f.ratings, [key]: Number(value) } }));
  }

  async function handleAddRoom(e) {
    e.preventDefault();
    setAddRoomError(null);
    setAddingRoom(true);
    try {
      const room = await dormsApi.createRoom(id, {
        floor: newRoom.floor ? Number(newRoom.floor) : undefined,
        roomNumber: newRoom.roomNumber,
      });
      setRooms((prev) => [...prev, room]);
      setForm((f) => ({ ...f, roomId: String(room.room_id) }));
      setShowAddRoom(false);
      setNewRoom({ floor: "", roomNumber: "" });
      showToast("Room added.", "success");
    } catch (err) {
      setAddRoomError(err.message);
    } finally {
      setAddingRoom(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const payload = {
        semester: form.semester,
        semesterYear: Number(form.semesterYear),
        body: form.body,
        ...form.ratings,
        ...(type === "dorm" && form.roomId ? { roomId: Number(form.roomId) } : {}),
      };
      const newReview = await reviewApi.create(id, payload);
      setReviews((prev) => [newReview, ...prev]);
      setForm((f) => ({ ...f, body: "", ratings: emptyRatings(type) }));
      showToast("Review submitted. Thanks for helping other students!", "success");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleFavorite() {
    try {
      if (isFavorited) {
        await favoritesApi.remove(Number(id));
        setIsFavorited(false);
        showToast("Removed from saved listings.", "info");
      } else {
        await favoritesApi.add(Number(id));
        setIsFavorited(true);
        showToast("Saved to your favorites.", "success");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="skeleton-line skeleton-title" style={{ height: "36px", width: "40%" }} />
        <div className="skeleton-line skeleton-text" style={{ width: "25%" }} />
        <SkeletonCards count={3} />
      </main>
    );
  }
  if (error) return <main className="page"><p style={{ color: "crimson" }}>Error: {error}</p></main>;
  if (!place) return null;

  const title = type === "dorm" ? place.name : place.name || place.address;

  const subtitle =
    type === "dorm"
      ? `On-Campus - ${place.school_name || "School unavailable"}`
      : `Off-Campus - ${place.school_names || "No linked school yet"}`;
  
  const price =
    type === "dorm"
      ? place.semester_cost || place.price
      : place.monthly_rent || place.price;
  
  const priceLabel = type === "dorm" ? "/Semester" : "/Month";
  
  const images = [
    place.image_url,
    place.photo_url,
    place.image,
    ...(place.gallery || []),
    ...(place.images || []),
  ].filter(Boolean);
  
  const amenities = normalizeAmenities(place.amenities);
  
  const rating = place.avg_rating != null ? Number(place.avg_rating) : null;

  return (
    <main className="page">
      <div className="housing-details-top">
        <div>
          <Link to="/housing" className="back-link">
            ← Back to Search Results
          </Link>

          <h1>{title}</h1>

          <p className="blue-text">{subtitle}</p>

          <div className="housing-rating-line">
            <StarRating rating={rating} />
            <span>({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="details-price-box">
          <h2>{formatPrice(price)}</h2>
          <p>{priceLabel}</p>

          <button className="primary-btn">Contact Housing</button>

          {type === "listing" && isAuthenticated && (
            <button className="secondary-btn" onClick={toggleFavorite}>
              {isFavorited ? "Saved" : "Save Listing"}
            </button>
          )}
        </div>
      </div>

      <section className="details-gallery">
        {images[0] ? (
          <img className="details-main-image" src={images[0]} alt={title} />
        ) : (
          <div className="details-main-image details-image-placeholder">
            <PhotoPlaceholder size="hero" />
          </div>
        )}

        <div className="details-side-gallery">
          {images.slice(1, 5).map((image) => (
            <img key={image} src={image} alt={`${title} gallery`} />
          ))}

          {images.length <= 1 &&
            [1, 2, 3, 4].map((item) => (
              <div className="details-side-placeholder" key={item}>
                <PhotoPlaceholder size="card" />
              </div>
            ))}
        </div>
      </section>

      <section className="details-info-grid">
        <div className="details-panel">
          <h2>About</h2>
          <p>
            {place.description ||
              place.about ||
              `${title} is a student housing option near campus.`}
          </p>
        </div>

        <div className="details-panel">
          <h2>Amenities</h2>

          <div className="amenities-grid">
            {amenities.map((amenity) => (
              <span key={amenity}>• {amenity}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews ({reviews.length})</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No reviews yet</h3>
            <p>Be the first to share your experience.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div
                className="review-card"
                key={review.dorm_review_id ?? review.listing_review_id}
              >
                <div className="review-card-header">
                  <div>
                    <h3>{review.reviewer_name || "Student"}</h3>

                    {type === "dorm" && review.room_number && (
                      <p className="small-text">Room {review.room_number}</p>
                    )}
                  </div>

                  <StarRating rating={review.overall_rating} />
                </div>

                <p>
                  <strong>
                    {review.semester} {review.semester_year}
                  </strong>
                </p>

                <p>{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="write-review-section">
        <h2>Write a Review</h2>

        {!isAuthenticated && <p>You need to be logged in to leave a review.</p>}
        {submitError && <p style={{ color: "crimson" }}>{submitError}</p>}

        <form className="review-form" onSubmit={handleSubmit}>
          {type === "dorm" && (
            <>
              <label>Room</label>
              <select
                value={form.roomId}
                onChange={(e) => setForm((f) => ({ ...f, roomId: e.target.value }))}
              >
                <option value="">I don't know my specific room</option>
                {rooms
                  .filter((r) => r.room_number !== "General")
                  .map((r) => (
                    <option key={r.room_id} value={r.room_id}>
                      {r.floor ? `Floor ${r.floor}, ` : ""}Room {r.room_number}
                    </option>
                  ))}
              </select>

              {!showAddRoom ? (
                <button type="button" className="secondary-btn" onClick={() => setShowAddRoom(true)}>
                  My room isn't listed
                </button>
              ) : (
                <div className="card">
                  {addRoomError && <p style={{ color: "crimson" }}>{addRoomError}</p>}
                  <label>Floor (optional)</label>
                  <input
                    type="number"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom((r) => ({ ...r, floor: e.target.value }))}
                  />
                  <label>Room number</label>
                  <input
                    type="text"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom((r) => ({ ...r, roomNumber: e.target.value }))}
                    placeholder="e.g. 304"
                  />
                  <div className="button-group">
                    <button type="button" onClick={handleAddRoom} disabled={addingRoom || !newRoom.roomNumber}>
                      {addingRoom ? "Adding..." : "Add room"}
                    </button>
                    <button type="button" className="secondary-btn" onClick={() => setShowAddRoom(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <label>Semester</label>
          <select
            value={form.semester}
            onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
          >
            <option>Fall</option>
            <option>Spring</option>
            <option>Summer</option>
          </select>

          <label>Year</label>
          <input
            type="number"
            value={form.semesterYear}
            onChange={(e) => setForm((f) => ({ ...f, semesterYear: e.target.value }))}
          />

          {RATING_FIELDS[type].map((field) => (
            <div key={field.key}>
              <label>{field.label}</label>
              <select
                value={form.ratings[field.key]}
                onChange={(e) => updateRating(field.key, e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
          ))}

          <label>Review</label>
          <textarea
            placeholder="Write your housing review"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          />

          <button type="submit" disabled={!isAuthenticated || submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default HousingDetails;
