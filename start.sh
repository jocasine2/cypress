#!/bin/bash

#atualiza submodulos
git submodule update --init --recursive
# git submodule add https://github.com/jocasine2/functions.git submodules/functions
    #criar funções gerais para serem importadas por todas as funções especificas
    #tornar o proprio cypress um submodulo

#adicionando funções ao bash
source submodules/functions/ruby-on-rails/functions.sh

#teste
# cypress run
# obs: para rodar o cypresse é preciso instalar o plugin do vscode "Cypress Tests for VSCode" e seguir os passos em  https://github.com/jocasine2/cypress