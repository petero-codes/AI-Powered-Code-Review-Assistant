import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  Sparkles,
  Loader2,
} from 'lucide-react';

const Section = ({ title, items, icon: Icon, sectionKey, color, isExpanded, onToggle, renderItem }) => (
  <div className="border-b border-vscode-border">
    <button
      onClick={() => onToggle(sectionKey)}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-vscode-activity transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={18} className={color} />
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-vscode-input text-vscode-text-muted">
          {items.length}
        </span>
      </div>
      {isExpanded ? (
        <ChevronUp size={16} className="text-vscode-text-muted" />
      ) : (
        <ChevronDown size={16} className="text-vscode-text-muted" />
      )}
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-3 space-y-2">
            {items.map((item) => renderItem(item))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ReviewPanel = ({ review, isLoading }) => {
  const [expandedSections, setExpandedSections] = useState({
    bugs: true,
    optimizations: true,
    standards: true,
    positives: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-vscode-panel text-vscode-text-muted">
        <Loader2 size={48} className="animate-spin mb-4 text-vscode-button" />
        <p className="animate-pulse">Analyzing code...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="h-full flex items-center justify-center bg-vscode-panel text-vscode-text-muted">
        <div className="text-center">
          <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
          <p>Submit code to see AI review</p>
        </div>
      </div>
    );
  }

  const { review_json, score, created_at } = review;
  const { bugs, optimizations, standards_violations, positives, summary } = review_json;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col bg-vscode-panel scrollbar-vscode">
      {/* Header */}
      <div className="px-6 py-4 border-b border-vscode-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">AI Review</h2>
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-400" />
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</span>
          </div>
        </div>
        <p className="text-xs text-vscode-text-muted">
          Reviewed on {new Date(created_at).toLocaleString()}
        </p>
      </div>

      {/* Summary */}
      <div className="px-6 py-4 border-b border-vscode-border bg-vscode-tab">
        <div className="flex items-start gap-2">
          <MessageSquare size={18} className="text-vscode-button mt-0.5 flex-shrink-0" />
          <p className="text-sm text-vscode-text leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Bugs */}
        {bugs && bugs.length > 0 && (
          <Section
            title="Bugs"
            items={bugs}
            icon={AlertCircle}
            sectionKey="bugs"
            color="text-red-400"
            isExpanded={expandedSections.bugs}
            onToggle={toggleSection}
            renderItem={(bug) => (
              <div className="bg-vscode-sidebar/50 rounded p-3 border-l-2 border-red-500">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-red-400">Line {bug.line || 'N/A'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                    {bug.severity}
                  </span>
                </div>
                <p className="text-sm text-vscode-text mb-2">{bug.description}</p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-vscode-text-muted hover:text-white transition-colors">
                    Suggested fix
                  </summary>
                  <pre className="mt-2 p-2 bg-vscode-editor rounded overflow-x-auto font-mono text-vscode-text">
                    {bug.fix}
                  </pre>
                </details>
              </div>
            )}
          />
        )}

        {/* Optimizations */}
        {optimizations && optimizations.length > 0 && (
          <Section
            title="Optimizations"
            items={optimizations}
            icon={Lightbulb}
            sectionKey="optimizations"
            color="text-yellow-400"
            isExpanded={expandedSections.optimizations}
            onToggle={toggleSection}
            renderItem={(opt) => (
              <div className="bg-vscode-sidebar/50 rounded p-3 border-l-2 border-yellow-500">
                <p className="text-sm text-vscode-text mb-2">{opt.description}</p>
                {opt.suggested_code && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-vscode-text-muted hover:text-white transition-colors">
                      Suggested code
                    </summary>
                    <pre className="mt-2 p-2 bg-vscode-editor rounded overflow-x-auto font-mono text-vscode-text">
                      {opt.suggested_code}
                    </pre>
                  </details>
                )}
              </div>
            )}
          />
        )}

        {/* Standards Violations */}
        {standards_violations && standards_violations.length > 0 && (
          <Section
            title="Standards Violations"
            items={standards_violations}
            icon={Shield}
            sectionKey="standards"
            color="text-blue-400"
            isExpanded={expandedSections.standards}
            onToggle={toggleSection}
            renderItem={(violation) => (
              <div className="bg-vscode-sidebar/50 rounded p-3 border-l-2 border-blue-500">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-blue-400">
                    Line {violation.line || 'N/A'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    {violation.rule}
                  </span>
                </div>
                <p className="text-sm text-vscode-text">{violation.description}</p>
              </div>
            )}
          />
        )}

        {/* Positives */}
        {positives && positives.length > 0 && (
          <Section
            title="Positives"
            items={positives}
            icon={CheckCircle}
            sectionKey="positives"
            color="text-green-400"
            isExpanded={expandedSections.positives}
            onToggle={toggleSection}
            renderItem={(positive) => (
              <div className="bg-vscode-sidebar/50 rounded p-3 border-l-2 border-green-500">
                <p className="text-sm text-vscode-text">{positive}</p>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewPanel;
