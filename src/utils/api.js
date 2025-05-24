import axios from 'axios';

export const callOpenAI = async (prompt) => {
  try {
    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
      }
    );
    return res.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate recipe. Please check your API key.');
  }
};

export const fetchVeganRecipes = async (input) => {
  try {
    const res = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: input,
        diet: 'vegan',
        number: 5,
        addRecipeInformation: true,
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
      },
    });
    return res.data.results || [];
  } catch (err) {
    console.error('Spoonacular API error:', err);
    return [];
  }
}
;