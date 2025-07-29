# Gunakan base image Node.js
FROM node:22

# Set working directory
WORKDIR /src

# Salin file package.json dan install dependensi
COPY package*.json ./
RUN npm install

# Salin semua file ke dalam image
COPY . .

# Tentukan port yang digunakan aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "dev"]
