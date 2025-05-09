#!/bin/bash

function cypress() {
    CYPRESS_DIR="./test"
    MIN_NPX_VERSION="11.0.0"

    # Verifica se o diretório do Cypress existe
    if [ ! -d "$CYPRESS_DIR" ]; then
        echo "Erro: O diretório $CYPRESS_DIR não foi encontrado."
        return 1
    fi

    function version_ge() {
        # Compara versões: retorna 0 se $1 >= $2
        [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
    }

    case "$1" in
        run)
            npx cypress run --project "$CYPRESS_DIR"
            ;;
        open)
            npx cypress open --project "$CYPRESS_DIR"
            ;;
        install)
            echo "Instalando dependências com node_install.sh..."

            # Verifica se o Node.js está instalado
            if ! command -v node &> /dev/null; then
                echo "❌ Node.js não encontrado. Instalando Node.js..."
                (cd "$CYPRESS_DIR" && sudo ./config/node_install.sh)
            else
                echo "✅ Node.js já está instalado."
            fi

            # Verifica se a versão mínima do NPX está instalada
            NPX_VERSION=$(npx -v)
            if version_ge "$NPX_VERSION" "$MIN_NPX_VERSION"; then
                echo "✅ NPX $NPX_VERSION é compatível."
            else
                echo "❌ Versão do NPX ($NPX_VERSION) é inferior à mínima exigida ($MIN_NPX_VERSION)."
                return 1
            fi

            echo "Instalando Cypress..."
            npx cypress install

            # Verificar versões instaladas
            echo "Verificando versões instaladas..."
            echo "Node.js: $(node -v)"
            echo "NPM: $(npm -v)"
            echo "NPX: $NPX_VERSION"
            echo "Cypress: $(npx cypress -v)"
            ;;
        --help|-h)
            echo "Uso: cypress {run|open|install}"
            ;;
        *)
            echo "Comando inválido. Use 'cypress --help' ou 'cypress -h' para ajuda."
            return 1
            ;;
    esac
}
