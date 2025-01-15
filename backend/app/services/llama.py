import os
from dotenv import load_dotenv

from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)


system_propmt = """You are a andriod """

def get_model_response(prompt:str):
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f'{prompt}',
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content