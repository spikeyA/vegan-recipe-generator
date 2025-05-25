import React from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GiThreeLeaves } from "react-icons/gi";

export default function VeganRecipeHomepage() {
  const navigate = useNavigate();
  return (
    <div className="vegan-gradient-bg" style={{ 
      minHeight: "100vh", 
      padding: "2rem 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start"
    }}>
      {/* Header at the very top center */}
      <motion.h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#166534",
          margin: "0 0 4rem 0",
          textAlign: "center",
          textShadow: "0 2px 8px #bbf7d0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.7rem",
          width: "100%",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GiThreeLeaves style={{ color: "#22c55e", fontSize: "2.2rem" }} />
        Welcome to Vegan Delight
      </motion.h1>

      {/* Main content below header, centered horizontally */}
      <div style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "3rem",
        padding: "0 1.5rem"
      }}>
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr",
            gap: "0rem",
            width: "100%"
          }}
          initial={{ opacity: 0, x: 20, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
           <Card title="Generate Recipe">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span></span>
              <Button onClick={() => navigate("/recipegenerator")}>Start</Button>
            </div>
          </Card>

          <Card title="Vegan Chat">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span></span>
              <Button onClick={() => navigate("/veganchatbot")}>Chat Now</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}