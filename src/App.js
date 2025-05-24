import React, { useState } from 'react';
import './App.css';
import VoiceInput from './components/VoiceInput';
import RecipeOutput from './components/RecipeOutput';
import RecipeLinks from './components/RecipeLinks';
import { findNonVeganIngredients, generatePrompt } from './utils/helpers.js';
import { callOpenAI, fetchVeganRecipes } from './utils/api';
import Homepage from './pages/Homepage';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [recipeLinks, setRecipeLinks] = useState([]);

  const generateRecipe = async () => {
    if (!input.trim()) return;

    // Check for non-vegan ingredients
    const nonVegan = findNonVeganIngredients(input);
    setWarning(
      nonVegan.length
        ? `⚠️ Non-vegan ingredients found: ${nonVegan.join(', ')}. We'll suggest vegan alternatives.`
        : ''
    );

    setLoading(true);
    setOutput('Generating your vegan recipe...');
    setRecipeLinks([]);

    try {
      // Generate recipe with OpenAI
      const prompt = generatePrompt(input);
      const gptResult = await callOpenAI(prompt);
      setOutput(gptResult);

      // Fetch additional recipe links from Spoonacular
      setOutput(prev => `${prev}\n\n🔍 Finding more vegan recipes...`);
      const recipeResults = await fetchVeganRecipes(input);
      
      if (recipeResults && recipeResults.length > 0) {
        setRecipeLinks(recipeResults);
        setOutput(prev => `${prev.split('🔍 Finding more vegan recipes...')[0]}\n\n✅ Found ${recipeResults.length} additional vegan recipes below!`);
      } else {
        setOutput(prev => `${prev.split('🔍 Finding more vegan recipes...')[0]}\n\n💡 No additional recipes found, but you have a great recipe above!`);
      }
    } catch (error) {
      console.error('Recipe generation error:', error);
      setOutput('Sorry, there was an error generating your recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Homepage>
      <div className="App">
        <h1>🌿 Vegan Recipe Generator</h1>
        <p className="subtitle">Create delicious plant-based recipes from your ingredients!</p>

        <div className="input-section">
          <textarea
            placeholder="Enter ingredients or a dish idea (e.g., 'pasta with tomatoes and basil' or 'chocolate dessert')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="4"
          />
          <div className="button-group">
            <button 
              onClick={generateRecipe} 
              disabled={loading || !input.trim()}
              className="generate-btn"
            >
              {loading ? '🔄 Working...' : '✨ Generate Recipe'}
            </button>
            <VoiceInput setInput={setInput} setOutput={setOutput} />
          </div>
        </div>

        {warning && <div className="warning">{warning}</div>}
        
        {output && <RecipeOutput content={output} />}
        
        {recipeLinks.length > 0 && <RecipeLinks links={recipeLinks} />}
      </div>
    </Homepage>
  );
}

export default App;
