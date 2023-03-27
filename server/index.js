const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3100;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");

// dotenv.config({path: path.resolve(__dirname, '../.env')});
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const api_key = process.env.APIKEY;

const generateID = () => Math.random().toString(36).substring(2, 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
});

const openai = new OpenAIApi(configuration);

const database = [];

const ChatGPTFunction = async (text) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.6,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  return response.data.choices[0].text;
};

const GPTFunction = async (text) => {
  const header = new Headers();
  header.append("content-Type", "application/json");
  header.append("Authorization", "Bearer " + api_key);

  const body = {
    model: "text-davinci-003",
    prompt: text,
    temperature: 0.6,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  };

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: header,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.choices[0].text;
    })
    .catch((error) => {
      console.error("error", error);
      return error;
    });

  // return response.data.choices[0].text;
};

app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
  const {
    fullName,
    currentPosition,
    currentLength,
    currentTechnologies,
    workHistory,
  } = req.body;

  const workArray = JSON.parse(workHistory);

  const newEntry = {
    id: generateID(),
    fullName,
    image_url: `http://localhost:3100/uploads/${req.file.filename}`,
    currentPosition,
    currentLength,
    currentTechnologies,
    workHistory: workArray,
  };

  const remainderText = () => {
    let stringText = "";
    for (let i = 0; i < workArray.length; i++) {
      stringText += ` ${workArray}`;
    }
    return stringText;
  };

  const prompt1 = `I am writing a resume, My details are \n 
                    name: ${fullName} \n
                    role: ${currentPosition} (${currentLength} years). \n
                    I write in the technoloegies: ${currentTechnologies}. can you write a 100 words description for the top of the resume(first person Writing)?`;
  const prompt2 = `I am writing a resume, My details are \n 
                    name: ${fullName} \n
                    role: ${currentPosition} (${currentLength} years). \n
                    I write in the technoloegies: ${currentTechnologies}. can you write 10 points for a resume on what I am good at?`;

  const prompt3 = `I am writing a resume, My details are \n 
                    name: ${fullName} \n
                    role: ${currentPosition} (${currentLength} years). \n
                    During my years I worked at ${
                      workArray.length
                    } companies. ${remainderText()} \n
                    Can you write me 50 words for each company seprated in numbers of my succession in the company (in first person)?`;

  const objective = await ChatGPTFunction(prompt1);
  const keypoints = await ChatGPTFunction(prompt2);
  const jobResponsibilities = await ChatGPTFunction(prompt3);

  // const [objective, keypoints, jobResponsibilities] = await Promise.allSettled([GPTFunction(prompt1), GPTFunction(prompt2), GPTFunction(prompt3)]);
  const ChatGPtData = { objective, keypoints, jobResponsibilities };

  const data = { ...newEntry, ...ChatGPtData };
  database.push(data);
  res.json({
    message: "Request successful!",
    data,
  });
});

app.post("/test", async (req, res) => {
  const body = {
    model: "text-davinci-003",
    prompt:
      "Hello, my name is John and I am a software developer. I am looking to build a new application to help with project management.",
    temperature: 0.7,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const header = new Headers();
  header.append("content-Type", "application/json");
  header.append("Authorization", "Bearer " + api_key);

  const testreply = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: header,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      res.json({
        message: "request successful",
        data,
      });
    })
    .catch((error) => {
      console.error("error", error);
    });
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
