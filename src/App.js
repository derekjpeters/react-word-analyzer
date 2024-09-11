import React, { useState } from 'react';
import './App.css';

function App() {
  const [words, setWords] = useState('');
  const [results, setResults] = useState([]);
  const [anagrams, setAnagrams] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const analyzeWords = () => {
    const wordList = words.split(',').map(word => word.trim());
    const letterCounts = countLetterOccurrences(wordList);
    const groupedAnagrams = groupAnagrams(wordList);
    
    setResults(letterCounts);
    setAnagrams(groupedAnagrams);
  };

  const countLetterOccurrences = (words) => {
    const counts = words.map(word => {
      const letterMap = new Map();
      for (let char of word) {
        letterMap.set(char, (letterMap.get(char) || 0) + 1);
      }
      return { word, letterMap };
    });
    return counts;
  };

  const groupAnagrams = (words) => {
    const anagramMap = new Map();
    words.forEach(word => {
      const sortedWord = word.split('').sort().join('');
      if (!anagramMap.has(sortedWord)) {
        anagramMap.set(sortedWord, []);
      }
      anagramMap.get(sortedWord).push(word);
    });
    return Array.from(anagramMap.values());
  };

  const highlightDuplicates = (word, letterCountMap) => {
    return word.split('').map((letter, index) => {
      if (letterCountMap.get(letter) > 1) {
        return <span key={index} className="highlight">{letter}</span>;
      } else {
        return letter;
      }
    });
  };

  const copyResultsToClipboard = () => {
    const resultText = results.map(result => 
      `${result.word}: ${JSON.stringify(Object.fromEntries(result.letterMap))}`
    ).join('\n');
    
    navigator.clipboard.writeText(resultText)
      .then(() => alert('Results copied to clipboard!'));
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={darkMode ? 'App dark-mode' : 'App'}>
      <div className="toggle-switch">
        <label className="switch">
          <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} />
          <span className="slider"></span>
        </label>
        <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
      </div>
      
      <h1>Word Analyzer Tool</h1>
      <label htmlFor="wordInput">Enter words (comma-separated):</label>
      <input 
        type="text" 
        id="wordInput" 
        value={words} 
        onChange={(e) => setWords(e.target.value)} 
        placeholder="e.g., apple, banana, tea, eat, cat, tac" 
      />
      <button onClick={analyzeWords}>Analyze Words</button>

      <WordStats words={words.split(',').map(word => word.trim())} />
      
      <div id="output">
        <h2>Word Analysis Results:</h2>
        {results.map(result => (
          <div className="result-card" key={result.word}>
            <h3>{highlightDuplicates(result.word, result.letterMap)}</h3>
            <CharacterCountBar letterMap={result.letterMap} />
          </div>
        ))}

        <AnagramList anagrams={anagrams} />

        <WordCloud words={words.split(',').map(word => word.trim())} />
        
        <button onClick={copyResultsToClipboard}>Copy Results</button>
      </div>
    </div>
  );
}

function CharacterCountBar({ letterMap }) {
  const letters = Array.from(letterMap.keys());
  
  return (
    <div className="char-count-bar">
      {letters.map(letter => (
        <div key={letter} className="bar-container">
          <span>{letter}</span>
          <div className="bar" style={{ width: `${letterMap.get(letter) * 20}px` }}>
            {letterMap.get(letter)}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnagramList({ anagrams }) {
  return (
    <div className="result-card">
      <h3>Grouped Anagrams</h3>
      <p>
        {anagrams.map((group, index) => (
          <span key={index} className="anagram-group bounce">{JSON.stringify(group)} </span>
        ))}
      </p>
    </div>
  );
}

function WordCloud({ words }) {
  return (
    <div className="word-cloud">
      {words.map(word => (
        <span key={word} style={{ fontSize: `${word.length * 5 + 12}px`, margin: '5px' }}>
          {word}
        </span>
      ))}
    </div>
  );
}

function WordStats({ words }) {
  const totalWords = words.length;
  const totalLetters = words.reduce((acc, word) => acc + word.length, 0);
  const uniqueLetters = new Set(words.join('')).size;

  return (
    <div className="stats-card">
      <h3>Word Statistics</h3>
      <p>Total Words: {totalWords}</p>
      <p>Average Word Length: {(totalLetters / totalWords).toFixed(2)}</p>
      <p>Unique Letters: {uniqueLetters}</p>
    </div>
  );
}

export default App;
