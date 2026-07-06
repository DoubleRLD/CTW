import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dormsApi } from "../api/dorms";
import { listingsApi } from "../api/listings";
import { dormReviewsApi } from "../api/dormReviews";
import { listingReviewsApi } from "../api/listingReviews";
import { useAuth } from "../context/AuthContext";

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

function HousingDetails() {
  const { type, id } = useParams(); // "dorm" | "listing"
  const { isAuthenticated } = useAuth();

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id]);

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
      setForm((f) => ({ ...f, roomId: String(room.room_id) })); // auto-select the room just added
      setShowAddRoom(false);
      setNewRoom({ floor: "", roomNumber: "" });
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
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="page"><p>Loading...</p></main>;
  if (error) return <main className="page"><p style={{ color: "crimson" }}>Error: {error}</p></main>;
  if (!place) return null;

  const title = type === "dorm" ? place.name : place.address;
  const subtitle =
    type === "dorm"
      ? `${place.school_name} · On-Campus Dorm · Rating: ${place.avg_rating ?? "No ratings yet"}`
      : `${place.school_names || "No linked school yet"} · Off-Campus · ${place.bedrooms} bed · $${place.monthly_rent}/mo · Rating: ${place.avg_rating ?? "No ratings yet"}`;

  return (
    <main className="page">
      <section className="details-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>

      <section>
        <h2>Student Reviews</h2>

        {reviews.length === 0 && <p>No reviews yet — be the first to leave one.</p>}

        <div className="card-grid">
          {reviews.map((review) => (
            <div className="card" key={review.dorm_review_id ?? review.listing_review_id}>
              <h3>{review.reviewer_name}</h3>
              {/* room_number comes back from the backend join — "General" means
                  the reviewer didn't specify a room when submitting. */}
              {type === "dorm" && review.room_number && (
                <p className="small-text">Room {review.room_number}</p>
              )}
              <p><strong>Overall:</strong> {review.overall_rating}/5</p>
              <p><strong>{review.semester} {review.semester_year}</strong></p>
              <p>{review.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Write a Review</h2>

        {!isAuthenticated && <p>You need to be logged in to leave a review.</p>}
        {submitError && <p style={{ color: "crimson" }}>{submitError}</p>}

        <form className="form" onSubmit={handleSubmit}>
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
