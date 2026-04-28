const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const submitReview = async (code, language) => {
  const apiKey = localStorage.getItem('anthropic_api_key') || '';
  
  const response = await fetch(`${API_BASE_URL}/api/review`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({ code, language }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit review');
  }
  return response.json();
};

export const getHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/history`);
  if (!response.ok) throw new Error('Failed to fetch history');
  return response.json();
};

export const getReview = async (reviewId) => {
  const response = await fetch(`${API_BASE_URL}/api/review/${reviewId}`);
  if (!response.ok) throw new Error('Failed to fetch review');
  return response.json();
};

export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_BASE_URL}/api/review/${reviewId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete review');
  return response.json();
};
