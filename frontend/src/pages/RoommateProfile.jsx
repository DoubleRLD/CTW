function RoommateProfile() {
    return (
        <main className="page">
            <div className="card">
                <h1>Roommate Profile</h1>
  
                <form className="form">
                    <label>School</label>
                    <input type="text" placeholder="Example: Georgia State University" />
  
                    <label>Campus / Area</label>
                    <input type="text" placeholder="Example: Atlanta campus" />
  
                    <label>Budget</label>
                    <input type="text" placeholder="Example: $700 - $900" />
  
                    <label>Preferred Housing Type</label>
                    <select>
                        <option>On-Campus Dorm</option>
                        <option>Off-Campus Apartment</option>
                        <option>Either</option>
                    </select>
  
                    <label>Sleep Schedule</label>
                    <select>
                        <option>Early bird</option>
                        <option>Night owl</option>
                        <option>Flexible</option>
                    </select>

                    <label>Cleanliness Level</label>
                    <select>
                        <option>Very clean</option>
                        <option>Average</option>
                        <option>Relaxed</option>
                    </select>

                    <label>Noise Level</label>
                    <select>
                        <option>Quiet</option>
                        <option>Moderate</option>
                        <option>Loud</option>
                    </select>

                    <label>Lifestyle Tags</label>
                    <input type="text" placeholder="Example: quiet, clean, study focused" />

                    <label>About Me</label>
                    <textarea placeholder="Tell potential roommates about yourself"></textarea>

                    <button type="submit">Save Profile</button>
                </form>
            </div>
        </main>
    );
}
  
export default RoommateProfile;