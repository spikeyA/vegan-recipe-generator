import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VeganRecipeHomepage from './pages/VeganRecipeHomepage';
import VeganChatbotPage from 'pages/VeganChatbotPage';
import RecipeGeneratorPage from './pages/RecipeGeneratorPage'; // Assuming you have this page
function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<VeganRecipeHomepage />} />
        <Route path="/recipegenerator" element={<RecipeGeneratorPage />} />
        <Route path="/veganchatbot" element={<VeganChatbotPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
