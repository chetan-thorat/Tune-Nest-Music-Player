// src/api/trackService.js

export const fetchTrendingTracks = async () => {
  try {
    const response = await fetch('http://localhost:5184/api/Song');
    if (!response.ok) throw new Error('Failed to fetch tracks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return [];
  }
};
