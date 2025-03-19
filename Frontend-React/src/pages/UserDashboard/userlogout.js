import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../UserDashboardcss/logout.css";

function Popup() {
  const [isOpen, setIsOpen] = useState(true);

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div className="IssuedBook-body">
        <div className="main">
          <div className="popup-container">
            <div className="popup">
              <div className="popup-content">
                <h2>User Logout</h2>
                <p>Would you like to logout?</p>
                <Link to="/dashboard">
                  <button onClick={closePopup}>Cancel</button>
                </Link>

                <Link
                  to="/login"
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                  }}
                >
                  <button onClick={closePopup}>Logout</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Popup;
