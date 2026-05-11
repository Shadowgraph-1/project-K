from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from src.types.chat import ChatRequest
from src.services.lm_studio import stream_lm_studio

router = APIRouter()

@router.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    return StreamingResponse(
        stream_lm_studio(req.message),
        media_type="text/plain"
    )