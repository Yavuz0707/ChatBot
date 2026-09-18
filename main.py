from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from PIL import Image
import io

from database import init_db, save_message, load_messages
from ai_engine import process_ai_response

init_db()

app = FastAPI(title="AI Chatbot API")

# React arayüzünün API ile haberleşebilmesi için CORS izni
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    username: str
    message: str

@app.get("/api/history/{username}")
def get_history(username: str):
    history = load_messages(username)
    return {"history": history}

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    if not req.username or not req.message:
        raise HTTPException(status_code=400, detail="Kullanıcı adı ve mesaj zorunludur.")
    
    try:
        # Kullanıcı mesajını kaydet
        save_message(req.username, "user", req.message)
        
        # Yapay zeka yanıtını üret
        bot_reply = process_ai_response(req.message)
        
        # Bot yanıtını kaydet
        save_message(req.username, "assistant", bot_reply)
        
        return {"reply": bot_reply}
    except Exception as e:
        err = str(e)
        if "429" in err or "RESOURCE_EXHAUSTED" in err:
            raise HTTPException(status_code=429, detail="Gemini API günlük ücretsiz kota doldu (20 istek/gün). Yarın tekrar deneyin veya ücretli plan aktifleştirin.")
        raise HTTPException(status_code=500, detail=f"AI hatası: {err[:200]}")

@app.post("/api/chat/image")
async def chat_image_endpoint(
    username: str = Form(...),
    message: str = Form("Bu görseli detaylıca açıkla."),
    file: UploadFile = File(...)
):
    """Görsel analizi için multipart/form-data endpoint."""
    if not username:
        raise HTTPException(status_code=400, detail="Kullanıcı adı zorunludur.")
    
    # Görseli oku ve PIL Image'a çevir
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Görsel işlenemedi: {e}")
    
    # Kullanıcı mesajını kaydet
    user_content = message if message else "Görsel yüklendi ve analiz ediliyor."
    save_message(username, "user", f"[Görsel: {file.filename}] {user_content}")
    
    # Yapay zeka yanıtını üret (görsel ile)
    bot_reply = process_ai_response(message, image_part=img)
    
    # Bot yanıtını kaydet
    save_message(username, "assistant", bot_reply)
    
    return {"reply": bot_reply}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}