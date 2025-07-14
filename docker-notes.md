1. Jalankan MongoDB Docker container dengan autentikasi + volume

docker run -d \
  --name mongodb-auth \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=rizapranata \
  -e MONGO_INITDB_ROOT_PASSWORD=rahasia \
  -v C:/Users/DELL/project/Backend/mongo-data:/data/db \
  mongo

📌 Penjelasan:

-p 27017:27017 → expose port ke host

-e MONGO_INITDB_... → membuat user root di DB admin

-v ...:/data/db → menyimpan data MongoDB ke harddisk-mu (persisten)

2. Login ke MongoDB via terminal

docker exec -it mongodb-auth mongosh -u rizapranata -p rahasia --authenticationDatabase admin

✅ Berhasil karena:
- User rizapranata memang dibuat di DB admin
- Port 27017 sudah terbuka dari container

3. Gagal login di Compass: “Authentication failed”

❌ Penyebab:
Kamu sempat pakai:
authSource=foodstore
→ padahal user ada di DB admin

Juga, sempat pakai localhost, padahal Compass tidak bisa mengakses container via localhost langsung (pada Windows).

✅ Solusi:
Gunakan connection string berikut di Compass:
mongodb://rizapranata:rahasia@host.docker.internal:27017/foodstore?authSource=admin

📌 Penjelasan:

- host.docker.internal → agar Compass (host) bisa connect ke container (Docker)
- authSource=admin → karena user dibuat di DB admin
- foodstore → adalah database target yang ingin kamu akses

✅ Best Practice & Tips Lanjutan
- Gunakan docker-compose.yml untuk setup mudah dan repeatable (bisa saya bantu buatkan)

- Pisahkan user admin dan user untuk aplikasi (readWrite saja)
- Simpan password dalam .env file, bukan hardcoded
- Tambahkan backup routine jika database penting (pakai mongodump)
- Compass bisa digunakan untuk query, create index, dan monitoring


👉 Saran - Kalau kamu ingin saya bantu buatkan:

- docker-compose.yml versi production
- Setup user otomatis via init script
- Backup/restore MongoDB
- Koneksi MongoDB dengan Express.js (Mongoose)
