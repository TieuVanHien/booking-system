import { useState } from 'react';
import axios from 'axios';

const Overview = () => {
  const [url, setUrl] = useState('');

  const trackSocialMediaUsage = async () => {
    try {
      const response = await axios.post('/api/tracker', { url });
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error('Failed to track social media usage:', error);
    }
  };

  return (
    <div>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={trackSocialMediaUsage}>Track</button>
    </div>
  );
};

export default Overview;
