import httpx
import json

async def stream_lm_studio(message: str):
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            "http://127.0.0.1:1234/v1/chat/completions",
            json={
                "model": "gemma-4-e4b-it",
                "messages": [{"role": "user", "content": message}],
                "stream": True,
            },
            timeout=60.0,
        ) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    chunk = line[6:]
                    if chunk == "[DONE]":
                        break
                    try:
                        data = json.loads(chunk)
                        token = data["choices"][0]["delta"].get("content", "")
                        if token:
                            yield token
                    except Exception as e:
                        print(f"ERROR: {e}")