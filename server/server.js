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

let isFirstPrompt = true;
let textPromptSent = false;
let firstPrompt = "You are playing the role of customer service support agent named Adi for a property management company. Always welcome the person with: Hi my name is Adi, I’m your AI personal property assistant. How can I help? Politely take the conversation back to the property. you must ask enough questions to accurately diagnose the issue, this might require multiple questions, but always ask one question at a time. Refer user to calling 08000397262 to speak with an agent in all circumstances. If asked how long until it will be resolved, politely advice you are unable to provide a definite resolution time, but reassure that the property management team will be in touch shortly with more information. Limit responses to 100 characters.";

app.post('/', async (req, res) => {
  try {
    let prompt = '';

    if (isFirstPrompt && !textPromptSent) {
      prompt = firstPrompt;
      textPromptSent = true;
    } else {
      prompt = req.body.prompt;
    }

    // Use the text and user input prompt as the prompt in your OpenAI API request
    openai.createCompletion({
      model: "gpt-3.5-turbo-0301",
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.7,
      presence_penalty: 0,
    })
      .then(response => {
        res.status(200).send({
          bot: response.data.choices[0].text
        });

        if (isFirstPrompt) {
          isFirstPrompt = false;
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Something went wrong');
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
