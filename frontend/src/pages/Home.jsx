import { useState } from 'react';
import CodeEditor from '../components/editor/CodeEditor';
import ReviewPanel from '../components/review/ReviewPanel';
import { submitReview } from '../services/api';

const Home = () => {
  const [currentReview, setCurrentReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReviewSubmit = async (code, language) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await submitReview(code, language);
      setCurrentReview(response);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.response?.data?.detail || 'Failed to submit review. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* Code Editor Panel - Left Side */}
      <div className="w-1/2 h-full border-r border-vscode-border">
        <CodeEditor onReviewSubmit={handleReviewSubmit} isLoading={isLoading} />
      </div>

      {/* Review Panel - Right Side */}
      <div className="w-1/2 h-full">
        {error ? (
          <div className="h-full flex items-center justify-center bg-vscode-panel">
            <div className="text-center p-6">
              <div className="text-red-400 text-lg mb-2">Error</div>
              <p className="text-vscode-text-muted text-sm">{error}</p>
              <p className="text-vscode-text-muted text-xs mt-2">
                Make sure the FastAPI backend is running at localhost:8000
              </p>
            </div>
          </div>
        ) : (
          <ReviewPanel review={currentReview} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Home;
