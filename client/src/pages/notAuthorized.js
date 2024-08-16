import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="not-authorized">
      <header style={{backgroundColor: ' rgba(255, 0, 0, 0.747)'}}>
      <h1>Not Authorized</h1>
      <p>You do not have the necessary permissions to view this page.</p>
      </header>
    </div>
  );
};

export default NotAuthorized;
