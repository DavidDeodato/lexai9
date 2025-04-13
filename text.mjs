import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;


const openai = new OpenAI({
  apiKey: apiKey, // Substitua pela sua chave
});

async function buscarNoticias() {
  const response = await openai.responses.create({
    model: "gpt-4o",  // ou "gpt-4o-mini", se for seu caso
    tools: [{ type: "web_search_preview" }],
    input: "o que é uma bola",
  });

  console.log("\n🔎 Resultado:");
  console.log(response.output_text);

  console.log("Prompt tokens:", response.usage.prompt_tokens);
  console.log("Completion tokens:", response.usage.completion_tokens);
  console.log("Total tokens:", response.usage.total_tokens);
}

buscarNoticias();
