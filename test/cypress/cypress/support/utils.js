export const id = `${Date.now()}`;
export const nomeTeste = `João${Date.now()}`; // gerando email único 
export const emailTeste = `joao.silva${Date.now()}@exemplo.com`; // gerando email único 
export const senhaTeste = `senha123`; // gerando senha única 
export const nomeTalhaoTeste = `Talhão${Date.now()}`
export const nomeAnimalTeste = `Animal${Date.now()}`
export const codigoAnimalTeste = `${Date.now()}`

beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });
});

export const login = (email = '32.893.926/0001-40', senha = '123456') => {
    cy.get('body').then(($body) => {
        cy.get('input[name="username"]').invoke('val',email);
        cy.get('input[name="password"]').invoke('val',senha);
        cy.get('#loginBtn').click();
    });
  };

export const logout = () => {
    // Abre o dropdown do usuário
    cy.get('#userDropdown').click();

    // Clica no botão de logout
    cy.get('#btn_sair').click();
    cy.get('#btn_modal_sair').click();

    // Verifica se a URL inclui '/users/sign_in'
    cy.url().should('include', '/users/sign_in');

    // Verifica se o texto "Logout realizado com sucesso" está presente na tela
    cy.contains('Logout realizado com sucesso').should('be.visible');
}; 

export const criarUsuarioProdutor = (email = null) => {
    cy.visit('http://localhost:3000/users');
    
    // Clicar no botão de adicionar novo usuário
    cy.get('i[class="fas fa-plus"]').click();

    // Preencher os campos de nome e sobrenome
    cy.get('input[name="natural_person[name]"]').type(nomeTeste);
    cy.get('input[name="natural_person[last_name]"]').type('Silva');
    
    // Se o email não for fornecido, gerar um email único
    const emailTeste = email || `joao.silva${Date.now()}@exemplo.com`; // gerando email único caso não seja passado
    
    // Preencher os campos de email, senha e confirmação de senha
    cy.get('input[name="user[email]"]').type(emailTeste);
    cy.get('input[name="user[password]"]').type(senhaTeste);
    cy.get('input[name="user[password_confirmation]"]').type(senhaTeste);
    
    // Marcar os perfis
    cy.get('input[name="user_profile[ids][]"][value="4"]').check(); // Produtor Rural
    
    // Submeter o formulário
    cy.get('#submitButton').click();
}

export const editarUsuario = (email, novoNome = null, novoSobrenome = null, novaSenha = null) => {

    // Preencher os campos de nome e sobrenome, adicionando "(Editado)" caso novos valores não sejam fornecidos
    cy.get('input[name="natural_person[name]"]').invoke('val').then((nomeAtual) => {
    const nomeParaUsar = novoNome || `(Editado) ${nomeAtual}`;
    cy.get('input[name="natural_person[name]"]').clear().type(nomeParaUsar);
    });

    cy.get('input[name="natural_person[last_name]"]').invoke('val').then((sobrenomeAtual) => {
    const sobrenomeParaUsar = novoSobrenome || `(Editado) ${sobrenomeAtual}`;
    cy.get('input[name="natural_person[last_name]"]').clear().type(sobrenomeParaUsar);
    });

    // Atualizar a senha, se uma nova senha for fornecida
    if (novaSenha) {
    cy.get('input[name="user[password]"]').clear().type(novaSenha);
    cy.get('input[name="user[password_confirmation]"]').clear().type(novaSenha);
    }

    // Submeter o formulário de edição
    cy.get('#submitButton').click();
};

export const buscarNaListaGerente = (termo, tempoEspera = 2) => {  
    tempoEspera = (tempoEspera * 1000)

    // clica no select_search de RT
    cy.get(':nth-child(8) > .dropdown > .btn').click()

    cy.get(':nth-child(8) > .dropdown > div.dropdown-menu > .bs-searchbox > .form-control')
    .invoke('val', termo)
    .trigger('input'); // Dispara evento para que a mudança seja reconhecida // Digita apenas a última letra

    cy.get('#bs-select-2-0').click()

    cy.get('#rural_property_longitude').click()
    // Aguardar o tempo de espera
    cy.wait(tempoEspera);
};

export const selectOptionInSelectagSearch = (reference = '', item = 'Nelore') => {
    cy.get('label').contains(reference).then(($label) => {
        // Encontra o botão dentro da div.dropdown associada a esse label
        cy.wrap($label)
            .closest('div.form-group') // Encontra o contêiner mais próximo
            .find('div.dropdown') // Encontra a div com a classe dropdown
            .find('button') // Encontra o botão dentro da dropdown
            .then(($button) => {
                if ($button.length > 0) {
                    // Clica no botão dropdown
                    cy.wrap($button).click();

                    // Digita no campo de busca
                    cy.get('.bs-searchbox input:visible').type(item);

                    // Encontra o item correspondente no dropdown e clica nele
                    cy.get('ul.dropdown-menu.inner.show:visible')
                        .contains('li a', item)
                        .click();
                } else {
                    // Loga uma mensagem caso o botão não esteja disponível
                    cy.log('O botão dropdown não está disponível na página');
                }
            });
    });
};

export const click_text_by_class = (classe = '', reference = 'Selecione a raça') => {
    cy.get('body').then(() => {
    if (classe === null) {
        cy.contains(reference).click();
    } else {
        cy.get(classe).contains(reference).click();
    }
    });
};

export const click_text_in_element = (element, text) => {
    cy.get('body').then(() => {
    cy.get(element).contains(text).click();
    });
};

export const set_ckeditor_text = (fieldLabel = 'Observações', text = 'texto de teste') => {
    cy.get('.form-group').contains('label', fieldLabel).should('exist').then(($formGroup) => {
        // Encontra a instância do CKEditor correspondente ao form-group correto
        cy.wrap($formGroup).parent().find('div.ck-editor__editable').should('exist').then(($editor) => {
            cy.window().then((win) => {
                const editorInstance = $editor[0]?.ckeditorInstance;
                if (editorInstance) {
                editorInstance.setData(text);
                } else {
                throw new Error('Instância do CKEditor não encontrada.');
                }
            });
        });
    });
};

export const selectOptionInSelectag = (reference = '', item = 'Nelore') => {
    cy.get('.form-group label').contains(reference).then(($label) => {
        // Encontrar o botão dentro da div.dropdown associada ao label
        cy.wrap($label)
            .closest('.form-group') // Encontrar o form-group mais próximo
            .find('div.dropdown') // Encontrar a div com a classe dropdown
            .find('button') // Encontrar o botão dentro da dropdown
            .then(($button) => {
                if ($button.length === 1) {
                    // Clica no botão dropdown
                    cy.wrap($button).click();

                    // Encontra o item correspondente no dropdown e clica nele
                    cy.get('ul.dropdown-menu.inner.show:visible')
                        .contains('li a', item)
                        .click();
                } else {
                    // Loga uma mensagem caso o botão não esteja disponível ou múltiplos botões sejam encontrados
                    cy.log('Erro: Não foi encontrado um único botão dropdown ou existem múltiplos botões.');
                }
            });
    });
};

export const input_text = (labelText, value) => {
    cy.get('.form-group label').contains(labelText).then(($label) => {
        cy.wrap($label)
            .closest('.form-group') // Encontra o form-group mais próximo
            .find('input') // Busca o input dentro do form-group
            .should('exist') // Garante que o input existe
            .clear() // Limpa o campo antes de digitar
            .type(value); // Digita o valor desejado
    });
};
