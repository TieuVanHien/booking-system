import { useState } from 'react';
import axios from 'axios';

const Overview = () => {
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('');

  const handleTrack = async () => {
    try {
      await axios.post('/api/tracker', { url });
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  };

  const fetchDuration = async () => {
    try {
      const response = await axios.get('/api/tracker');
      const { duration } = response.data;
      setDuration(duration);
    } catch (error) {
      console.error('Failed to fetch duration:', error);
    }
  };

  return (
    <div>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleTrack}>Track</button>
      <button onClick={fetchDuration}>Get Duration</button>
      <p>Duration: {duration}</p>
    </div>
  );
};

export default Overview;
