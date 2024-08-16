import React from "react";
import {Link} from 'react-router-dom';
import './landingPage.css';

const LandingPage = () =>{
    return(
        <div className="landing-page">
            <header className="header">
              <h1>Welcome To Attendance Tracker</h1>
              <p>Track and manage attendance with ease.</p>
            </header>
            <main className="main-content">
              <section className="features">
                <h2>Features</h2>
                <ul>
                    <li>Real-time attendance tracking</li>
                    <li>User-friendly</li>
                    <li>Customizable reporting</li>
                    <li>mobile-friendly design</li>
                </ul>
              </section>
              <section className="login">
                 <Link to="/userSelection" className="login-button">Login</Link>
              </section>
            </main>
            <footer className="footer">
               <p>&copy; 2024 Attendance Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;