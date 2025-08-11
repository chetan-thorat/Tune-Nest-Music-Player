import React, { useEffect, useState } from 'react';

const PingTest = () => {
  const [message, setMessage] = useState('Checking backend...');

  useEffect(() => {
    fetch('https://localhost:7197/api/test/ping')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error("Backend error:", err);
        setMessage('Failed to connect to backend');
      });
  }, []);

  return (
    <div>
      <h2>Ping Test</h2>
      <p>{message}</p>
    </div>
  );
};

export default PingTest;
