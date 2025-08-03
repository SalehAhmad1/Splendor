// ResultsDisplay.js
import React from 'react';

function ResultsDisplay({ results }) {
  return (
    <div>
      <h1>Final Measurement Results</h1>
      {results && (
        <div>
          <p>Height: {results.height.toFixed(2)} cm</p>
          <p>Arm Length: {results.armLength.toFixed(2)} cm</p>
          <p>Leg Length: {results.legLength.toFixed(2)} cm</p>
          <p>Navel Length: {results.navelLength.toFixed(2)} cm</p>
          <p>Waist Size: {results.waistSize.toFixed(2)} cm</p>
          <p>Chest Size: {results.chestSize.toFixed(2)} cm</p>
        </div>
      )}
      {!results && <p>No results to display.</p>}
    </div>
  );
}

export default ResultsDisplay;
