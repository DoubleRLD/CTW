import { useEffect, useState } from "react";
import { roommateProfilesApi } from "../api/roommateProfiles";
import { useAuth } from "../context/AuthContext";

const DEFAULT_FORM = {
  semester: "Fall",
  semesterYear: new Date().getFullYear(),
  bio: "",
  roommatePetPeeve: " ",
  conflictStyle: " ",
  visitorStyle: " ",
  boundaries: " ",
  sleepSchedule: "flexible",
  cleanlinessLevel: 3,
  noiseTolerance: 3,
  studyHabits: "flexible",
  socialLevel: 3,
  smoking: false,
  pets: false,
  budgetMin: "",
  budgetMax: "",
  moveInDate: "",
};

function RoommateProfile() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Load an existing profile for the selected semester so editing
  // doesn't start from a blank form — this also means the upsert
  // (see roommateProfiles.model.js) sends the full object back,
  // not just whatever the user touched this time.
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        setLoading(true);
        const profile = await roommateProfilesApi.getMine(form.semester, form.semesterYear);
        setForm({
          semester: profile.semester,
          semesterYear: profile.semester_year,
          bio: profile.bio || "",
          roommatePetPeeve: profile.roommate_pet_peeve || "",
          conflictStyle: profile.conflict_style || "",
          visitorStyle: profile.visitor_style || "",
          boundaries: profile.boundaries || "",
          sleepSchedule: profile.sleep_schedule,
          cleanlinessLevel: profile.cleanliness_level,
          noiseTolerance: profile.noise_tolerance,
          studyHabits: profile.study_habits,
          socialLevel: profile.social_level,
          smoking: !!profile.smoking,
          pets: !!profile.pets,
          budgetMin: profile.budget_min ?? "",
          budgetMax: profile.budget_max ?? "",
          moveInDate: profile.move_in_date ? profile.move_in_date.slice(0, 10) : "",
        });
      } catch {
        // 404 just means no profile yet for this semester — that's fine,
        // keep the blank defaults.
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await roommateProfilesApi.upsert({
        ...form,
        semesterYear: Number(form.semesterYear),
        cleanlinessLevel: Number(form.cleanlinessLevel),
        noiseTolerance: Number(form.noiseTolerance),
        socialLevel: Number(form.socialLevel),
        budgetMin: form.budgetMin === "" ? undefined : Number(form.budgetMin),
        budgetMax: form.budgetMax === "" ? undefined : Number(form.budgetMax),
        moveInDate: form.moveInDate || undefined,
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="page">
        <div className="card logged-out-card">
          <h1>Login Required</h1>
          <p>You need to be logged in to create or update your roommate profile.</p>

          <div className="button-group left-buttons">
            <a href="/login" className="primary-btn">Log In</a>
            <a href="/register" className="secondary-btn">Sign Up</a>
          </div>
        </div>
      </main>
    );
  }

  if (loading) return <main className="page"><p>Loading...</p></main>;

  return (
    <main className="page">
      <div className="card">
        <h1>Roommate Profile</h1>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {saved && <p style={{ color: "green" }}>Profile saved.</p>}

        <form className="form" onSubmit={handleSubmit}>
          <label>Semester</label>
          <select value={form.semester} onChange={(e) => update("semester", e.target.value)}>
            <option>Fall</option>
            <option>Spring</option>
            <option>Summer</option>
          </select>

          <label>Year</label>
          <input
            type="number"
            value={form.semesterYear}
            onChange={(e) => update("semesterYear", e.target.value)}
          />

          <label>Budget (min - max)</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              placeholder="Min"
              value={form.budgetMin}
              onChange={(e) => update("budgetMin", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={form.budgetMax}
              onChange={(e) => update("budgetMax", e.target.value)}
            />
          </div>

          <label>Move-in Date</label>
          <input
            type="date"
            value={form.moveInDate}
            onChange={(e) => update("moveInDate", e.target.value)}
          />

          <label>Sleep Schedule</label>
          <select value={form.sleepSchedule} onChange={(e) => update("sleepSchedule", e.target.value)}>
            <option value="early_bird">Early bird</option>
            <option value="night_owl">Night owl</option>
            <option value="flexible">Flexible</option>
          </select>

          <label>Cleanliness Level (1 = relaxed, 5 = very clean)</label>
          <select value={form.cleanlinessLevel} onChange={(e) => update("cleanlinessLevel", e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <label>Noise Tolerance (1 = need quiet, 5 = doesn't bother me)</label>
          <select value={form.noiseTolerance} onChange={(e) => update("noiseTolerance", e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <label>Study Habits</label>
          <select value={form.studyHabits} onChange={(e) => update("studyHabits", e.target.value)}>
            <option value="in_room">Study in room</option>
            <option value="library">Study at library</option>
            <option value="flexible">Flexible</option>
          </select>

          <label>Social Level (1 = introvert, 5 = extrovert)</label>
          <select value={form.socialLevel} onChange={(e) => update("socialLevel", e.target.value)}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          <label>
            <input
              type="checkbox"
              checked={form.smoking}
              onChange={(e) => update("smoking", e.target.checked)}
            />{" "}
            I smoke
          </label>

          <label> What is your biggest roommate pet peeve?</label>
          <textarea
            placeholder="Example: Leaving dishes in the sink, being loud at night, not communicating about guests. "
            value={form.roommatePetPeeve}
            onChange={(e) => update("roommatePetPeeve", e.target.value)}
          />
          <label>What is your conflict resolution style? Are you more confrontational or avoidant?</label>
          <textarea
            placeholder="Example: I tend to keep things to myself until I boil over."
            value={form.conflictStyle}
            onChange={(e) => update("conflictStyle", e.target.value)}
          />
          <label>Do you like to have visitors? How often?</label>
          <textarea
            placeholder="Example: I have friends over often. Not a fan of overnight guest. "
            value={form.visitorStyle}
            onChange={(e) => update("visitorStyle", e.target.value)}
          />
           <label>What are your strict boundaries when sharing a space?</label>
          <textarea
            placeholder="Example: I do not share groceries."
            value={form.boundaries}
            onChange={(e) => update("boundaries", e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={form.pets}
              onChange={(e) => update("pets", e.target.checked)}
            />{" "}
            I have pets
          </label>

          <label>About Me</label>
          <textarea
            placeholder="Tell potential roommates about yourself"
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default RoommateProfile;
