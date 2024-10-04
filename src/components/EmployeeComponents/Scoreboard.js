import React from 'react';

const Scoreboard = () => {
  // Sample data for the scoreboard
  const scores = [
    { name: 'Alice', score: 95 },
    { name: 'Bob', score: 90 },
    { name: 'Charlie', score: 85 },
  ];

  return (
    <div>
      <h3>Scoreboard</h3>
      <ul>
        {scores.map((player, index) => (
          <li key={index}>
            {player.name}: {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
