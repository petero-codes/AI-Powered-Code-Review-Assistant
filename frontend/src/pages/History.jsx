import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHistory, deleteReview } from '../services/api';
import { Trash2, Calendar, Code2, Star, ChevronRight } from 'lucide-react';

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setReviews(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        setError('Failed to load history. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-vscode-bg">
        <div className="text-vscode-text-muted">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-vscode-bg">
        <div className="text-center p-6">
          <p className="text-red-400 mb-2">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              // Re-run effect by toggling state? Simpler: just reload page?
              // Let's just call fetchHistory manually again
              const fetchHistory = async () => {
                try {
                  const data = await getHistory();
                  setReviews(data);
                } catch (error) {
                  console.error('Retry failed:', error);
                  setError('Failed to load history.');
                } finally {
                  setIsLoading(false);
                }
              };
              fetchHistory();
            }}
            className="text-vscode-button hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-vscode-bg">
      {/* Reviews List - Left Side */}
      <div className="w-1/3 border-r border-vscode-border flex flex-col">
        <div className="px-6 py-4 border-b border-vscode-border bg-vscode-sidebar">
          <h1 className="text-xl font-bold text-white">Review History</h1>
          <p className="text-sm text-vscode-text-muted mt-1">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-vscode">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-vscode-text-muted p-6 text-center">
              <Code2 size={48} className="mb-4 opacity-50" />
              <p>No reviews yet.</p>
              <p className="text-sm">Submit some code to get started!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border-b border-vscode-border cursor-pointer transition-colors hover:bg-vscode-activity ${
                  selectedReview?.id === review.id ? 'bg-vscode-tab border-l-2 border-l-vscode-button' : ''
                }`}
                onClick={() => setSelectedReview(review)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded bg-vscode-input text-vscode-text-muted font-mono uppercase">
                        {review.language}
                      </span>
                      <div className={`flex items-center gap-1 font-bold ${getScoreColor(review.score)}`}>
                        <Star size={14} />
                        {review.score}
                      </div>
                    </div>
                    <p className="text-xs text-vscode-text-muted truncate">
                      {review.original_code.substring(0, 60)}...
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-vscode-text-muted">
                      <Calendar size={12} />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-vscode-text-muted flex-shrink-0 transition-transform ${
                      selectedReview?.id === review.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Review Detail - Right Side */}
      <div className="flex-1 overflow-y-auto">
        {selectedReview ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Review Details</h2>
                <p className="text-sm text-vscode-text-muted">
                  {new Date(selectedReview.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selectedReview.id)}
                className="p-2 text-vscode-text-muted hover:text-red-400 transition-colors"
                title="Delete review"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Code Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-vscode-text mb-2">Original Code</h3>
              <pre className="bg-vscode-sidebar p-4 rounded overflow-x-auto text-sm font-mono text-vscode-text border border-vscode-border">
                {selectedReview.original_code}
              </pre>
            </div>

            {/* Review Content (embedded ReviewPanel-like view) */}
            <div>
              <h3 className="text-sm font-semibold text-vscode-text mb-3">AI Feedback</h3>
              <div className="bg-vscode-panel rounded border border-vscode-border p-4">
                <ReviewSummary review={selectedReview} />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-vscode-text-muted">
              <Code2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a review to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simplified review display for history detail view
const ReviewSummary = ({ review }) => {
  const { review_json, score } = review;
  const { summary, bugs, optimizations, standards_violations, positives } = review_json;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-vscode-border">
        <span className="font-medium">Overall Score</span>
        <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-2">Summary</h4>
        <p className="text-sm text-vscode-text">{summary}</p>
      </div>

      {bugs.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 text-red-400">Bugs ({bugs.length})</h4>
          <ul className="space-y-2">
            {bugs.map((bug, i) => (
              <li key={i} className="text-sm bg-vscode-sidebar p-2 rounded border-l-2 border-red-500">
                <div className="flex justify-between">
                  <span className="font-mono text-xs">Line {bug.line}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{bug.severity}</span>
                </div>
                <p className="mt-1">{bug.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {optimizations.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 text-yellow-400">Optimizations ({optimizations.length})</h4>
          <ul className="space-y-2">
            {optimizations.map((opt, i) => (
              <li key={i} className="text-sm bg-vscode-sidebar p-2 rounded border-l-2 border-yellow-500">
                <p>{opt.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {standards_violations.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 text-blue-400">Standards ({standards_violations.length})</h4>
          <ul className="space-y-2">
            {standards_violations.map((violation, i) => (
              <li key={i} className="text-sm bg-vscode-sidebar p-2 rounded border-l-2 border-blue-500">
                <div className="flex justify-between">
                  <span className="font-mono text-xs">Line {violation.line}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">{violation.rule}</span>
                </div>
                <p className="mt-1">{violation.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {positives.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 text-green-400">Positives ({positives.length})</h4>
          <ul className="space-y-2">
            {positives.map((positive, i) => (
              <li key={i} className="text-sm bg-vscode-sidebar p-2 rounded border-l-2 border-green-500">
                {positive}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;