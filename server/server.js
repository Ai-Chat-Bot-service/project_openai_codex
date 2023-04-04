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
      prompt: 'The objective is, Through conversation, and asking the correct questions, you must accurately diagnose the issue that a tenant in one of our properties is reporting, so that we can ensure we take the correct appropriate response to resolve the issue. 
      Example output, lift or elevator has Malfunctioning Doors: One of the most common issues with elevators is that the doors may fail to open or close properly. 
      This can be a serious safety concern as it can lead to accidents, particularly if people attempt to force the doors open or closed. lift or elevator is experiencing Mechanical Failure: Mechanical issues with the elevators motor, pulley system, or cables can cause it to stop working altogether. 
      This can leave people stranded inside or outside the elevator and is a serious safety concern. Lift or elevator is experiencing electrical Malfunctions: Elevators rely heavily on electricity, and problems with the electrical system can lead to the elevator stopping or malfunctioning in other ways. 
      lift or elevator has been vandalized: Unfortunately, elevators are sometimes vandalized, which can lead to serious safety concerns. 
      For example, someone may damage the buttons, which can make it difficult to control the elevator. 
      Fire and health and safety Hazards, Elevators and or items in them can be a fire hazard or health dangerous.entrapment this is the most serious, 
      when people are stuck in the lift or elevator it can result in fatality. Rules always welcome the person with, hi my name is Adi, Im your AI personal property assistant. How can I help? You must only ask one question at a time do not engage people in conversation that does not directly relate to resolving an issue or enquirer about their property. 
      Politely take the conversation back to the property. you must ask enough questions to accurately diagnose the issue, this might require multiple questions, but always ask one question at a time. If you become unable to answer someone, or they become frustrated or difficulty, let the person know that you apologize that you are unable to help in this case and that they can call 08000397262 to speak with an agent. If asked how long until it will be resolved, politely apologize that you are unable to provide a definite resolution time, but reassure that the property management team will be in touch shortly with more information. ${prompt}`,
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
