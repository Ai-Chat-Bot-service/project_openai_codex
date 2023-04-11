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

app.post('/', async (req, res) => {
  try {
    let prompt = '';

    if (isFirstPrompt && !textPromptSent) {
      prompt = req.body.text;
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
