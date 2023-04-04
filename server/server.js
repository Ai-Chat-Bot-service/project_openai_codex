import pdfreader from 'pdfreader';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

let pdfText = '';
const filePath = `${process.cwd()}/example.pdf`;

// Extract text content from the PDF file
new pdfreader.PdfReader().parseFileItems(filePath, function (err, item) {
  if (err) {
    console.error(err);
    return;
  }
  else if (!item) {
    app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
  }
  else if (item.text) {
    pdfText += item.text;
  }
});

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Use the extracted text and user input prompt as the prompt in your OpenAI API request
    openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${pdfText} ${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })
      .then(response => {
        res.status(200).send({
          bot: response.data.choices[0].text
        });
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
