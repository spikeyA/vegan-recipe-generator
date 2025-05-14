import axios from 'axios';

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


export const NON_VEGAN_INGREDIENTS = [
  'milk', 'cheese', 'butter', 'yogurt', 'cream',
  'egg', 'eggs', 'honey', 'meat', 'chicken',
  'beef', 'pork', 'fish', 'shrimp', 'gelatin',
  'lard', 'mayonnaise',
];

export function findNonVeganIngredients(input) {
  const lower = input.toLowerCase();
  return NON_VEGAN_INGREDIENTS.filter(item => lower.includes(item));
}

export function generatePrompt(input) {
  return `You are a helpful vegan recipe assistant. Always create plant-based recipes only. 
If any non-vegan ingredients are mentioned, ignore them and explain at the end.

Create a recipe using the following: "${input}".

Respond with dish name, short description, ingredients, and steps.`;
}
