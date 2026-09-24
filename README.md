# 🤖 Modüler Yapay Zeka Asistanı (AI Chatbot)

![Proje Ekran Görüntüsü](images/Screenshot%202026-09-24%20110850.png)

Modern, hızlı ve çok yetenekli bir Yapay Zeka Asistanı. Bu proje, kullanıcıların metin ve görsel tabanlı sorgularına gelişmiş yapay zeka modelleri ile cevap veren bir platform sunar. İçerisinde hem FastAPI destekli güçlü bir **Backend**, hem React (Vite) ile geliştirilmiş modern bir **Frontend**, hem de alternatif kullanım için Streamlit tabanlı bir arayüz barındırır.

## 🌟 Öne Çıkan Özellikler

- **Çoklu Kullanıcı Desteği:** Kullanıcı adı bazlı sohbet geçmişi yönetimi ile her kullanıcı kendi geçmişine kaldığı yerden devam edebilir.
- **Görsel Analizi:** Yüklenen görselleri (PNG, JPG, JPEG) yapay zeka ile analiz edebilme ve yorumlayabilme yeteneği.
- **Dinamik Veri Entegrasyonları (Araç Kullanımı):** 
  - 🌦️ **Hava Durumu:** Open-Meteo API entegrasyonu sayesinde herhangi bir şehrin anlık hava durumunu öğrenme.
  - 📈 **Finans Verileri:** Yahoo Finance entegrasyonu ile hisse senedi ve kripto para anlık fiyat sorgulama.
  - 🔍 **Web Arama:** Gerekli durumlarda Wikipedia veya diğer kaynaklardan internet araması simülasyonu ile bilgi çekme.
- **Çift Arayüz Desteği:**
  - **React/Vite Frontend:** Modern, hızlı, responsive (mobil uyumlu) ve şık tasarımlı web arayüzü.
  - **Streamlit Frontend:** Hızlı prototipleme ve veri bilimi odaklı kullanım için `app.py` üzerinden erişilebilen alternatif arayüz.
- **Performanslı Backend:** FastAPI ile asenkron mimari, yüksek performans ve otomatik Swagger (OpenAPI) dokümantasyonu.
- **Veritabanı Entegrasyonu:** SQLite veritabanı ile hafif, hızlı ve yerel sohbet geçmişi saklama.

## 🚀 Kullanılan Teknolojiler

### Backend
- **Python 3**
- **FastAPI** (Web framework, RESTful API)
- **Uvicorn** (Asenkron sunucu)
- **SQLite & sqlite3** (Veritabanı)
- **Pydantic** (Veri doğrulama)
- **Pillow (PIL)** (Görsel işleme)
- **yfinance, requests** (Harici API istekleri)
- **Google Generative AI (Gemini)** (Yapay Zeka Modeli)

### Frontend (React App)
- **React 19**
- **Vite** (Hızlı geliştirme ve derleme aracı)
- **Tailwind CSS** (Modern ve esnek stil yönetimi)

## 📂 Proje Yapısı

```
chat_bot/
├── main.py              # FastAPI uygulamasının ana dosyası ve API endpointleri
├── app.py               # Streamlit tabanlı alternatif arayüz
├── ai_engine.py         # Yapay zeka entegrasyonları, prompt mühendisliği ve araçlar (Hava, Finans)
├── database.py          # SQLite veritabanı işlemleri (tablo oluşturma, mesaj kaydetme/okuma)
├── frontend/            # React & Vite ile geliştirilmiş ana web arayüzü
│   ├── src/             # Frontend kaynak kodları, bileşenler ve stiller
│   ├── package.json     # Node.js bağımlılıkları
│   └── vite.config.js   # Vite yapılandırma dosyası
├── images/              # Dokümantasyon ve README için ekran görüntüleri
├── .env                 # API anahtarları (Örn: GEMINI_API_KEY)
└── README.md            # Proje dokümantasyonu (Bu dosya)
```

## 🛠️ Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/Yavuz0707/ChatBot.git
cd ChatBot
```

### 2. Ortam Değişkenlerini Ayarlayın

Projenin kök dizininde `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve içine kendi Google Gemini API anahtarınızı ekleyin:

```env
GEMINI_API_KEY=sizin_api_anahtariniz_buraya
```

### 3. Backend'i Başlatın (FastAPI)

Python sanal ortamı (virtual environment) oluşturmanız ve aktif etmeniz önerilir.

```bash
# Gerekli kütüphanelerin yüklenmesi
# (Eğer requirements.txt varsa: pip install -r requirements.txt)
pip install fastapi uvicorn pydantic pillow yfinance requests python-multipart google-generativeai streamlit

# FastAPI sunucusunu başlatın
python -m uvicorn main:app --reload --port 8000
```
*Backend `http://localhost:8000` adresinde çalışacaktır. API dökümantasyonu için `http://localhost:8000/docs` adresini ziyaret edebilirsiniz.*

### 4. Frontend'i Başlatın (React/Vite)

Yeni bir terminal sekmesi açın ve `frontend` klasörüne gidin:

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
*Frontend varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.*

### 5. (Opsiyonel) Streamlit Arayüzünü Kullanma

React arayüzü yerine Streamlit kullanmak isterseniz ana dizinde şu komutu çalıştırabilirsiniz:

```bash
streamlit run app.py
```

## 🔌 API Endpointleri

FastAPI ile sağlanan temel REST API endpointleri:

- `GET /api/health` : Sunucu durumunu kontrol eder (Health check).
- `GET /api/history/{username}` : Belirtilen kullanıcının sohbet geçmişini getirir.
- `POST /api/chat` : Sadece metin içeren sohbet isteklerini alır ve AI yanıtını döndürür.
- `POST /api/chat/image` : `multipart/form-data` kabul eder. Metin ile birlikte görsel yüklenmesini ve yapay zeka tarafından analiz edilmesini sağlar.

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve katkılara açıktır! Herhangi bir hata bulursanız veya yeni bir özellik eklemek isterseniz, lütfen bir "Issue" açın veya "Pull Request" gönderin.

1. Bu depoyu Fork'layın
2. Yeni bir dal (branch) oluşturun (`git checkout -b ozellik/YeniOzellik`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Yeni bir özellik eklendi'`)
4. Dalınıza push'layın (`git push origin ozellik/YeniOzellik`)
5. Bir Pull Request oluşturun

---

*Bu proje, modern web teknolojileri ve gelişmiş yapay zeka yeteneklerini bir araya getirerek hızlı, esnek ve modüler bir asistan deneyimi sunmak amacıyla geliştirilmiştir.*
