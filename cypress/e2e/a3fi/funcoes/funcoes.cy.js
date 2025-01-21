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