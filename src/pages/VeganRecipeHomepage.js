import React from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 

export default function VeganRecipeHomepage() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300"
      style={{
        backgroundImage: 'url("/images/vegan-pattern.png")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="w-full max-w-2xl flex flex-col items-center gap-12 p-6">
        <motion.h1
          className="text-5xl font-extrabold text-green-900 mb-4 text-center drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Vegan Delight
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full"
          initial={{ opacity: 0,x:20, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card title="Generate Recipe">
            <div className="flex flex-col items-center">
             <Button onClick={()=> navigate("/recipegenerator")}>Start</Button>
            </div>
          </Card>

          <Card title="Vegan Chat">
            <div className="flex flex-col items-center">
              <Button onClick={() => navigate("/veganchatbot")}>Chat Now</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}