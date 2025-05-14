import React from 'react';

function RecipeOutput({ content }) {
  return (
    <div className="output">
      <pre>{content}</pre>
    </div>
  );
}

export default RecipeOutput;
