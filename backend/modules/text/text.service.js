const { exec } = require('child_process');
const axios = require('axios');
require('dotenv').config();

const HF_API_URL = "https://api-inference.huggingface.co/models/google-t5/t5-small";
const HF_API_KEY = process.env.HF_API_KEY;

const processText = (inputText) => {
    return new Promise((resolve, reject) => {
        exec(`python spacy_processor.py "${inputText}"`, (err, stdout, stderr) => {
            if (err) {
                console.error("Error executing Python script:", stderr);
                console.log("Neha shah")
                reject(`Error executing Python script: ${stderr}`);
            } else {
                try {
                    console.log("Python Script Output:", stdout); 
                    const result = JSON.parse(stdout);  
                    resolve(result.asl_gloss);  
                } catch (e) {
                    console.error("Error parsing Python script output:", e.message);
                    reject("Error parsing Python script output: " + e.message);
                }
            }
        });
    });
};

async function fetchWithRetry(url, data, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log("Sending request to Hugging Face:", data);
            const response = await axios.post(url, data, options);
            console.log("Hugging Face Model Response:", response.data);
           
            return response.data;
        } catch (error) {
            if (i === retries - 1 || !error.response || error.response.status !== 503) {
                console.error("Hugging Face Error:", error.message);  
                if (error.response) {
                    console.error("Error Response Data:", error.response.data);
                    console.error("Status Code:", error.response.status);
                }
                throw error;
            }
            console.warn(`Retrying... Attempt ${i + 1}`);
        }
    }
}

exports.processTextForASLGloss = async (inputText) => {
    try {
        const processedText = await processText(inputText);
        console.log("Processed Text for ASL Gloss:", processedText);  

        const result = await fetchWithRetry(
            HF_API_URL,
            { inputs: `Provide the ASL gloss in English only: ${processedText}` }, // Updated prompt
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        console.log("Processed Text to ASL Gloss:", processedText);  
        console.log("Hugging Face Model Final Response:", result);  

        return result;
    } catch (error) {
        console.error("Error processing text with Hugging Face:", error.message);
        throw new Error("Error processing text with Hugging Face");
    }
};

if (require.main === module) {
    const inputText = "How are you dancing";  
    exports.processTextForASLGloss(inputText)
        .then(result => console.log("Final ASL Gloss Output:", result))
        .catch(err => console.error("Error:", err));
}
















