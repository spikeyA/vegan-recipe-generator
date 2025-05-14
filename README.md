# 🌿 Vegan Recipe Generator

A simple React app that uses the OpenAI API to generate plant-based (vegan) recipes based on user-provided ingredients or dish ideas.

---

## 🚀 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 🔧 Prerequisites

- Node.js (v14 or higher)
- Yarn (v1.22+ recommended)
- An OpenAI API Key from https://platform.openai.com/account/api-keys

---

## 🔐 Setup OpenAI API Key

Create a `.env` file in the root of your project and add the following:

```env
REACT_APP_OPENAI_API_KEY=your_openai_key_here

## Installation

## Clone the repo and install dependencies:
git clone https://github.com/your-username/vegan-recipe-generator.git
cd vegan-recipe-generator
- yarn install

##🧪 Run Locally

## Start the development server:

- yarn start
## This will launch the app at http://localhost:3000.

## Available Scripts

## In the project directory, you can run:

- yarn start — Runs the app in development mode.
- yarn build — Builds the app for production.
- yarn test — Runs the test suite.
- -yarn eject — Ejects configuration (not reversible).

## Vegan Ingredient Filter

## If non-vegan ingredients like "milk", "cheese", or "chicken" are entered:

## The app will display a warning
## The request to the API will exclude those ingredients
## A note will be included in the recipe
Example input: broccoli, butter, tofu

## 🧠 How It Works

Takes your ingredients or idea
Sends a prompt to OpenAI's GPT model
Returns a vegan recipe with a:
Dish name
Description
Ingredients list
Instructions
## 📚 Learn More

Create React App Documentation
React Documentation
OpenAI API Documentation
