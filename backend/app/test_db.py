
import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        database="zorofit",
        user="addi",
        password="0212",
        port=5432
    )

    print("PostgreSQL connection successful!")

    conn.close()

except Exception as e:
    print("Connection failed:", e)
