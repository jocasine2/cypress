describe('Funcionalidade de Gerenciar Usuários', () => {
    const login = (email = 'dev@dev.com', senha = '123456') => {
      cy.visit('http://localhost:3000/users/sign_in');
      cy.get('input[name="user[email]"]').type(email);
      cy.get('input[name="user[password]"]').type(senha);
      cy.get('#new_user').submit();
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
  
    const criarUsuario = (email = null) => {
      cy.visit('http://localhost:3000/users');
      
      // Clicar no botão de adicionar novo usuário
      cy.get('i[class="fas fa-plus"]').click();

      // Preencher os campos de nome e sobrenome
      cy.get('input[name="natural_person[name]"]').type('João');
      cy.get('input[name="natural_person[last_name]"]').type('Silva');
      
      // Se o email não for fornecido, gerar um email único
      const emailTeste = email || `joao.silva${Date.now()}@exemplo.com`; // gerando email único caso não seja passado
      
      // Preencher os campos de email, senha e confirmação de senha
      cy.get('input[name="user[email]"]').type(emailTeste);
      cy.get('input[name="user[password]"]').type(senhaTeste);
      cy.get('input[name="user[password_confirmation]"]').type(senhaTeste);
      
      // Marcar os perfis
      cy.get('input[name="user_profile[ids][]"][value="1"]').check(); // Administrador
      
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

    const buscarNaLista = (termo, tempoEspera = 5) => {  
      tempoEspera = (tempoEspera * 1000)
      // Limpar o campo de pesquisa
      cy.get('#inputSearch').invoke('val', termo.slice(0, -1)); // Digita o termo sem a última letra
      
      // Digitar a última letra do termo
      cy.get('#inputSearch').type(termo.slice(-1)); // Digita apenas a última letra
    
      // Aguardar o tempo de espera
      cy.wait(tempoEspera);
    };

    // Se o email não for fornecido, gerar um email único
    // Se o email não for fornecido, gerar um email único
    const emailTeste = `joao.silva${Date.now()}@exemplo.com`; // gerando email único 
    const senhaTeste = `senha123`; // gerando senha única 

    it('Deve registrar um novo usuário pelo form externo', () => {
      cy.visit('http://localhost:3000/users/sign_in');
      cy.get('[href="/users/sign_up"]').click()
      
      // Preencher os campos de nome e sobrenome
      cy.get('input[name="natural_person[name]"]').type('João');
      cy.get('input[name="natural_person[last_name]"]').type('Silva');
      
      // Preencher os campos de email, senha e confirmação de senha
      cy.get('input[name="user[email]"]').type(emailTeste);
      cy.get('input[name="user[password]"]').type(senhaTeste);
      cy.get('input[name="user[password_confirmation]"]').type(senhaTeste);
      
      // Marcar os perfis
      cy.get('input[name="user_profile[ids][]"][value="1"]').check(); // Administrador
      
      // Submeter o formulário
      cy.get('.actions > .btn').click();

      login(emailTeste, senhaTeste);
      cy.contains('Login realizado com sucesso.').should('be.visible');
    });

    it('Deve criar um usuário com sucesso', () => {
      login();
      criarUsuario();
      cy.contains('Usuário criado com sucesso!').should('be.visible');
    });
    
    it('Deve mostrar mensagem de registro duplicado', () => {
      login();
      criarUsuario('joao.silva123@exemplo.com');
      criarUsuario('joao.silva123@exemplo.com');
      cy.contains('Email já foi utilizado').should('be.visible');
    });

    it('Deve atualizar informações de um usuário', () => {
      login();
      // cy.viewport(1280, 720);
      cy.visit('http://localhost:3000/users');
      buscarNaLista('joao.silva123@exemplo.com', 3)

      // descomente se a lista ficar colapsada e os botões escondidos
      // cy.get(':nth-child(1) > .sorting_1').click()
    
      cy.get('span[title="Editar"]').click();

      editarUsuario();

      buscarNaLista('joao.silva123@exemplo.com', 3)
      cy.contains('Usuário atualizado com sucesso!').should('be.visible');
    });
    
    it('Deve excluir um usuário logicamente', () => {
      login();
      cy.viewport(1280, 720);
      cy.visit('http://localhost:3000/users');

      buscarNaLista(emailTeste, 3)
    
      // Localiza o botão "Desativar" correspondente ao usuário
      cy.get('span[title="Desativar"]').click();
    
      buscarNaLista(emailTeste, 3)
    
      // Verifica se a mensagem de confirmação aparece
      cy.contains('Usuário desativado com sucesso!').should('be.visible');
    
      // Verifica se o usuário foi realmente desativado (opcional, baseado na UI da aplicação)
      // cy.get('#inputSearch').clear().type('joao.silva123@exemplo.com');
      // cy.wait(10000);
      
      // cy.contains('Desativado').should('be.visible');
    });    

  });
  