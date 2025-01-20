describe('Funcionalidade de Gerenciar Usuários', () => {
    
    const nomeTeste = `João${Date.now()}`; // gerando email único 
    const emailTeste = `joao.silva${Date.now()}@exemplo.com`; // gerando email único 
    const senhaTeste = `senha123`; // gerando senha única 

    const login = (email = 'dev@dev.com', senha = '123456') => {
      cy.visit('http://localhost:3000/users/sign_in');
    
      cy.get('body').then(($body) => {
        if ($body.find('input[name="user[email]"]').length > 0 && $body.find('input[name="user[password]"]').length > 0) {
          cy.get('input[name="user[email]"]').type(email);
          cy.get('input[name="user[password]"]').type(senha);
          cy.get('#new_user').submit();
        } else {
          cy.log('Usuário já está logado ou a página de login não está disponível');
        }
      });
    };
  
    const logout = () => {
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
  
    const criarUsuarioProdutor = (email = null) => {
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

    const editarUsuario = (email, novoNome = null, novoSobrenome = null, novaSenha = null) => {
    
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

    const buscarNaListaGerente = (termo, tempoEspera = 2) => {  
      tempoEspera = (tempoEspera * 1000)

      // clica no select_search de RT
      cy.get(':nth-child(12) > .dropdown > .btn > .filter-option > .filter-option-inner > .filter-option-inner-inner').click()
    
      // Digitar a última letra do termo
      cy.get('input[aria-controls="bs-select-3"]')
      .invoke('val', termo)
      .trigger('input'); // Dispara evento para que a mudança seja reconhecida // Digita apenas a última letra
    
      // Aguardar o tempo de espera
      cy.wait(tempoEspera);
    };
    
    beforeEach(() => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    });

    it('Deve registrar uma nova propriedade rural iniciando o fluxo pelo form externo', () => {
      cy.visit('http://localhost:3000/users/sign_in');
      cy.get('[href="/users/sign_up"]').click()
      
      // Preencher os campos de nome e sobrenome
      cy.get('input[name="natural_person[name]"]').type(nomeTeste);
      cy.get('input[name="natural_person[last_name]"]').type('Silva');
      
      // Preencher os campos de email, senha e confirmação de senha
      cy.get('input[name="user[email]"]').type(emailTeste);
      cy.get('input[name="user[password]"]').type(senhaTeste);
      cy.get('input[name="user[password_confirmation]"]').type(senhaTeste);
      
      // Marcar os perfis
      cy.get('input[name="user_profile[ids][]"][value="4"]').check(); // Produtor Rural
      
      // Submeter o formulário
      cy.get('.actions > .btn').click();

      login(emailTeste, senhaTeste);
      cy.contains('Login realizado com sucesso.').should('be.visible');

      cy.get('#menu_6 > span').click()
      cy.get('#btn_criar_rural_property').click()

      cy.wait(3000)
      // Preenche o campo Nome
      cy.get('#rural_property_name').type('Fazenda Nova Esperança');

      buscarNaListaGerente(nomeTeste+' Silva')
      
      cy.wait(3000)
      
      cy.get('.text').click()
      cy.get('input[name="rural_property[longitude]"]').click()
      cy.get('input[name="rural_property[latitude]"]').type('-19191981891');
      cy.get('input[name="rural_property[longitude]"]').type('0.49491191984');
      cy.get('#activeCheck').click()
      cy.get('#submit_button').click()

      cy.contains('Propriedade rural criada com sucesso.').should('be.visible');
    });

    // it('Deve criar um usuário com sucesso', () => {
    //   login();
    //   criarUsuario();
    //   cy.contains('Usuário criado com sucesso!').should('be.visible');
    // });
    
    // it('Deve mostrar mensagem de registro duplicado', () => {
    //   login();
    //   criarUsuario('joao.silva123@exemplo.com');
    //   criarUsuario('joao.silva123@exemplo.com');
    //   cy.contains('Email já foi utilizado').should('be.visible');
    // });

    // it('Deve atualizar informações de um usuário', () => {
    // });
    
    // it('Deve excluir um usuário logicamente', () => {
    // });    

  });
  