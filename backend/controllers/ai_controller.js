const { OpenAI } = require("openai");
require("dotenv").config();

// Initialize OpenAI API client
const openai = new OpenAI({apiKey: ""});

async function extractSkillsFromText(inputText) {
  try {
    const prompt = `
      Here is a paragraph of text:
      ---
      ${inputText}
      ---
      Please identify and summarize the technical and non-technical skills mentioned in the text. Output them as a list.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello" },
      ],
    });

    const result = response.data.choices[0]?.message?.content;
    console.log("Extracted Skills:", result);
    return result;
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    throw error;
  }
}

// Example usage
const sampleText = "John has expertise in Python, machine learning, and project management. He is also skilled in communication and teamwork.";
extractSkillsFromText(sampleText);
