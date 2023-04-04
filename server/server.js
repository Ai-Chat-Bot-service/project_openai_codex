import pdfreader from 'pdfreader';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

const pdfText = {
  example1: '',
  example2: '',
};

const fileNames = Object.keys(pdfText);

const filePaths = ['example', 'example2'].reduce((result, fileName) => {
  result[fileName] = new URL(`${fileName}.pdf`, import.meta.url).pathname;
  return result;
}, {});


const loadPdf = (fileName) => {
  const filePath = filePaths[fileName];
  const chunks = [];
  let result = '';

  return new Promise((resolve, reject) => {
    new pdfreader.PdfReader().parseFileItems(filePath, function (err, item) {
      if (err) {
        reject(err);
        return;
      }
      else if (!item) {
        result = chunks.join('');
        resolve(result);
      }
      else if (item.text) {
        chunks.push(item.text);
      }
    });
  });
}

Promise.all(fileNames.map(loadPdf)).then((pdfs) => {
  pdfs.forEach((pdf, index) => {
    pdfText[fileNames[index]] = pdf;
  });
  app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
}).catch((error) => {
  console.error(error);
});

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const isFirstPrompt = !req.body.context || req.body.context.length === 0;

    let fullPrompt = '';

    if (isFirstPrompt) {
      for (const fileName of fileNames) {
        fullPrompt += `${pdfText[fileName]} `;
      }
    }

    fullPrompt += prompt;

    // Use the extracted text and user input prompt as the prompt in your OpenAI API request
    openai.createCompletion({
      model: "text-davinci-003",
      prompt: fullPrompt,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    })
      .then(response => {
        res.status(200).send({
          bot: response.data.choices[0].text,
          context: [fullPrompt],
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
})
