# Basis-Image mit Node.js
FROM node:18

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere die package.json und package-lock.json, um Abhängigkeiten zu installieren
COPY package.json package-lock.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest der App
COPY . .

# Exponiere Port 3000
EXPOSE 3000

# Starte die Anwendung
CMD ["node", "index.js"]
