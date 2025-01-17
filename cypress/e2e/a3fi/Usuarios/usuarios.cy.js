describe('Funcionalidade de Gerenciar Usuários', () => {
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
    
    it('Deve criar um usuário com sucesso', () => {
      criarUsuario();
      cy.contains('Usuário criado com sucesso!').should('be.visible');
    });
    
    it('Deve mostrar mensagem de registro duplicado', () => {
      criarUsuario('joao.silva123@exemplo.com');
      criarUsuario('joao.silva123@exemplo.com');
      cy.contains('Email já foi utilizado').should('be.visible');
    });

    it('Deve atualizar informações de um usuário', () => {
      // cy.viewport(1280, 720);
      cy.visit('http://localhost:3000/users');
      buscarNaLista('joao.silva123@exemplo.com', 3)

      // descomente se a lista ficar colapsada e os botões escondidos
      // cy.get(':nth-child(1) > .sorting_1').click()
      cy.wait(10000); // Espera de 10 segundo (10000 milissegundos)
      cy.get('span[title="Editar"]').click();

      editarUsuario();

      buscarNaLista('joao.silva123@exemplo.com', 3)
      cy.contains('Usuário atualizado com sucesso!').should('be.visible');
    });
    
    it('Deve excluir um usuário logicamente', () => {
      // cy.viewport(1280, 720);
      cy.visit('http://localhost:3000/users');

      buscarNaLista('joao.silva123@exemplo.com', 3)
    
      // Localiza o botão "Desativar" correspondente ao usuário
      cy.get('span[title="Desativar"]').click();
    
      buscarNaLista('joao.silva123@exemplo.com', 3)
    
      // Verifica se a mensagem de confirmação aparece
      cy.contains('Usuário desativado com sucesso!').should('be.visible');
    
      // Verifica se o usuário foi realmente desativado (opcional, baseado na UI da aplicação)
      // cy.get('#inputSearch').clear().type('joao.silva123@exemplo.com');
      // cy.wait(10000);
      
      // cy.contains('Desativado').should('be.visible');
    });    

  });
  