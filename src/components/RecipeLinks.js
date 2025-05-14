import React from 'react';

function RecipeLinks({ links = [] }) {
  if (!Array.isArray(links) || links.length === 0) {
    return null; // or a fallback UI
  }


  return (
    <div className="recipe-links">
      <h2>🔗 More Vegan Recipes You Can Try:</h2>
      <ul>
        {links.map((recipe) => (
          <li key={recipe.id}>
            <a
              href={`https://spoonacular.com/recipes/${recipe.title
                .toLowerCase()
                .replace(/ /g, '-')}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {recipe.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeLinks;
