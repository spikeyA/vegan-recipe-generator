import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

// Styled Card Component
const Card = ({ title, children, className = "" }) => {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-200/50 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(34, 197, 94, 0.15)"
      }}
    >
      {title && (
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
};

// Styled Button Component
const Button = ({ children, onClick, disabled = false, variant = "primary", className = "" }) => {
  const baseClasses = "px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105"
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
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
    <Button onClick={handleVoice} variant="secondary" className="flex-1">
      🎤 Use Voice
    </Button>
  );
};

// Recipe Output Component
const RecipeOutput = ({ content }) => {
  if (!content) return null;
  
  return (
    <Card title="👨‍🍳 Generated Recipe">
      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
        {content}
      </div>
    </Card>
  );
};

// Recipe Links Component
const RecipeLinks = ({ links = [] }) => {
  if (!Array.isArray(links) || links.length === 0) {
    return null;
  }

  return (
    <Card title="🔗 More Vegan Recipes You Can Try">
      <div className="space-y-4">
        {links.map((recipe) => (
          <motion.div
            key={recipe.id}
            className="border-l-4 border-green-500 pl-4 hover:bg-green-50/50 p-3 rounded-lg transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            <a
              href={`https://spoonacular.com/recipes/${recipe.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 font-semibold text-lg flex items-center gap-2 transition-colors"
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
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-6 text-sm text-gray-500">
        💡 Click any recipe above to view full instructions on Spoonacular
      </div>
    </Card>
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
    <div 
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 25%, #bbf7d0 50%, #86efac 75%, #4ade80 100%)",
        padding: "2rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button 
          onClick={() => window.history.back()}
          className="absolute left-8 top-8 p-3 hover:bg-green-200/50 rounded-full transition-all duration-300 text-green-800 font-semibold backdrop-blur-sm bg-white/30"
        >
          ← Back
        </button>
        <h1 
          className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3 mb-4"
          style={{
            textShadow: "0 2px 8px rgba(187, 247, 208, 0.8)"
          }}
        >
          🌿 Vegan Recipe Generator
        </h1>
        <p className="text-green-700 text-xl font-medium">
          Discover delicious plant-based recipes tailored to your ingredients!
        </p>
      </motion.div>

      {/* Main content */}
      <div className="w-full max-w-4xl px-6 space-y-6">
        {/* Input Section */}
        <Card title="🌿 What would you like to cook?">
          <div className="space-y-4">
            <label className="block text-green-800 font-semibold text-lg">
              Enter ingredients or describe a dish you'd like to make:
            </label>
            <p>
            <textarea
              placeholder="Enter ingredients like 'tomatoes, basil, pasta' or a dish idea like 'vegan lasagna'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full max-w-800xl p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none resize-none h-32 text-lg bg-white/80 backdrop-blur-sm transition-all duration-300"
            />
            </p>
            <div className="flex gap-6">
              <Button 
                onClick={generateRecipe} 
                disabled={loading}
                className="flex-2"
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
              </Button>
              
                 <VoiceInput setInput={setInput} setOutput={setOutput} />
              
            </div>
            <div className="text-sm text-gray-600 text-center bg-white/50 rounded-lg p-2">
              💡 Tip: Press Ctrl+Enter to generate quickly
            </div>
          </div>
        </Card>

        {/* Warning */}
        {warning && (
          <motion.div
            className="bg-yellow-100/90 backdrop-blur-sm border-l-4 border-yellow-500 p-4 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-yellow-800 font-semibold">{warning}</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="space-y-6">
          <RecipeOutput content={output} />
          <RecipeLinks links={recipeLinks} />
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-green-700 font-medium text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg">
            🌱 Making the world more delicious, one plant-based recipe at a time!
          </p>
        </motion.div>
      </div>
    </div>
  );
}