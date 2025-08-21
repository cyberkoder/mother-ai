import React from 'react';

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, onSuggestionClick }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1 border-2 border-alien-green/50 bg-black/80 font-mono text-xs text-alien-green/70 hover:border-alien-green hover:bg-alien-green/5 hover:text-alien-green transition-all"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
