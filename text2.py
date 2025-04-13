from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def buscar_noticias():
    response = client.chat.completions.create(
        model="gpt-4-turbo",  # ou "gpt-4o" se disponível
        messages=[
            {
                "role": "user",
                "content": "Quais são as principais notícias do Brasil hoje? (Realize uma busca na web e me traga os resultados mais recentes.)"
            }
        ],
        tools=[{"type": "web_search"}],  # ou "web_search_preview", dependendo da API
    )

    print("\n🔎 Resultado:")
    print(response.choices[0].message.content)

    print("Prompt tokens:", response.usage.prompt_tokens)
    print("Completion tokens:", response.usage.completion_tokens)
    print("Total tokens:", response.usage.total_tokens)

buscar_noticias()