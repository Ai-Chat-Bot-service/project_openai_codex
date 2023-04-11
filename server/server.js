import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [];

app.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Construct the prompt based on the conversation history and user input
    let prompt = conversationHistory.reduce((acc, cur) => `${acc}${cur}`, '');
    prompt += message;

    // Use the prompt and conversation history as inputs to the OpenAI API
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['\n']
    });

    // Extract the bot's response and add it to the conversation history
    const botResponse = response.data.choices[0].text.trim();
    conversationHistory.push(`${message}\n${botResponse}\n`);

    // Send the bot's response back to the client
    res.status(200).json({ message: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.listen(5000, () => console.log('AI chat server started on http://localhost:5000'));
