const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3100;
const multer = require("multer");
const path = require("path");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const key = process.env.APIKEY;

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
   apikey: process.env.APIKEY,
    //apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const database = [];

const GPTFunction = async (text) => {
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


app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

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

  const objective = await GPTFunction(prompt1);
  const keypoints = await GPTFunction(prompt2);
  const jobResponsibilities = await GPTFunction(prompt3);
  const ChatGPtData = { objective, keypoints, jobResponsibilities };
  console.log(ChatGPtData);

  const data = { ...newEntry, ...ChatGPtData };
  database.push(data);
  res.json({
    message: "Request successful!",
    data,
  });
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT} ${key}`);
});
