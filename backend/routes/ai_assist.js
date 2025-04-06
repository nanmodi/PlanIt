import express from 'express';
import chatWithGemini from '../chat.js';
const ai_router=express.Router();

ai_router.post('/chat',async (req,res)=>{
  try {
    const { prompt } = req.body;
    console.log(prompt);
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await chatWithGemini(prompt);
    console.log('**************************************************************************************************');
    console.log(response);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default ai_router;