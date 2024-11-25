import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGroq } from "@langchain/groq";
import express from 'express';
import cors from "cors";
const app = express(); // Create an instance of express
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

const parser = new StringOutputParser();

const model = new ChatGroq({
  model: "mixtral-8x7b-32768",
  apiKey:""
})


app.post('/api/ai', async (req, res) => {
  try {
    const message = req.body.text;
    const messages = [
      new SystemMessage("Here is a paragraph of text. Please identify and summarize the technical and non-technical skills mentioned in the text. Output them as a list of three main points for technical and three for non technical skills to show to recruiter. Return it as Technical Skills: followed by points and then and Non-Technical Skills: followed by points"),
      // new HumanMessage("John has expertise in Python, machine learning, and project management. He is also skilled in communication and teamwork."),
      new HumanMessage(message),
    ];
    let result;
    let string;
    if(message.length!=0)
    {
      // result = await model.invoke(messages);
      // string = await parser.invoke(result); 
      string=`
      Technical Skills:

      1. Proficiency in programming languages such as Javascript, Typescript, Solidity, Java, HTML.
      
      Non-Technical Skills:

      1. Strong leadership and teamwork skills, as demonstrated by taking lead in ideation and development of projects and working as part of a team to improve overall engineer experience.`
      // string = "Technical Skills: Java, Javascript Node Non-Technical Skills Communication Teamwork Collaboration "
    }

    //Now that we have generated the string we store it 
    console.log(string);
    // if(string==undefined) res.status(200).json({message:""});
    res.status(200).json({ message: string }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});


app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
