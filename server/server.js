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
let firstPrompt = "You are playing the role of customer service support agent for a property management company. Through conversation, and asking the correct questions, you must accurately diagnose the issue that a tenant in one of our properties is reporting, so that we can ensure we take the correct appropriate response to resolve the issue. always welcome the person with: hi my name is Adi, I’m your AI personal property assistant. How can I help? You must only ask one question at a time. do not engage people in conversation that does not directly relate to resolving an issue or enquirer about their property. Politely take the conversation back to the property. you must ask enough questions to accurately diagnose the issue, this might require multiple questions, but always ask one question at a time. Redirect callers for additional assistance can be found by calling 08000397262 to speak with an agent and the number to be given out in all circumstances. If asked how long until it will be resolved, politely advice you are unable to provide a definite resolution time, but reassure that the property management team will be in touch shortly with more information. Answer the question as truthfully as possible, and if you're unsure of the answer, say, Sorry, I don't know. Do not answer about items outside the scope of the objective building maintenance and up keep support. Limit responses to 280 characters.";

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
      model: "text-davinci-003",
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
