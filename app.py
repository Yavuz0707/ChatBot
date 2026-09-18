import streamlit as st
from PIL import Image
from database import init_db, save_message, load_messages
from ai_engine import process_ai_response

# Veritabanını başlat
init_db()

st.set_page_config(page_title="Modüler Yapay Zeka Asistanı", page_icon="🤖", layout="centered")

st.title("🤖 Çok Kullanıcılı Yapay Zeka Asistanı")

# Sol Kenar Çubuğu: Kullanıcı Paneli ve Görsel Yükleme Alanı
st.sidebar.header("Kullanıcı Paneli")
username = st.sidebar.text_input("Adınızı Girin:")

if not username:
    st.warning("Lütfen sohbet başlatmak için sol menüden adınızı girin.")
else:
    st.sidebar.success(f"Aktif Kullanıcı: **{username}**")
    
    st.sidebar.markdown("---")
    st.sidebar.subheader("🖼️ Görsel Analiz")
    uploaded_file = st.sidebar.file_uploader("Bir görsel yükleyin", type=["png", "jpg", "jpeg"])
    
    if uploaded_file:
        img_preview = Image.open(uploaded_file)
        st.sidebar.image(img_preview, caption="Yüklenen Görsel", use_column_width=True)

    # Oturumda geçmiş mesajları tutma
    if "current_user" not in st.session_state or st.session_state["current_user"] != username:
        st.session_state["current_user"] = username
        st.session_state["messages"] = load_messages(username)

    # Sohbet geçmişini ekrana yazdır
    for msg in st.session_state["messages"]:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # En altta sadece mesaj giriş alanı
    prompt = st.chat_input("Bir şeyler yazın...")

    if prompt or uploaded_file:
        user_content = prompt if prompt else "Görsel yüklendi ve analiz ediliyor."
        
        # Kullanıcı mesajını ekrana bas ve veritabanına kaydet
        with st.chat_message("user"):
            if uploaded_file and not prompt:
                st.markdown("📷 *Bir görsel gönderildi.*")
            if prompt:
                st.markdown(prompt)
                
        save_message(username, "user", user_content)
        st.session_state["messages"].append({"role": "user", "content": user_content})

        # Bot yanıtını üret
        with st.spinner("Yapay zeka düşünüyor..."):
            try:
                if uploaded_file:
                    img_obj = Image.open(uploaded_file)
                    bot_reply = process_ai_response(prompt if prompt else "Bu görseli açıkla.", image_part=img_obj)
                else:
                    bot_reply = process_ai_response(prompt)
            except Exception as e:
                bot_reply = f"Bir hata oluştu: {e}"

        # Bot yanıtını ekrana bas ve veritabanına kaydet
        with st.chat_message("assistant"):
            st.markdown(bot_reply)
            
        save_message(username, "assistant", bot_reply)
        st.session_state["messages"].append({"role": "assistant", "content": bot_reply})