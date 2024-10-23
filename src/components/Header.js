// frontend/src/components/Header.js

import React, { useContext, useEffect } from 'react'; // Added useEffect
import { AuthContext } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from './Header.module.css'; // Ensure this file exists

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasNotifications, setHasNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = auth.user?.role;

  // Fetch notifications (mock implementation)
  useEffect(() => { // Now useEffect is defined
    const fetchNotifications = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        // Assuming the API returns an array of notifications
        setHasNotifications(response.data.notifications.length > 0);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    if (auth.token) {
      fetchNotifications();
    }
  }, [auth.token]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          {/* Admin Links */}
          {userRole === 'administrator' && (
            <>
              <li className={styles.li}>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                  Admin Dashboard
                </NavLink>
              </li>
              <li className={styles.li}>
                <NavLink
                  to="/certification-form"
                  className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                  Submit Certification Form
                </NavLink>
              </li>
              <li className={styles.li}>
                <NavLink
                  to="/view-submissions"
                  className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                  View Submitted COCs
                </NavLink>
              </li>
              <li className={styles.li}>
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                  Dashboard
                </NavLink>
              </li>
            </>
          )}

          {/* Non-Admin Links */}
          {userRole !== 'administrator' && (
            <>
              <li className={styles.li}>
                <NavLink
                  to="/certification-form"
                  className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                  Submit Certification Form
                </NavLink>
              </li>
              <li className={styles.li}>
                <NavLink
                  to="/view-submissions"
                  className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                >
                  View Submitted COCs
                </NavLink>
              </li>
              {['finance', 'manager', 'vp'].includes(userRole) && (
                <li className={styles.li}>
                  <NavLink
                    to="/pending-approvals"
                    className={({ isActive }) => isActive ? styles.activeLink : styles.link}
                  >
                    Pending Approvals
                  </NavLink>
                </li>
              )}
              {/* Notification Bell */}
              <li className={styles.li}>
                <NavLink to="/notifications" className={styles.notificationLink}>
                  <FontAwesomeIcon icon={faBell} />
                  {hasNotifications && <span className={styles.badge}></span>}
                </NavLink>
              </li>
            </>
          )}

          {/* Logout Button */}
          {auth.token && (
            <li className={styles.li}>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
