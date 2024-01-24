import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [inputValues, setInputValues] = useState(Array(36).fill(''));
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [invisibleIndices, setInvisibleIndices] = useState([]);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [redIndices, setRedIndices] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  const shuffleArray = (array) => {
    const newArray = [...array];
    newArray.sort(() => Math.random() - 0.5);
    return newArray;
  };

  const resetGame = () => {
    setRevealedIndices([]);
    setInvisibleIndices([]);
    setClickDisabled(false);
    setRedIndices([]);
    setShowCongrats(false);

    const allNumbers = Array.from({ length: 18 }, (_, index) => index + 1);
    const shuffledNumbers = shuffleArray([...allNumbers, ...allNumbers]);
    const newInputValues = Array(36).fill('').map((_, index) => shuffledNumbers[index]);
    setInputValues(newInputValues);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleInputClick = (index) => {
    if (clickDisabled || revealedIndices.length === 2 || revealedIndices.includes(index)) {
      return;
    }

    const newRevealedIndices = [...revealedIndices, index];
    setRevealedIndices(newRevealedIndices);

    if (newRevealedIndices.length === 2) {
      const [index1, index2] = newRevealedIndices;
      const value1 = inputValues[index1];
      const value2 = inputValues[index2];

      if (value1 === value2) {
        setInvisibleIndices([...invisibleIndices, index1, index2]);
        setRevealedIndices([]);
        setClickDisabled(true);

        setTimeout(() => {
          setClickDisabled(false);
        }, 1000);
      } else {
        setRedIndices([index1, index2]);

        setTimeout(() => {
          setRevealedIndices([]);
          setRedIndices([]);
        }, 3000);
      }
    }
  };

  const visibleBoxCount = inputValues.filter((value, index) => !invisibleIndices.includes(index)).length;

  useEffect(() => {
    if (visibleBoxCount === 0) {
      setTimeout(() => {
        setShowCongrats(true);
      }, 3000);
    }
  }, [visibleBoxCount]);

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
                  transition: 'visibility 3s ease',
                  backgroundColor: (() => {
                    if (invisibleIndices.includes(index)) {
                      return 'lightgreen';
                    } else if (redIndices.includes(index)) {
                      return 'red';
                    } else {
                      return 'white';
                    }
                  })(),
                }}
              />
            ))}
          </div>
        </div>
        {showCongrats && (
          <>
            <p>Congrats! You've done it. Wanna try again?</p>
            <button onClick={resetGame}>Play Again!</button>
          </>
        )}
      </div>
    </>
  );
};

export default App;
