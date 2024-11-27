import React, { useState, useEffect } from "react";

const gridSize = 10; // Define the grid size (10x10)
const words = ["apple", "banana", "orange", "grape", "kiwi"]; // List of words to be placed

// Directions for placing words (horizontal, vertical, diagonal, etc.)
const directions = [
  [0, 1], // Right (Across)
  [0, -1], // Left (Reverse Across)
  [1, 0], // Down (Vertical)
  [-1, 0], // Up (Reverse Vertical)
  [1, 1], // Diagonal Down-Right
  [1, -1], // Diagonal Down-Left
  [-1, 1], // Diagonal Up-Right
  [-1, -1], // Diagonal Up-Left
];

// Function to randomly place words in the grid
const placeWords = (words, gridSize) => {
  const grid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(null)); // Create empty grid
  const placedWords = [];

  const canPlaceWord = (word, row, col, direction) => {
    const [dx, dy] = direction;
    let x = row;
    let y = col;

    // Check if word fits in the grid
    for (let i = 0; i < word.length; i++) {
      if (
        x < 0 ||
        x >= gridSize ||
        y < 0 ||
        y >= gridSize ||
        grid[x][y] !== null
      ) {
        return false;
      }
      x += dx;
      y += dy;
    }
    return true;
  };

  const placeWord = (word, row, col, direction) => {
    const [dx, dy] = direction;
    let x = row;
    let y = col;

    // Place the word in the grid
    for (let i = 0; i < word.length; i++) {
      grid[x][y] = word[i];
      x += dx;
      y += dy;
    }
  };

  // Try placing each word randomly
  words.forEach((word) => {
    let placed = false;
    while (!placed) {
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(word, row, col, randomDirection)) {
        placeWord(word, row, col, randomDirection);
        placedWords.push(word);
        placed = true;
      }
    }
  });

  return grid;
};

const Crossword = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [remainingWords, setRemainingWords] = useState(words);

  // Initialize the grid on component mount
  useEffect(() => {
    const initialGrid = placeWords(words, gridSize);
    setGrid(initialGrid);
  }, []);

  // Handle cell click for user input
  const handleCellClick = (row, col) => {
    const newSelectedCells = [...selectedCells];
    newSelectedCells.push({ row, col });

    // Check if a word has been selected
    const word = getSelectedWord(newSelectedCells);
    if (word) {
      // Word found, remove from remaining words
      setRemainingWords(remainingWords.filter((w) => w !== word));
    }

    setSelectedCells(newSelectedCells);
  };

  // Get word from selected cells (from clicked cells)
  const getSelectedWord = (selectedCells) => {
    if (selectedCells.length === 0) return "";

    const firstCell = selectedCells[0];
    const wordDirection = getWordDirection(selectedCells);

    // Rebuild word from selected cells
    let word = "";
    let { row, col } = firstCell;
    selectedCells.forEach((cell) => {
      word += grid[cell.row][cell.col];
    });
    return word;
  };

  // Determine if the clicked cells form a valid word direction (across or down)
  const getWordDirection = (selectedCells) => {
    // Determine the direction based on the first and last cell
    const start = selectedCells[0];
    const end = selectedCells[selectedCells.length - 1];

    // Check if cells are all in one row (across) or in one column (down)
    if (start.row === end.row) return "across";
    if (start.col === end.col) return "down";
    return ""; // Invalid direction
  };

  // Render the grid
  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className='flex'>
        {row.map((cell, colIndex) => {
          const isSelected = selectedCells.some(
            (cell) => cell.row === rowIndex && cell.col === colIndex
          );
          return (
            <div
              key={colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={`w-12 h-12 border flex items-center justify-center cursor-pointer ${
                isSelected ? "bg-yellow-300" : "bg-white"
              }`}>
              {cell && <span className='text-lg font-semibold'>{cell}</span>}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className='max-w-2xl mx-auto mt-10 p-4'>
      <h2 className='text-3xl font-bold text-center mb-6'>
        Click-to-Complete Crossword Puzzle
      </h2>

      <div className='mb-6'>
        <h3 className='text-xl font-semibold'>Words Remaining:</h3>
        <ul>
          {remainingWords.map((word, index) => (
            <li key={index} className='text-lg'>
              {word}
            </li>
          ))}
        </ul>
      </div>

      <div className='grid grid-cols-1 gap-2 mb-6'>
        <div className='grid grid-cols-1 gap-1'>{renderGrid()}</div>
      </div>
    </div>
  );
};

export default Crossword;
