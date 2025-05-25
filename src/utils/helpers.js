import axios from 'axios';
export const NON_VEGAN_INGREDIENTS = [
  'milk', 'cheese', 'butter', 'yogurt', 'yoghurt', 'cream', 'sour cream',
  'egg', 'eggs', 'honey', 'meat', 'chicken', 'turkey', 'duck',
  'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'crab',
  'lobster', 'gelatin', 'gelatine', 'lard', 'mayonnaise', 'mayo',
  'bacon', 'ham', 'sausage', 'pepperoni', 'anchovies', 'worcestershire',
  'caesar dressing', 'ranch dressing', 'ice cream', 'whey', 'casein'
];

export function findNonVeganIngredients(input) {
  const lower = input.toLowerCase();
  return NON_VEGAN_INGREDIENTS.filter(item => {
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${item}\\b`, 'i');
    return regex.test(lower);
  });
}

export const fetchVeganRecipes = async (query) => {
  try {
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/complexSearch',
      {
        params: {
          query,
          diet: 'vegan',
          number: 3,
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
        },
      }
    );
    return {
      success: true,
      data: response.data.results,
    };
  } catch (error) {
    console.error('Spoonacular API error:', error);

    return {
      success: false,
      data: [],
      error: error.message || 'Something went wrong',
    };
  }
};
export function generatePrompt(input) {
  return `You are a professional vegan chef and recipe creator. Create a delicious, healthy, and creative vegan recipe based on: "${input}".

Please provide:
1. 🍽️ Recipe Name (creative and appetizing)
2. 📝 Brief Description (2-3 sentences about what makes this dish special)
3. ⏱️ Prep Time & Cook Time
4. 👥 Servings
5. 🥕 Ingredients (with quantities, organized clearly)
6. 📋 Instructions (step-by-step, numbered)
7. 💡 Chef's Tips (optional substitutions or serving suggestions)
8. 🌱 Nutritional Highlights (key nutrients or health benefits)

Make sure ALL ingredients are 100% plant-based. If the original input contained non-vegan items, replace them with delicious vegan alternatives and mention the substitutions.

Format your response clearly with emojis and proper spacing for easy reading.`;
}
;