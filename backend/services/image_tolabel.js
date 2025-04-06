import vision from "@google-cloud/vision";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
console.log(process.env.API_KEY);
const genAI = new GoogleGenerativeAI('AIzaSyCtCFeGtW8uD-N7qyhI1x8VjdEfikV8D44');
async function getLabels(image) {
  

  const client = new vision.ImageAnnotatorClient({keyFilename: 'planit-454217-e04d859197e6.json'});

 
  const [result] = await client.labelDetection(image);
  const labels = result.labelAnnotations;
  console.log(typeof(labels));
const response=[]
  labels.forEach(label => response.push(label.description));
  return response;
}

async function getDestinations(labels)
{

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



  const prompt = `Based on these image labels: ${labels.join(", ")}, suggest 5 beautiful travel destinations that match this theme also can interpret if its a monument or temple, including a short description, weather conditions and location in terms of city,state and country.Respond in JSON format with the following structure:

[
  {
    "name": "Destination Name",
    "description": "Short description of the destination.",
    "weather": "Weather conditions in brief.",
    "location": "City, State, Country"
  }
]`;
    
   
    const result = await model.generateContent(prompt);
    
    return (result.response.text().substring(8,result.response.text().length-3));

}
async function processImage(image) {
  const query = await getLabels(image); 
 return  await getDestinations(query); 
}

export default processImage;
