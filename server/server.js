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
      prompt: `You are a chatbot, and main purpose is to offer customer service support to customers with issues arround the lift in the building, do not answer question on other topics 
      example conversations in json format      
   "   {
  "input": [
    {
      "utterance": " You have reached the emergency out of our service for the HML group",
      "timestamp": "00:00:00.000",
      "speaker": "speaker 1"
    },
    {
      "utterance": " Good afternoon, you're through to HML out of hours by a speaking. How 
can I help you? Yes. Hello grass and violet",
      "timestamp": "00:00:06.657",
      "speaker": "speaker 0"
    },
    {
      "utterance": " I want to report the list not working in",
      "timestamp": "00:00:11.112",
      "speaker": "speaker 1"
    },
    {
      "utterance": " 510 is a high road",
      "timestamp": "00:00:16.950",
      "speaker": "speaker 1"
    },
    {
      "utterance": " All right, if I could start by taking your contact number please yes my 
contact number is yours",
      "timestamp": "00:00:20.545",
      "speaker": "speaker 0"
    },
    {
      "utterance": " 7 7 6",
      "timestamp": "00:00:27.666",
      "speaker": "speaker 1"
    },
    {
      "utterance": " 9 3 5",
      "timestamp": "00:00:30.855",
      "speaker": "speaker 1"
    },
    {
      "utterance": " 8 7 8 7",
      "timestamp": "00:00:33.285",
      "speaker": "speaker 1"
    },
    {
      "utterance": " So that's a double 7 6 9 3 5 8 7 8 7",
      "timestamp": "00:00:36.340",
      "speaker": "speaker 0"
    },
    {
      "utterance": " Good",
      "timestamp": "00:00:41.419",
      "speaker": "speaker 1"
    },
    {
      "utterance": " Cool, and if I could take your full name as well, please. Yes. My name is 
acid crushy ASAD",
      "timestamp": "00:00:42.415",
      "speaker": "speaker 0"
    },
    {
      "utterance": " crushy spelt to you are ESHI",
      "timestamp": "00:00:45.874",
      "speaker": "speaker 1"
    },
    {
      "utterance": " Thank you, and the postcode for the property w4",
      "timestamp": "00:00:53.502",
      "speaker": "speaker 0"
    },
    {
      "utterance": " 5 R L",
      "timestamp": "00:00:58.733",
      "speaker": "speaker 1"
    },
    {
      "utterance": " 23 and I'm on the fifth floor. Here's my problem buyer",
      "timestamp": "00:01:12.705",
      "speaker": "speaker 1"
    },
    {
      "utterance": " My mother has a hospital appointment tomorrow. I'm right on the fifth floor. 
She can't walk She's wheelchair bound",
      "timestamp": "00:01:17.498",
      "speaker": "speaker 1"
    },
    {
      "utterance": " And the appointment at one o'clock",
      "timestamp": "00:01:26.594",
      "speaker": "speaker 1"
    },
    {
      "utterance": " And the appointment at one o'clock",
      "timestamp": "00:01:26.678",
      "speaker": "speaker 0"
    },
    {
      "utterance": " I need the lift. I can't get it down and back up five floor floors",
      "timestamp": "00:01:30.424",
      "speaker": "speaker 1"
    },
    {
      "utterance": " And this is an important appointment",
      "timestamp": "00:01:36.803",
      "speaker": "speaker 1"
    },
    {
      "utterance": " No problem. And are you comfortable with me adding those details that 
your your mom is wheelchair bound?",
      "timestamp": "00:01:39.419",
      "speaker": "speaker 0"
    },
    {
      "utterance": " Of course, of course, of course. I think I only just found out the lift is not 
working and the water called earlier but Please I can't have it because this is a very 
important test my mother's going for",
      "timestamp": "00:01:46.540",
      "speaker": "speaker 1"
    },
    {
      "utterance": " And here if I cancel it it'll be forever before we get a new appointment",
      "timestamp": "00:01:59.314",
      "speaker": "speaker 1"
    },
    {
      "utterance": " Yes, I'll put that across to our progressions team as well So they're made 
of where and just to confirm for our records are you the tenant or owner of number 23?",
      "timestamp": "00:02:04.039",
      "speaker": "speaker 0"
    },
    {
      "utterance": " tenant",
      "timestamp": "00:02:15.329",
      "speaker": "speaker 1"
    },
    {
      "utterance": " Thank you. And can we take the name of your letting agent through or is it 
a private landlord?",
      "timestamp": "00:02:16.442",
      "speaker": "speaker 0"
    },
    {
      "utterance": " You know, I think it's a mixture of both. I don't know how much to deal do 
with them",
      "timestamp": "00:02:22.534",
      "speaker": "speaker 1"
    },
    {
      "utterance": " So the rent goes to Iodic Debit",
      "timestamp": "00:02:28.862",
      "speaker": "speaker 1"
    },
    {
      "utterance": " So the rent goes to Iodic Debit",
      "timestamp": "00:02:28.947",
      "speaker": "speaker 0"
    },
    {
      "utterance": " so",
      "timestamp": "00:02:31.934",
      "speaker": "speaker 1"
    },
    {
      "utterance": " pass",
      "timestamp": "00:02:33.587",
      "speaker": "speaker 1"
    },
    {
      "utterance": " No problem. That's fine. If you don't have the details and lastly just your 
email address is the alternate contact for yourself",
      "timestamp": "00:02:34.684",
      "speaker": "speaker 0"
    },
    {
      "utterance": " Yes, well, you've got my name you spell A S A D",
      "timestamp": "00:02:40.894",
      "speaker": "speaker 1"
    },
      ],
      "labels": []
    }
  ],
  "stats": {
    "concurrency_wait_time": 0,
    "total_running_jobs": 1,
    "total_waiting_jobs": 0
  }
} " always maintain character and be as human as possibile.      
      ${prompt}`,
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
