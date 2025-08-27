const { GoogleGenAI } = require("@google/genai") ;
const dotenv =require("dotenv");
dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateAiReview = async (problem,code,verdict,message) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a code review expert. 
                You are given a code ,verdict,problem and compiler message you have to review it and give any optimization if possible at the end and give short review on the code.
                if the verdict is rejected then tell the issiue why then problem is not getting accepted
                The problem is : ${problem}
                The code is : ${code}
                The verdict is : ${verdict}
                The message is : ${message}
                `,
    });
    return (response.text);

};

module.exports = {
    generateAiReview,
};