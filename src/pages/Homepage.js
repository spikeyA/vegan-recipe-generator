import React, { useState } from 'react';
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
      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
    >
      🎤 Use Voice
    </button>
  );
};

const RecipeGenerator = ({ onBack }) => {
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
          <Search className="w-8 h-8" />
          Recipe Generator
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <textarea
          placeholder="Enter ingredients or a dish idea (e.g., 'pasta with mushrooms', 'chocolate cake', 'stir fry')..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-4 border-2 border-green-200 rounded-lg resize-none focus:border-green-400 focus:outline-none text-lg"
        />
        
        <div className="flex gap-3 mt-4">
          <button 
            onClick={generateRecipe} 
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-lg font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Working...
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5" />
                Generate Recipe
              </>
            )}
          </button>
          <VoiceInput setInput={setInput} setOutput={setOutput} />
        </div>

        {warning && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
            {warning}
          </div>
        )}

        {output && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {output}
            </pre>
          </div>
        )}

        {recipeLinks.length > 0 && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
              🔗 More Vegan Recipe Ideas
            </h3>
            <ul className="space-y-2">
              {recipeLinks.map((recipe) => (
                <li key={recipe.id}>
                  <a
                    href={`https://spoonacular.com/recipes/${recipe.title
                      .toLowerCase()
                      .replace(/ /g, '-')}-${recipe.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 hover:underline text-lg"
                  >
                    {recipe.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const AIChat = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your vegan cooking assistant! 🌱 I can help you with meal planning, recipe modifications, nutritional advice, and cooking tips. What would you like to know about vegan cooking today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! For meal planning, I recommend starting with 3-4 base proteins like lentils, chickpeas, tofu, and tempeh. You can create various dishes throughout the week using these foundations.",
        "Absolutely! I can help you veganize that recipe. Usually we can substitute dairy milk with plant milk, eggs with flax eggs or aquafaba, and cheese with nutritional yeast or cashew cream.",
        "For balanced nutrition on a vegan diet, focus on getting enough protein from legumes, nuts, and seeds. Make sure to include B12 supplements and consider iron-rich foods like spinach and lentils.",
        "Here's a simple weekly meal prep idea: Cook a big batch of quinoa, roast mixed vegetables, prepare some legumes, and you can mix and match throughout the week with different sauces and seasonings!",
        "Plant-based cooking is so versatile! What specific aspect interests you most - protein sources, flavor combinations, or cooking techniques?"
      ];
      
      const botResponse = {
        id: Date.now(),
        type: 'bot',
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          AI Vegan Cooking Assistant
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Thinking...</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about meal planning, recipes, nutrition, cooking tips..."
              className="flex-1 p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const [currentView, setCurrentView] = useState('home');

  if (currentView === 'generator') {
    return <RecipeGenerator onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'chat') {
    return <AIChat onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="text-center py-12 px-6">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Leaf className="w-12 h-12 text-green-600" />
          <h1 className="text-5xl font-bold text-green-800">VeganChef</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your complete plant-based cooking companion. Generate recipes, get personalized meal planning advice, and discover the joy of vegan cooking.
        </p>
      </div>

      {/* Main Options */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recipe Generator Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8">
              <div className="flex items-center gap-4 mb-4">
                <Search className="w-12 h-12 text-white" />
                <h2 className="text-3xl font-bold text-white">Recipe Generator</h2>
              </div>
              <p className="text-green-100 text-lg">
                Get instant vegan recipes with ingredient lists and cooking instructions, plus links to more recipe ideas.
              </p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <ChefHat className="w-5 h-5 text-green-500" />
                  <span>AI-generated recipe instructions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 text-green-500" />
                  <span>Curated vegan recipe links</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span>Voice input support</span>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentView('generator')}
                className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-lg font-medium flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Start Generating Recipes
              </button>
            </div>
          </div>

          {/* AI Chat Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle className="w-12 h-12 text-white" />
                <h2 className="text-3xl font-bold text-white">AI Cooking Assistant</h2>
              </div>
              <p className="text-blue-100 text-lg">
                Chat with our AI for personalized meal planning, recipe modifications, and nutritional guidance.
              </p>
            </div>
            
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <span>Personalized meal planning</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Heart className="w-5 h-5 text-purple-500" />
                  <span>Recipe modification help</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Leaf className="w-5 h-5 text-purple-500" />
                  <span>Nutritional guidance</span>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentView('chat')}
                className="w-full py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-lg font-medium flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-green-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8">Why Choose VeganChef?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Leaf className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h4 className="text-xl font-semibold mb-2">100% Plant-Based</h4>
              <p className="text-green-100">All recipes are completely vegan and cruelty-free</p>
            </div>
            <div>
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h4 className="text-xl font-semibold mb-2">AI-Powered</h4>
              <p className="text-green-100">Smart recipe generation and personalized advice</p>
            </div>
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h4 className="text-xl font-semibold mb-2">Health-Focused</h4>
              <p className="text-green-100">Nutritious recipes for a healthier lifestyle</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;