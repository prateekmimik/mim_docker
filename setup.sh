#!/bin/bash
set -xv

export NVM_DIR="$HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
  echo "Installing NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

nvm install 18.19.1 && nvm use 18.19.1 && npm install -g dotenv@16.5.0 httpyac@5.10.2

tar -xvf ./bin/mim-OE-SE-linux-developer-AMD64-v3.16.0-erc.1.tar -C ./bin/

rm ./bin/*.tar

git clone https://github.com/edgeMicroservice/starter-microservice.git
cd starter-microservice
npm install

cd ../cli-utils
npm install

cd ../bin/

./start.sh