# Dependencias
## Iniciando ambiente de desenvolvimento de testes
1 - Se estiver em ambiente Windows instale o Ubuntu como subsistema através do [WSL2](https://youtu.be/_Wp2nWtTBBY?t=109).

2 - Instale o [Docker Desktop](hhttps://docs.docker.com/desktop/setup/install/windows-install/) (Windows) ou [Docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) e o [Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04) (Ubuntu).

3 - Carregue algumas funções úteis e inicie os containers.
```
source start.sh
```

# Rodar o Cypress
No terminal do linux na pasta cypress execute os seguintes comandos:
4 - Para rodar o cypress com interface gráfica
```
cypress open
```
5 - Para rodar o cypress sem interface gráfica (somnete no terminal) 
```
cypress run
```
6 - Para instalar o cypress
```
cypress install
```
