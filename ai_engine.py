import os
import re
import requests
import yfinance as yf
from tavily import TavilyClient
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(override=True)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

system_instruction = """Sen çok yetenekli bir yapay zeka asistanısın. Kullanıcı güncel veri istediğinde şu formatları kullanmalısın:
1. FİNANS ARACI: [FİNANS: sembol] (Örn: [FİNANS: USDTRY=X])
2. HAVA DURUMU ARACI: [HAVA: şehir_adı] (Örn: [HAVA: Ankara])
3. ARAMA ARACI: [ARAMA: aranacak kelimeler] (Örn: [ARAMA: Real Madrid son maç sonucu])
Asla tekrar arama komutu üretme."""

def process_ai_response(user_input, image_part=None):
    # Sohbet oturumu başlat
    chat = client.chats.create(
        model="gemini-3.5-flash-lite",
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.3,
        )
    )
    
    # Girdi görsel mi yoksa metin mi?
    if image_part:
        response = chat.send_message([image_part, "Bu görseli detaylıca incele ve açıkla."])
    else:
        response = chat.send_message(user_input)
        
    bot_message = response.text
    
    # Araç tetikleyicilerini kontrol et
    finans_komutu = re.search(r'\[FİNANS:(.*?)\]', bot_message)
    hava_komutu = re.search(r'\[HAVA:(.*?)\]', bot_message)
    arama_komutu = re.search(r'\[ARAMA:(.*?)\]', bot_message)
    
    sistem_notu = ""
    
    if finans_komutu:
        sembol = finans_komutu.group(1).strip()
        try:
            ticker = yf.Ticker(sembol)
            anlik_fiyat = ticker.history(period="1d")['Close'].iloc[-1]
            sistem_notu = f"Sistem Notu: Yahoo Finance verisine göre {sembol} anlık fiyatı: {anlik_fiyat:.2f}."
        except:
            sistem_notu = "Sistem Notu: Finans verisi alınamadı."
            
    elif hava_komutu:
        sehir = hava_komutu.group(1).strip()
        try:
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={sehir}&count=1&language=tr&format=json"
            geo_res = requests.get(geo_url).json()
            if "results" in geo_res and len(geo_res["results"]) > 0:
                lat = geo_res["results"][0]["latitude"]
                lon = geo_res["results"][0]["longitude"]
                w_res = requests.get(f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m").json()
                temp = w_res["current"]["temperature_2m"]
                sistem_notu = f"Sistem Notu: {sehir} sıcaklık {temp}°C."
            else:
                sistem_notu = f"Sistem Notu: {sehir} bulunamadı."
        except:
            sistem_notu = "Sistem Notu: Hava durumu alınamadı."
            
    elif arama_komutu:
        sorgu = arama_komutu.group(1).strip()
        try:
            tavily_yaniti = tavily_client.search(query=sorgu, search_depth="advanced", max_results=2)
            baglam = "\n\n".join([sonuc['content'] for sonuc in tavily_yaniti['results']])
            sistem_notu = f"Sistem Notu: Arama Sonuçları:\n{baglam}\n\nLütfen yeni komut üretmeden cevap ver."
        except:
            sistem_notu = "Sistem Notu: Arama yapılamadı."

    if sistem_notu:
        final_response = chat.send_message(sistem_notu)
        return final_response.text
        
    return bot_message