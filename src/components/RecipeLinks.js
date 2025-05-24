import React from 'react';

function RecipeLinks({ links = [] }) {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <div className="recipe-links">
      <h2>🔗 More Vegan Recipes You Can Try</h2>
      <ul>
        {links.map((recipe) => (
          <li key={recipe.id}>
            <a
              href={`https://spoonacular.com/recipes/${recipe.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`View ${recipe.title} recipe on Spoonacular`}
            >
              {recipe.title}
              {recipe.readyInMinutes && (
                <span style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginLeft: '10px',
                  fontWeight: 'normal'
                }}>
                  ⏱️ {recipe.readyInMinutes} min
                </span>
              )}
            </a>
            {recipe.summary && (
              <p style={{ 
                fontSize: '14px', 
                color: '#666', 
                margin: '8px 0 0 28px',
                lineHeight: '1.4'
              }}>
                {recipe.summary.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
            )}
          </li>
        ))}
      </ul>
      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '14px', 
        color: '#666' 
      }}>
        💡 Click any recipe above to view full instructions on Spoonacular
      </div>
    </div>
  );
}

export default RecipeLinks;
