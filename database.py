import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(override=True)
DB_PASSWORD = os.getenv("DB_PASSWORD")

def get_connection():
    return psycopg2.connect(
        host="127.0.0.1",  # "localhost" yerine doğrudan "127.0.0.1" yazıyoruz
        database="chatbot_db",
        user="postgres",
        password=DB_PASSWORD,
        port="5432"
    )

def init_db():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS multi_user_chat (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100),
                role VARCHAR(50),
                content TEXT
            );
        """)
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Veritabanı tablo oluşturma hatası: {e}")

def save_message(username, role, content):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO multi_user_chat (username, role, content) VALUES (%s, %s, %s)",
            (username, role, content)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Mesaj kaydetme hatası: {e}")

def load_messages(username):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT role, content FROM multi_user_chat WHERE username = %s ORDER BY id ASC",
            (username,)
        )
        rows = cursor.fetchall()
        print(f"🔍 '{username}' için veritabanından çekilen mesaj sayısı: {len(rows)}") # Burayı ekledik
        cursor.close()
        conn.close()
        return [{"role": row[0], "content": row[1]} for row in rows]
    except Exception as e:
        print(f"Geçmişi yükleme hatası: {e}")
        return []