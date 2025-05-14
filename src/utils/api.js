import axios from 'axios';

export const callOpenAI = async (prompt) => {
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
    }
  );
  return res.data.choices[0].message.content;
};

export const fetchVeganRecipes = async (input) => {
  try {
    const res = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: input,
        diet: 'vegan',
        number: 3,
        apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
      },
    });
    return res.data.results;
  } catch (err) {
    console.error('Spoonacular API error:', err);
    return [];
  }
};
