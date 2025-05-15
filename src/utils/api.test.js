// utils/api.test.js
import axios from 'axios';
import { fetchVeganRecipes } from './helpers';

jest.mock('axios');

describe('fetchVeganRecipes', () => {
  it('returns recipe results from Spoonacular', async () => {
    const mockData = {
      data: {
        results: [
          { id: 1, title: 'Vegan Tacos' },
          { id: 2, title: 'Chickpea Curry' },
        ],
      },
    };

    axios.get.mockResolvedValue(mockData);

    const results = await fetchVeganRecipes('tacos');
    expect(results).toEqual(mockData.data.results);
  });
});
