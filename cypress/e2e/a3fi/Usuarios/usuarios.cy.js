describe('Funcionalidade de Usuários', () => {
    beforeEach(() => {
      // Configuração comum para todos os testes, como realizar login
      cy.visit('http://localhost:3000/users/sign_in');
      cy.get('input[name="user[email]"]').type('dev@dev.com');
      cy.get('input[name="user[password]"]').type('123456');
      cy.get('#new_user').submit();
    });

    const criarUsuario = (email = null) => {
      cy.visit('http://localhost:3000/users');
      
      // Clicar no botão de adicionar novo usuário
      cy.get('i[class="fas fa-plus"]').click();

      // Preencher os campos de nome e sobrenome
      cy.get('input[name="natural_person[name]"]').type('João');
      cy.get('input[name="natural_person[last_name]"]').type('Silva');
      
      // Se o email não for fornecido, gerar um email único
      const emailParaUsar = email || `joao.silva${Date.now()}@exemplo.com`; // gerando email único caso não seja passado
      
      // Preencher os campos de email, senha e confirmação de senha
      cy.get('input[name="user[email]"]').type(emailParaUsar);
      cy.get('input[name="user[password]"]').type('senha123');
      cy.get('input[name="user[password_confirmation]"]').type('senha123');
      
      // Marcar os perfis
      cy.get('input[name="user_profile[ids][]"][value="1"]').check(); // Administrador
      
      // Submeter o formulário
      cy.get('#submitButton').click();
    }

    it('Deve criar um usuário com sucesso', () => {
      criarUsuario();
      cy.contains('Usuário criado com sucesso!').should('be.visible');
    });
    
    it('Deve mostrar mensagem de registro duplicado', () => {
      criarUsuario('joao.silva123@exemplo.com');
      criarUsuario('joao.silva123@exemplo.com');
      cy.contains('Registro duplicado...').should('be.visible');
    });

    // it('Deve atualizar informações de um usuário', () => {});
    
    // it('Deve excluir um usuário logicamente', () => {});

  });
  