#!/bin/bash

# Atualizar pacotes
echo "Atualizando pacotes..."
apt update && apt upgrade -y

# Instalar dependências necessárias
echo "Instalando dependências..."
apt install -y curl

# Baixar e executar o script de instalação do Node.js
curl -fsSL https://deb.nodesource.com/setup_current.x | bash -

# Instalar o Node.js e npm
echo "Instalando Node.js e npm..."
apt install -y nodejs

npm install -g npm@11.0.0

npm install

sudo apt update && sudo apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon-x11-0 libxcomposite1 libxdamage1 libgbm1 libasound2 libxrandr2 libgtk-3-0 libpango-1.0-0 libx11-xcb1
sudo apt update && sudo apt install -y libnss3
sudo apt install -y libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 \ libxkbcommon-x11-0 libxcomposite1 libxdamage1 libgbm1 \ liboss4-salsa-asound2 libxrandr2 libgtk-3-0t64 libpango-1.0-0 libx11-xcb1
sudo apt install -y libasound2t64

# instalando chrome
sudo apt update
wget -O google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
chmod +r google-chrome.deb
sudo apt install -y ./google-chrome.deb
rm google-chrome.deb

echo "Instalação concluída com sucesso!"

