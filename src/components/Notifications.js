import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Notifications = () => {
  const { auth } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [auth.token]);

  return (
    <div style={styles.container}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul style={styles.ul}>
          {notifications.map((notification) => (
            <li key={notification.id} style={styles.li}>
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
  },
  li: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
};

export default Notifications;
