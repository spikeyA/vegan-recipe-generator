import React, { useState } from 'react';
import './App.css';
import VoiceInput from './components/VoiceInput';
import RecipeOutput from './components/RecipeOutput';
import RecipeLinks from './components/RecipeLinks';
import { findNonVeganIngredients, fetchVeganRecipes, generatePrompt } from 'src/utils/helpers.js';
import { callOpenAI } from './utils/api';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [recipeLinks, setRecipeLinks] = useState([]);

  const generateRecipe = async () => {
    if (!input.trim()) return;

    const nonVegan = findNonVeganIngredients(input);
    setWarning(
      nonVegan.length
        ? `⚠️ Non-vegan ingredients found: ${nonVegan.join(', ')}.`
        : ''
    );

    setLoading(true);
    setOutput('Searching recipes...');

    try {
      const prompt = generatePrompt(input);
      const gptResult = await callOpenAI(prompt);
      setOutput(gptResult);

      const links = await fetchVeganRecipes(input);
      setRecipeLinks(links);
    } catch (error) {
      setOutput('Error occurred. See console.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🌿 Vegan Recipe Generator</h1>

      <textarea
        placeholder="Enter ingredients or a dish idea..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={generateRecipe} disabled={loading}>
        {loading ? 'Working...' : 'Generate Recipe'}
      </button>
      <VoiceInput setInput={setInput} setOutput={setOutput} />

      {warning && <div className="warning">{warning}</div>}
      <RecipeOutput content={output} />
      <RecipeLinks links={recipeLinks} />
    </div>
  );
}

export default App;
