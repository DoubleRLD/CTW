function Register() {
    return (
        <main className="page">
            <div className="card">
                <h1>Create Student Account</h1>
  
                <form className="form">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" />
  
                    <label>School</label>
                    <input type="text" placeholder="Example: Georgia State University" />
  
                    <label>Student Email</label>
                    <input type="email" placeholder="Enter your school email" />
  
                    <label>Password</label>
                    <input type="password" placeholder="Create a password" />
  
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </main>
    );
}

export default Register;