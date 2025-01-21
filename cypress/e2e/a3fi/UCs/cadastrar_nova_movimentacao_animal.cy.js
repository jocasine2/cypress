describe('Funcionalidade de Movimentar Animais', () => {
    const nomeTeste = `João${Date.now()}`; // gerando email único 
    const emailTeste = `joao.silva${Date.now()}@exemplo.com`; // gerando email único 
    const senhaTeste = `senha123`; // gerando senha única 
    const nomeTalhaoTeste = `Talhão${Date.now()}`
    const nomeAnimalTeste = `Animal${Date.now()}`
    const codigoAnimalTeste = `${Date.now()}`

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
      cy.get(':nth-child(8) > .dropdown > .btn').click()
    
      cy.get(':nth-child(8) > .dropdown > div.dropdown-menu > .bs-searchbox > .form-control')
      .invoke('val', termo)
      .trigger('input'); // Dispara evento para que a mudança seja reconhecida // Digita apenas a última letra
    
      cy.get('#bs-select-2-0').click()

      cy.get('#rural_property_longitude').click()
      // Aguardar o tempo de espera
      cy.wait(tempoEspera);

    };
    
    const selectOptionInSelectagSearch = (reference = 'Selecione a raça', item = 'Nelore') => {
      cy.get('body').then(($body) => {
        if ($body.find('.filter-option-inner-inner').length > 0) {
          cy.get('.filter-option-inner-inner').contains(reference).click();    
          cy.get('.bs-searchbox input:visible').type(item);
          cy.get('ul.dropdown-menu.inner.show:visible').contains('li a', item).click();
        } else {
          cy.log('O seletor não está disponível na página');
        }
      });
    };
    
    beforeEach(() => {
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });
    });

    it('Deve movimentar um animal', () => {
      cy.visit('http://localhost:3000/users/sign_in');
      // Cria usuário pelo form externo
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

      // Criando propreidade rural
      cy.get('#menu_6 > span').click()
      cy.get('#btn_criar_rural_property').click()

      cy.wait(1000)

      // Preenche o campo Nome
        cy.get('#rural_property_name').type('Fazenda Nova Esperança');

        buscarNaListaGerente(nomeTeste+' Silva')
        
        cy.get('input[name="rural_property[longitude]"]').click()
        cy.get('input[name="rural_property[latitude]"]').type('-19191981891');
        cy.get('input[name="rural_property[longitude]"]').type('0.49491191984');
        cy.get('#activeCheck').click()
        cy.get('#submit_button').click()

        cy.contains('Propriedade rural criada com sucesso.').should('be.visible');

      // criando talhão
        cy.get('#menu_6').click()
        cy.get('.sorting_1').click()
        cy.wait(1000)
        cy.get('[title="Talhões"]').should('be.visible').click({ multiple: true, force: true });

        cy.get('[href="javascript:cria_talhao()"] > .text').click()

        cy.get('#field_name').type(nomeTalhaoTeste)
        cy.get('#field_field_type').select('Lavoura');

        cy.get('.filter-option-inner-inner').click()
        cy.get('.bs-searchbox > .form-control').type('Brach')
        cy.wait(1000)
        cy.get('#bs-select-1-0').click()
        
        cy.get('#field_size').type('151484')
        cy.get('#field_latitude').type('0.491915168')
        cy.get('#field_longitude').type('-1.491919151684')
        
        cy.get('.text-right > .btn').click()
        cy.contains('Talhão criado com sucesso!').should('be.visible');

      // criando animal
        cy.get('#menu_6').click()
        cy.get('.sorting_1').click()
        cy.wait(1000)
        cy.get('[title="Patrimônios"]').should('be.visible').click({ multiple: true, force: true });

        cy.get('[class="fas fa-paw"]').click()
        cy.get('[href="javascript:cria_animal()"]').click()
        
        cy.get('#animal_name').type(nomeAnimalTeste)
        cy.get('#animal_code').type(codigoAnimalTeste)


        selectOptionInSelectagSearch('Selecione a raça', 'Nelore')
    });   

  });
  