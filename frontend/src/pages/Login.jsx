function Login() {
    return (
        <main className="page">
            <div className="card">
                <h1>Login</h1>
  
                <form className="form">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your student email" />
  
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password" />
  
                    <button type="submit">Login</button>
                </form>
            </div>
        </main>
    );
}

export default Login;