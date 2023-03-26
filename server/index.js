const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3100;
const multer = require("multer");
const path = require("path");
const { configuration, OpenAIApi } = require("openai");


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const congiguration = new Configuration({
    apikey: process.env.APIKEY,
})

const openai = new OpenAIApi(configuration);

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

    return response.date.choices[0].text;
}

const upload = multer({
    storage: storage,
    limits:{ fileSize: 1024 * 1024 * 5},
})

app.get("/", (req, res) => {
    res.json(
        {message: "Hello World",}
    );
});

app.post("/resume/create", upload.single("headshotImage"), async(req, res) => {
    const{
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
        image_rul : `http://localhost:3100/uploads/${req.file.filename}`,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory: workArray,
    };
    
    const remainderText = () => {
        let stringText = "";
        for (let i = 0; i < workArray.length; i++) {
            stringText += ` ${workArray}`
        }
        return stringText;
    }
    
    const prompt1 = `I am writing a resume, My details are \n 
                    name: ${fullName} \n
                    role: ${currentPosition} (${currentLength} years). \n
                    I write in the technoloegies: ${currentTechnologies}. can you write a 100 words description for the top of the resume(first person Writing)?`;
    const prompt2 = 
    console.log(req.body);
    res.json({
        message: "Request successful!",
        data:{},
    });
});


app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});