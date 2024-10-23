import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h2>Default Dashboard</h2>
      <p>Welcome to the dashboard! Use the navigation links above to access different sections.</p>
      {/* Add more dashboard content as needed */}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
};

export default Dashboard;
