const { exec } = require('child_process');
const fetch = require("node-fetch");
require('dotenv').config();

const HF_API_URL = "https://api-inference.huggingface.co/models/elpeeee/results";
const HF_API_KEY = process.env.HF_API_KEY; 


// const processText = (inputText) => {
    
//     return new Promise((resolve, reject) => {
//         exec(`python spacy_processor.py "${inputText}"`, (err, stdout, stderr) => {
//             if (err) {
//                 console.error("Error executing Python script:", stderr);
//                 reject(`Error executing Python script: ${stderr}`);
//             } else {
//                 try {
//                     console.log("Python Script Output:", stdout);
//                     const result = JSON.parse(stdout);
//                     resolve(result.asl_gloss);
//                 } catch (e) {
//                     console.error("Error parsing Python script output:", e.message);
//                     reject("Error parsing Python script output: " + e.message);
//                 }
//             }
//         });
//     });
// };


async function fetchWithRetry(url, body, options, retries = 3) {
    try {
        console.log("Sending request to Hugging Face:", body);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
                ...options.headers
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Neha  Shah")
        console.log("Hugging Face Model Response:", data);
        return data;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... Attempts left: ${retries}`);
            return fetchWithRetry(url, body, options, retries - 1);
        } else {
            console.error("Hugging Face API Error:", error.message);
            throw new Error("Error processing text with Hugging Face");
        }
    }
}


exports.processTextForASLGloss = async (inputText) => {
    try {
     
        const processedText = await processText(inputText);
        console.log("Processed Text for ASL Gloss:", processedText);

       
        const result = await fetchWithRetry(
            HF_API_URL,
            { inputs: inputText },  // Sending the input text to the Hugging Face model
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        console.log("Final ASL Gloss Output:", result);
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
