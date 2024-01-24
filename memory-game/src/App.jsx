import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [inputValues, setInputValues] = useState(Array(36).fill('')); // Initialize with empty strings
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [invisibleIndices, setInvisibleIndices] = useState([]);
  const [clickDisabled, setClickDisabled] = useState(false);

  useEffect(() => {
    const allNumbers = Array.from({ length: 18 }, (_, index) => index + 1);

    // Double the array to ensure each number is available twice
    const shuffledNumbers = shuffleArray([...allNumbers, ...allNumbers]);

    const newInputValues = inputValues.map((value, index) => {
      if (value === '') {
        // Find the first unused number from the shuffled array
        const unusedNumber = shuffledNumbers.find(
          (number) =>
            inputValues.filter((val) => val === number).length < 2
        );

        // Update the shuffled array to mark the number as used
        shuffledNumbers.splice(shuffledNumbers.indexOf(unusedNumber), 1);

        return unusedNumber;
      }

      return value;
    });

    setInputValues(newInputValues);
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const newArray = [...array];
    newArray.sort(() => Math.random() - 0.5);
    return newArray;
  };

  // Function to handle input click
  const handleInputClick = (index) => {
    if (clickDisabled || revealedIndices.length === 2 || revealedIndices.includes(index)) {
      // Clicks are disabled, already two boxes are revealed, or clicked box is already revealed
      return;
    }

    const newRevealedIndices = [...revealedIndices, index];
    setRevealedIndices(newRevealedIndices);

    if (newRevealedIndices.length === 2) {
      // Check if values at the two revealed indices match
      const [index1, index2] = newRevealedIndices;
      const value1 = inputValues[index1];
      const value2 = inputValues[index2];

      if (value1 === value2) {
        // Values match, make the indices invisible and disable clicks temporarily
        setInvisibleIndices([...invisibleIndices, index1, index2]);
        setRevealedIndices([]);
        setClickDisabled(true);

        // Delay for a short time to let the user see the matching values
        setTimeout(() => {
          setClickDisabled(false);
        }, 1000); // You can adjust the delay as needed
      } else {
        // Values don't match, hide the values after a short delay
        setTimeout(() => {
          setRevealedIndices([]);
        }, 1000); // You can adjust the delay as needed
      }
    }
  };

  return (
    <>
      <div className='app'>
        <h1>Memory Game</h1>
        <div className='main-container'>
          <div className='card-container'>
            {inputValues.map((value, index) => (
              <input
                key={index}
                type="text"
                value={revealedIndices.includes(index) || invisibleIndices.includes(index) ? value : ''}
                readOnly
                onClick={() => handleInputClick(index)}
                style={{
                  visibility: invisibleIndices.includes(index) ? 'hidden' : 'visible',
                  transition: 'visibility 3s ease', // Transition duration is set to 3 seconds
                  backgroundColor: invisibleIndices.includes(index) ? 'lightgreen' : "white",
                }}
              />
            ))}
          </div>
        </div>
        <p>Game Over!</p>
        <button>Play Again!</button>
      </div>
    </>
  );
};

export default App;
