# Instale o nvm se ainda não o tiver
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc

# Instale a versão do Node.js necessária
nvm install 22.9.0

# Use a versão instalada
nvm use 22.9.0

# Verifique a versão do Node.js
node -v
