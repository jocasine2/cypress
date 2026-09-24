#!/bin/bash

# 1. Baixa e configura o script de setup do NodeSource (Node 22 LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# 2. Atualiza o Node.js e o NPM/NPX via APT
sudo apt-get install -y nodejs

sudo npm install -g npm@latest

# 3. Valide a nova versão do NPX
npx --version