import React, { useState } from 'react';

// Mock API functions (replace with your actual implementations)
const findNonVeganIngredients = (input) => {
  const nonVeganItems = ['milk', 'cheese', 'butter', 'eggs', 'chicken', 'beef', 'pork', 'fish', 'honey'];
  const words = input.toLowerCase().split(/\s+/);
  return nonVeganItems.filter(item => words.some(word => word.includes(item)));
};

const generatePrompt = (input) => {
  return `Create a delicious vegan recipe using these ingredients: ${input}. Please provide step-by-step instructions.`;
};

const callOpenAI = async (prompt) => {
  // Mock AI response - replace with your actual OpenAI call
  await new Promise(resolve => setTimeout(resolve, 2000));
  return `🌱 **Delicious Vegan Recipe**

**Ingredients:**
- Fresh vegetables from your input
- Plant-based alternatives
- Herbs and spices

**Instructions:**
1. Prepare all your ingredients by washing and chopping them
2. Heat a pan with a little olive oil
3. Sauté the vegetables until tender
4. Season with herbs and spices
5. Serve hot and enjoy!

This recipe is completely plant-based and nutritious!`;
};

const fetchVeganRecipes = async (input) => {
  // Mock recipe data - replace with your actual Spoonacular API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    data: [
      {
        id: 123456,
        title: "Vegan Buddha Bowl",
        readyInMinutes: 30,
        summary: "A nutritious and colorful vegan bowl packed with fresh vegetables, quinoa, and tahini dressing"
      },
      {
        id: 789012,
        title: "Plant-Based Stir Fry",
        readyInMinutes: 20,
        summary: "Quick and easy stir fry with seasonal vegetables and tofu in a savory sauce"
      },
      {
        id: 345678,
        title: "Vegan Pasta Primavera",
        readyInMinutes: 25,
        summary: "Fresh pasta with seasonal vegetables in a light herb-infused olive oil sauce"
      }
    ]
  };
};

// Voice Input Component
const VoiceInput = ({ setInput, setOutput }) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  const handleVoice = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onstart = () => setOutput('🎙️ Listening...');
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setOutput(`Heard: "${transcript}"`);
    };

    recognition.onerror = (e) => setOutput('Voice error: ' + e.error);
  };

  return (
    <button 
      onClick={handleVoice}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      🎤 Use Voice
    </button>
  );
};

// Recipe Output Component
const RecipeOutput = ({ content }) => {
  if (!content) return null;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
        👨‍🍳 Generated Recipe
      </h3>
      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {content}
      </div>
    </div>
  );
};

// Recipe Links Component
const RecipeLinks = ({ links = [] }) => {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
        🔗 More Vegan Recipes You Can Try
      </h3>
      <div className="space-y-4">
        {links.map((recipe) => (
          <div key={recipe.id} className="border-l-4 border-green-500 pl-4 hover:bg-gray-50 p-3 rounded transition-colors">
            <a
              href={`https://spoonacular.com/recipes/${recipe.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 font-medium text-lg flex items-center gap-2"
            >
              {recipe.title} 🔗
            </a>
            {recipe.readyInMinutes && (
              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                ⏱️ {recipe.readyInMinutes} minutes
              </div>
            )}
            {recipe.summary && (
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {recipe.summary.replace(/<[^>]*>/g, '').substring(0, 150)}...
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-6 text-sm text-gray-500">
        💡 Click any recipe above to view full instructions on Spoonacular
      </div>
    </div>
  );
};

// Main Recipe Generator Component
export default function RecipeGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [recipeLinks, setRecipeLinks] = useState([]);

  const generateRecipe = async () => {
    if (!input.trim()) {
      setOutput('Please enter some ingredients or dish ideas first!');
      return;
    }

    // Check for non-vegan ingredients
    const nonVegan = findNonVeganIngredients(input);
    setWarning(
      nonVegan.length
        ? `⚠️ Non-vegan ingredients found: ${nonVegan.join(', ')}. Consider plant-based alternatives!`
        : ''
    );

    setLoading(true);
    setOutput('🔍 Searching for the perfect vegan recipe...');
    setRecipeLinks([]);

    try {
      // Generate AI recipe
      const prompt = generatePrompt(input);
      const gptResult = await callOpenAI(prompt);
      setOutput(gptResult);

      // Fetch additional recipes
      const result = await fetchVeganRecipes(input);
      console.log('Fetched recipes:', result.data);
      
      if (result.success && result.data.length > 0) {
        setRecipeLinks(result.data);
      }
    } catch (error) {
      setOutput('❌ Something went wrong. Please try again later.');
      console.error('Recipe generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateRecipe();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="absolute left-4 top-8 p-2 hover:bg-green-200 rounded-full transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-green-800 flex items-center gap-3">
              🌿 Vegan Recipe Generator
            </h1>
          </div>
          <p className="text-green-600 text-lg">
            Discover delicious plant-based recipes tailored to your ingredients!
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <label className="block text-green-800 font-semibold mb-3">
            What ingredients do you have or what dish would you like to make?
          </label>
        </div>

        <div>
         <p>  
          <textarea
            placeholder="Enter ingredients like 'tomatoes, basil, pasta' or a dish idea like 'vegan lasagna'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none resize-none h-32"
          />
          </p> 
          </div> 

          <div className="flex gap-3 mt-4">
            <p>
            <button 
              onClick={generateRecipe} 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
            >
              {loading ? (
                <>
                  ⏳ Generating...
                </>
              ) : (
                <>
                  👨‍🍳 Generate Recipe
                </>
              )}
            </button>
                 <VoiceInput setInput={setInput} setOutput={setOutput} />
           </p>   
          </div>
          
          <div className="text-sm text-gray-500 mt-2">
            💡 Tip: Press Ctrl+Enter to generate quickly
          </div>
        </div>

        {/* Warning */}
        {warning && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div className="flex items-center gap-2">
              ⚠️ <p className="text-yellow-800">{warning}</p>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          <RecipeOutput content={output} />
          <RecipeLinks links={recipeLinks} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>🌱 Making the world more delicious, one plant-based recipe at a time!</p>
        </div>
      </div>
    
  );
}