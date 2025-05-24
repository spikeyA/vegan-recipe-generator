import React from 'react';
import RecipeLinks from '../components/RecipeLinks'; // Update path if needed
import RecipeOutput from '../components/RecipeOutput'; // Update path if needed
import VoiceInput from '../components/VoiceInput'; // Update path if needed

function RecipeGenerator() {
  return (
    <div>
      <RecipeApp />
      <RecipeLinks />
      <RecipeOutput />
      <VoiceInput />
    </div>
  );
}

export default RecipeGenerator;
