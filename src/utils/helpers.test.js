// utils/helpers.test.js
import { findNonVeganIngredients } from './helpers';

describe('findNonVeganIngredients', () => {
  it('detects non-vegan ingredients', () => {
    const input = 'I want to cook with milk, eggs, and spinach';
    const result = findNonVeganIngredients(input);
    expect(result).toEqual(expect.arrayContaining(['milk', 'eggs']));
  });

  it('returns an empty array when no non-vegan items are present', () => {
    const input = 'I want to use tofu and broccoli';
    const result = findNonVeganIngredients(input);
    expect(result).toEqual([]);
  });
});
