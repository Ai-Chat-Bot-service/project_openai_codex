import { PDFParser } from 'pdfreader';
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

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const filePath = './server/example.pdf'; // Replace with the actual file path of your PDF file
    const parser = new PDFParser();

    // Extract text content from the PDF file
    let pdfText = '';
    parser.on('text', function(text) {
      pdfText += text;
    });
    parser.on('end', async function() {
      const prompt = req.body.prompt;

      // Use the extracted text and user input prompt as the prompt in your OpenAI API request
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${pdfText} ${prompt}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });

      res.status(200).send({
        bot: response.data.choices[0].text
      });
    });
    parser.parseBuffer(fs.readFileSync(filePath));

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
