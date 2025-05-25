import React, { useState } from 'react';
import VoiceChatBot  from 'components/VoiceChatBot'; // Assuming AIChat component is defined in AIChat.js
import { ChefHat, MessageCircle, Leaf, Search, Clock, Heart } from 'lucide-react';

const VoiceInput = ({ setInput, setOutput }) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const handleVoice = () => {
    if (!recognition) {
      alert('Speech recognition not supported.');
      return;
    }

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
      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center gap-2 text-sm font-medium whitespace-nowrap"
    >
      🎤 Use Voice
    </button>
  );
};

const RecipeGenerator = ({ onBack, setCurrentView }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [recipeLinks, setRecipeLinks] = useState([]);

  const NON_VEGAN_INGREDIENTS = [
    'milk', 'cheese', 'butter', 'yogurt', 'yoghurt', 'cream', 'sour cream',
    'egg', 'eggs', 'honey', 'meat', 'chicken', 'turkey', 'duck',
    'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'crab',
    'lobster', 'gelatin', 'gelatine', 'lard', 'mayonnaise', 'mayo',
    'bacon', 'ham', 'sausage', 'pepperoni', 'anchovies', 'worcestershire',
    'caesar dressing', 'ranch dressing', 'ice cream', 'whey', 'casein'
  ];

  const findNonVeganIngredients = (input) => {
    const lower = input.toLowerCase();
    return NON_VEGAN_INGREDIENTS.filter(item => lower.includes(item));
  };

  const generateRecipe = async () => {
    if (!input.trim()) return;

    const nonVegan = findNonVeganIngredients(input);
    setWarning(
      nonVegan.length
        ? `⚠️ Non-vegan ingredients found: ${nonVegan.join(', ')}.`
        : ''
    );

    setLoading(true);
    setOutput('Generating your vegan recipe...');

    try {
      // Simulate AI recipe generation
      const mockRecipe = `🌿 **Vegan ${input} Recipe**

**Description:** A delicious plant-based version of ${input} that's both nutritious and satisfying.

**Ingredients:**
- 1 cup quinoa or brown rice
- 2 cups mixed vegetables (bell peppers, zucchini, carrots)
- 1 can coconut milk
- 2 tbsp olive oil
- 1 onion, diced
- 3 cloves garlic, minced
- 1 tsp turmeric
- 1 tsp cumin
- Salt and pepper to taste
- Fresh herbs (cilantro, basil, or parsley)

**Instructions:**
1. Heat olive oil in a large pan over medium heat
2. Sauté onion and garlic until fragrant
3. Add vegetables and cook for 5-7 minutes
4. Add quinoa, coconut milk, and spices
5. Simmer for 15-20 minutes until tender
6. Season with salt, pepper, and fresh herbs
7. Serve hot and enjoy your plant-based meal!

**Nutrition Benefits:** High in protein, fiber, and essential vitamins. Completely plant-based and cruelty-free! 🌱`;

      setOutput(mockRecipe);

      // Simulate fetching recipe links
      const mockLinks = [
        { id: 1, title: `Spicy Vegan ${input} Bowl` },
        { id: 2, title: `Creamy Coconut ${input} Curry` },
        { id: 3, title: `Mediterranean Vegan ${input}` }
      ];
      
      setRecipeLinks(mockLinks);
    } catch (error) {
      setOutput('Error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
    <div className="w-full max-w-4xl flex flex-col gap-12 items-center">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center items-center gap-3 mb-4 flex-wrap">
          <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800">VeganChef</h1>
        </div>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your complete plant-based cooking companion. Generate recipes, get personalized meal planning advice, and discover the joy of vegan cooking.
        </p>
      </div>

      {/* Main Options */}
      <div className="w-full grid gap-8 sm:gap-10 md:grid-cols-2">
        {/* Recipe Generator Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Recipe Generator</h2>
            </div>
            <p className="text-green-100 text-base leading-relaxed">
              Get instant vegan recipes with ingredient lists and cooking instructions, plus links to more recipe ideas.
            </p>
          </div>
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-end">
            <button
              onClick={() => setCurrentView && setCurrentView('generator')}
              className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 text-lg font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Start Generating Recipes
            </button>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-green-800 text-white py-10 px-6 rounded-2xl w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8">Why Choose VeganChef?</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-green-300" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">100% Plant-Based</h4>
              <p className="text-green-100 text-base leading-relaxed">All recipes are completely vegan and cruelty-free</p>
            </div>
            <div className="flex flex-col items-center">
              <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-green-300" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">AI-Powered</h4>
              <p className="text-green-100 text-base leading-relaxed">Smart recipe generation and personalized advice</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-green-300" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">Health-Focused</h4>
              <p className="text-green-100 text-base leading-relaxed">Nutritious recipes for a healthier lifestyle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const Homepage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 flex-wrap">
          <Leaf className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-800">VeganChef</h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your complete plant-based cooking companion. Generate recipes, get personalized meal planning advice, and discover the joy of vegan cooking.
        </p>
      </div>

      {/* Main Options */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Recipe Generator Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <Search className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Recipe Generator</h2>
              </div>
              <p className="text-green-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Get instant vegan recipes with ingredient lists and cooking instructions, plus links to more recipe ideas.
              </p>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="space-y-3 sm:space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                  <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>AI-generated recipe instructions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>Curated vegan recipe links</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span>Voice input support</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        {/* Voice ChatBot Section */}
        <div className="w-full flex justify-center my-8">
            <VoiceChatBot />
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-green-800 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Why Choose VeganChef?</h3>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center">
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-green-300" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">100% Plant-Based</h4>
              <p className="text-green-100 text-sm sm:text-base leading-relaxed">All recipes are completely vegan and cruelty-free</p>
            </div>
            <div className="flex flex-col items-center">
              <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-green-300" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">AI-Powered</h4>
              <p className="text-green-100 text-sm sm:text-base leading-relaxed">Smart recipe generation and personalized advice</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-green-300" />
              <h4 className="text-lg sm:text-xl font-semibold mb-2">Health-Focused</h4>
              <p className="text-green-100 text-sm sm:text-base leading-relaxed">Nutritious recipes for a healthier lifestyle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
