import { useEffect, useState } from "react";
import { roommateProfilesApi } from "../api/roommateProfiles";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import RangeSlider from "../components/RangeSlider";

const DEFAULT_FORM = {
  semester: "Fall",
  semesterYear: new Date().getFullYear(),
  bio: "",
  profilePicture: "",
  roommatePetPeeve: "",
  conflictStyle: "",
  visitorStyle: "",
  boundaries: "",
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
          profilePicture: profile.profile_picture || "",
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

  function handleProfilePictureChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      update("profilePicture", '');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      update("profilePicture", reader.result);
    };

    reader.readAsDataURL(file);
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
      <PageHeader
        title="Roommate Profile"
        subtitle="Tell future roommates about your lifestyle, habits, and preferences."
        icon="📝"
      />

      <div className="card">
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {saved && <p style={{ color: "green" }}>Profile saved.</p>}

        <form className="form" onSubmit={handleSubmit}>

          {/* ---------- The Basics ---------- */}
          <div className="form-section">
            <h3 className="form-section-title">The Basics</h3>
            <p className="form-section-desc">Which semester is this profile for, and your budget.</p>

            <div className="form-row">
              <div className="form-field">
                <label>Semester</label>
                <select value={form.semester} onChange={(e) => update("semester", e.target.value)}>
                  <option>Fall</option>
                  <option>Spring</option>
                  <option>Summer</option>
                </select>
              </div>
              <div className="form-field">
                <label>Year</label>
                <input
                  type="number"
                  value={form.semesterYear}
                  onChange={(e) => update("semesterYear", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Budget Min</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={form.budgetMin}
                  onChange={(e) => update("budgetMin", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Budget Max</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={form.budgetMax}
                  onChange={(e) => update("budgetMax", e.target.value)}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Move-in Date</label>
              <input
                type="date"
                value={form.moveInDate}
                onChange={(e) => update("moveInDate", e.target.value)}
              />
            </div>
          </div>

          {/* ---------- Lifestyle ---------- */}
          <div className="form-section">
            <h3 className="form-section-title">Lifestyle</h3>
            <p className="form-section-desc">How you actually live day-to-day — this drives your compatibility score.</p>

            <div className="form-row">
              <div className="form-field">
                <label>Sleep Schedule</label>
                <select value={form.sleepSchedule} onChange={(e) => update("sleepSchedule", e.target.value)}>
                  <option value="early_bird">Early bird</option>
                  <option value="night_owl">Night owl</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div className="form-field">
                <label>Study Habits</label>
                <select value={form.studyHabits} onChange={(e) => update("studyHabits", e.target.value)}>
                  <option value="in_room">Study in room</option>
                  <option value="library">Study at library</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <RangeSlider
              label="Cleanliness Level"
              value={form.cleanlinessLevel}
              onChange={(v) => update("cleanlinessLevel", v)}
              minLabel="Relaxed"
              maxLabel="Very clean"
            />

            <RangeSlider
              label="Noise Tolerance"
              value={form.noiseTolerance}
              onChange={(v) => update("noiseTolerance", v)}
              minLabel="Need quiet"
              maxLabel="Doesn't bother me"
            />

            <RangeSlider
              label="Social Level"
              value={form.socialLevel}
              onChange={(v) => update("socialLevel", v)}
              minLabel="Introvert"
              maxLabel="Extrovert"
            />

            <div className="form-row">
              <div className="toggle-row">
                <input
                  id="smoking-toggle"
                  type="checkbox"
                  checked={form.smoking}
                  onChange={(e) => update("smoking", e.target.checked)}
                />
                <label htmlFor="smoking-toggle">I smoke</label>
              </div>
              <div className="toggle-row">
                <input
                  id="pets-toggle"
                  type="checkbox"
                  checked={form.pets}
                  onChange={(e) => update("pets", e.target.checked)}
                />
                <label htmlFor="pets-toggle">I have pets</label>
              </div>
            </div>
          </div>

          {/* ---------- Roommate Preferences ---------- */}
          <div className="form-section">
            <h3 className="form-section-title">Roommate Preferences</h3>
            <p className="form-section-desc">Open-ended answers that help match you on more than just numbers.</p>

            <div className="form-field">
              <label>What is your biggest roommate pet peeve?</label>
              <textarea
                placeholder="Example: Leaving dishes in the sink, being loud at night, not communicating about guests."
                value={form.roommatePetPeeve}
                onChange={(e) => update("roommatePetPeeve", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>What is your conflict resolution style? Are you more confrontational or avoidant?</label>
              <textarea
                placeholder="Example: I tend to keep things to myself until I boil over."
                value={form.conflictStyle}
                onChange={(e) => update("conflictStyle", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Do you like to have visitors? How often?</label>
              <textarea
                placeholder="Example: I have friends over often. Not a fan of overnight guests."
                value={form.visitorStyle}
                onChange={(e) => update("visitorStyle", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>What are your strict boundaries when sharing a space?</label>
              <textarea
                placeholder="Example: I do not share groceries."
                value={form.boundaries}
                onChange={(e) => update("boundaries", e.target.value)}
              />
            </div>
          </div>

          {/* ---------- Profile Picture ---------- */}
          <div className="form-section">
            <h3 className="form-section-title">Profile Picture</h3>

            <div className="form-field">
              <label>Upload a photo</label>
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
            </div>

            {form.profilePicture && (
              <img
                src={form.profilePicture}
                alt="Profile preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginTop: "8px",
                }}
              />
            )}
          </div>

          {/* ---------- About You ---------- */}
          <div className="form-section">
            <h3 className="form-section-title">About You</h3>

            <div className="form-field">
              <label>Bio</label>
              <textarea
                placeholder="Tell potential roommates about yourself"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default RoommateProfile;
