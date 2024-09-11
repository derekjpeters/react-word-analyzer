import React, { useState } from 'react'; // Import React and useState for managing state
import './App.css'; // Import the stylesheet for the component

function App() {
  // useState hooks to manage state for words input, results, anagrams, and dark mode
  const [words, setWords] = useState(''); // State to store input words
  const [results, setResults] = useState([]); // State to store word analysis results
  const [anagrams, setAnagrams] = useState([]); // State to store grouped anagrams
  const [darkMode, setDarkMode] = useState(false); // State to toggle dark mode

  // Function to analyze the words entered
  const analyzeWords = () => {
    const wordList = words.split(',').map(word => word.trim()); // Split the words by comma and remove extra spaces
    const letterCounts = countLetterOccurrences(wordList); // Count the letter occurrences for each word
    const groupedAnagrams = groupAnagrams(wordList); // Group the words that are anagrams of each other
    
    setResults(letterCounts); // Update the state with the letter counts
    setAnagrams(groupedAnagrams); // Update the state with the grouped anagrams
  };

  // Function to count letter occurrences in each word
  const countLetterOccurrences = (words) => {
    const counts = words.map(word => {
      const letterMap = new Map(); // Create a Map to store the count of each letter
      for (let char of word) {
        letterMap.set(char, (letterMap.get(char) || 0) + 1); // Increment the count of the letter
      }
      return { word, letterMap }; // Return the word and its letterMap
    });
    return counts; // Return an array of words with their letter counts
  };

  // Function to group anagrams together
  const groupAnagrams = (words) => {
    const anagramMap = new Map(); // Create a Map to store anagrams
    words.forEach(word => {
      const sortedWord = word.split('').sort().join(''); // Sort letters of the word to find anagram groups
      if (!anagramMap.has(sortedWord)) {
        anagramMap.set(sortedWord, []); // Initialize an empty array for the group if not already set
      }
      anagramMap.get(sortedWord).push(word); // Add the word to the corresponding sorted key group
    });
    return Array.from(anagramMap.values()); // Return all anagram groups as an array
  };

  // Function to highlight duplicate letters in a word
  const highlightDuplicates = (word, letterCountMap) => {
    return word.split('').map((letter, index) => {
      if (letterCountMap.get(letter) > 1) { // If the letter appears more than once
        return <span key={index} className="highlight">{letter}</span>; // Highlight it
      } else {
        return letter; // Otherwise, return the letter normally
      }
    });
  };

  // Function to copy the results to the clipboard
  const copyResultsToClipboard = () => {
    const resultText = results.map(result => 
      `${result.word}: ${JSON.stringify(Object.fromEntries(result.letterMap))}` // Format each result as word: {letter counts}
    ).join('\n');
    
    navigator.clipboard.writeText(resultText) // Copy the formatted results to the clipboard
      .then(() => alert('Results copied to clipboard!')); // Alert the user once copied
  };

  // Function to toggle dark mode on or off
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode); // Toggle the dark mode state
  };

  return (
    <div className={darkMode ? 'App dark-mode' : 'App'}> {/* Conditional class based on dark mode */}
      <div className="toggle-switch">
        <label className="switch">
          <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} /> {/* Dark mode toggle switch */}
          <span className="slider"></span>
        </label>
        <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span> {/* Display dark or light mode text */}
      </div>
      
      <h1>Word Analyzer Tool</h1> {/* Title of the app */}
      <label htmlFor="wordInput">Enter words (comma-separated):</label> {/* Input label */}
      <input 
        type="text" 
        id="wordInput" 
        value={words} 
        onChange={(e) => setWords(e.target.value)} // Update the words state on input change
        placeholder="e.g., apple, banana, tea, eat, cat, tac" // Placeholder example
      />
      <button onClick={analyzeWords}>Analyze Words</button> {/* Button to trigger word analysis */}

      <WordStats words={words.split(',').map(word => word.trim())} /> {/* Component to display word statistics */}
      
      <div id="output">
        <h2>Word Analysis Results:</h2>
        {results.map(result => (
          <div className="result-card" key={result.word}>
            <h3>{highlightDuplicates(result.word, result.letterMap)}</h3> {/* Display highlighted word */}
            <CharacterCountBar letterMap={result.letterMap} /> {/* Component to show character count bar */}
          </div>
        ))}

        <AnagramList anagrams={anagrams} /> {/* Component to display grouped anagrams */}

        <WordCloud words={words.split(',').map(word => word.trim())} /> {/* Component to display word cloud */}
        
        <button onClick={copyResultsToClipboard}>Copy Results</button> {/* Button to copy results */}
      </div>
    </div>
  );
}

// Component to display character count bar for each word
function CharacterCountBar({ letterMap }) {
  const letters = Array.from(letterMap.keys()); // Extract the letters from the map
  
  return (
    <div className="char-count-bar">
      {letters.map(letter => (
        <div key={letter} className="bar-container">
          <span>{letter}</span> {/* Display the letter */}
          <div className="bar" style={{ width: `${letterMap.get(letter) * 20}px` }}> {/* Display bar width based on count */}
            {letterMap.get(letter)}
          </div>
        </div>
      ))}
    </div>
  );
}

// Component to display the list of grouped anagrams
function AnagramList({ anagrams }) {
  return (
    <div className="result-card">
      <h3>Grouped Anagrams</h3>
      <p>
        {anagrams.map((group, index) => (
          <span key={index} className="anagram-group bounce">{JSON.stringify(group)} </span> {/* Display each anagram group */}
        ))}
      </p>
    </div>
  );
}

// Component to display the word cloud with font size proportional to word length
function WordCloud({ words }) {
  return (
    <div className="word-cloud">
      {words.map(word => (
        <span key={word} style={{ fontSize: `${word.length * 5 + 12}px`, margin: '5px' }}>
          {word}
        </span> {/* Display each word with varying font size */}
      ))}
    </div>
  );
}

// Component to display word statistics
function WordStats({ words }) {
  const totalWords = words.length; // Calculate total number of words
  const totalLetters = words.reduce((acc, word) => acc + word.length, 0); // Calculate total letters
  const uniqueLetters = new Set(words.join('')).size; // Calculate unique letters using Set

  return (
    <div className="stats-card">
      <h3>Word Statistics</h3> {/* Display word statistics */}
      <p>Total Words: {totalWords}</p> {/* Display total words */}
      <p>Average Word Length: {(totalLetters / totalWords).toFixed(2)}</p> {/* Display average word length */}
      <p>Unique Letters: {uniqueLetters}</p> {/* Display unique letter count */}
    </div>
  );
}

export default App; // Export the App component as the default export