# Dependencias
## Iniciando ambiente de desenvolvimento de testes
1 - Se estiver em ambiente Windows instale o Ubuntu como subsistema através do [WSL2](https://youtu.be/_Wp2nWtTBBY?t=109).

2 - Instale o [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) (Windows) ou [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) e o [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04) (Ubuntu).

3 - Através da loja do windows instale a ultima versão do Ubuntu (Windows).

4 - Nas configurações do Docker ative a integração com o wsl (Windows)


![alt text](img/docker_desktop_configuration.png)

5 - Instale o [VScode](https://code.visualstudio.com/download)

6 - Instale o plugin para integração com o WSL

![alt text](img/vscode_plugin_wsl.png)

7 - Abra o terminal do VScode

![alt text](img/terminal_vscode.png)

# Rodar o Cypress
No terminal do linux na pasta cypress execute os seguintes comandos:

8 - Carregue algumas funções úteis e inicie os containers.
```
source start.sh
```

Para rodar o cypress com interface gráfica
```
cypress open
```
Para rodar o cypress sem interface gráfica (somnete no terminal) 
```
cypress run
```
Para instalar o cypress
```
cypress install
```

9 - A pasta onde ficam os testes separados por projeto
```
test/cypress/cypress/e2e
```
obs: Pode usar os testes do siastec como modelo