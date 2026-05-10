require("dotenv").config();
const axios = require("axios");

async function testOpenRouter() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: "Test" }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("SUCCESS:", response.data);
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
  }
}

testOpenRouter();
