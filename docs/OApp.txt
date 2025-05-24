import React, { useState } from 'react';
import './App.css';
import VoiceInput from './components/VoiceInput';
import RecipeOutput from './components/RecipeOutput';
import RecipeLinks from './components/RecipeLinks';
import { findNonVeganIngredients, fetchVeganRecipes, generatePrompt } from './utils/helpers.js';
import { callOpenAI } from './utils/api';
import VoiceChatBot  from './components/VoiceChatBot';

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
     setOutput(prev => `${prev}\n\nHere are some vegan recipes you can try:`);

      const result = await fetchVeganRecipes(input);
      console.log('Fetched recipes:', result.data);
   /*    if (!result.success) {
         setOutput('Error fetching recipes. Please try again later.');
         return;
     } */
      if (result.data.length === 0) {
        setOutput('No vegan recipes found for your input.');
        return;
      }

      setOutput('Here are some vegan recipes you can try:');

    setRecipeLinks(result.data); // make sure this is an array
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

    
      <VoiceChatBot />
    </div>
  );
}

export default App;
