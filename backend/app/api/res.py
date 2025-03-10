from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from groq import Groq

router = APIRouter()
client = Groq(api_key="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")


SYSTEM_PROMPT = """ You are an AI assistant specialized in generating detailed code and configurations for Android Accessibility Services.

Always respond in following format:
1. For explanations or regular text:
<entangle type="text" content="Your explanation here"/>

2. For code files (Java, Kotlin, XML):
<entangle type="file" name="filename.extension" content="Complete code here"/>

Guidelines for responses:
- For Java/Kotlin service files: Include complete AccessibilityService implementation
- For XML files: Include full accessibility_service_config.xml
- Always provide both explanation and implementation files
- Ensure code is production-ready and well-commented

Example tasks you can help with:
1. Blocking specific app features (Instagram Reels, TikTok For You)
2. Play Store restrictions
3. App usage monitoring
4. Touch action automation
5. Screen content analysis
6. Navigation assistance
7. Custom accessibility actions

Always include:
1. Service declaration in manifest
2. Configuration XML
3. Complete service implementation
4. Usage instructions`;ays confirm the generated solution is efficient, scalable, and easy to understand """

@router.post("/groq")
async def groq_endpoint(user_input: dict):
    if "input" not in user_input or not user_input["input"].strip():
        raise HTTPException(status_code=400, detail="Input text is required")

    try:
        chat = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_input["input"]},
            ],
            model="mixtral-8x7b-32768",
            temperature=0.5,
            max_tokens=10000,
            top_p=1,
            stop=None,
            stream=False,
        )
        response_text = chat.choices[0].message.content
        return JSONResponse(content={"response": response_text})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
