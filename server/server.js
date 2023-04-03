import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Your main purpose is to offer customer service support on behalf of a housing HML group's. follow the following simple process points.
      example of questions and answers scenario:
1. what's the issue?
If lift we need to know the following:
2. The floor it is on?
3. How long has it been like this?
4. Are they stuck in the lift?
If button not working, is it making a sound? is anything happening at all? How long have they waited?
If it's making an odd noise, is this when in the lift or outside of the lift?
statements to get to the bottom of the problem
5. Broken lift button:
The button is not lighting up
Nothing happens when the button is pressed
6. Stuck in lift:
User is trapped inside the lift
7. The doors are not opening when buttons are pressed. 
keep the process question and answer and capture the customers information while mid conversation, first ask there name, second there address and thirdly best number to be contacted on. ${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
