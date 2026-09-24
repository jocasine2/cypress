import * as utils from "../../../support/utils"
describe('Funcionalidade de Logout', () => {
  beforeEach(() => {
    // Configuração comum para todos os testes, como realizar login
    cy.visit('http://localhost:3000/users/sign_in');
    cy.get('input[name="user[email]"]').type('dev@dev.com');
    cy.get('input[name="user[password]"]').type('123456');
    cy.get('#new_user').submit();
  });

  it('Deve fazer logout com sucesso e redirecionar para a página de login', () => {

    // Abre o dropdown do usuário
    cy.get('#userDropdown').click();

    // Clica no botão de logout
    cy.get('#btn_sair').click();
    cy.get('#btn_modal_sair').click();

    // Verifica se a URL inclui '/users/sign_in'
    cy.url().should('include', '/users/sign_in');

    // Verifica se o texto "Logout realizado com sucesso" está presente na tela
    cy.contains('Logout realizado com sucesso').should('be.visible');
  });

  it('Não deve permitir ações protegidas após o logout', () => {
    // Realiza o logout
    cy.get('#userDropdown').click();
    cy.get('#btn_sair').click();
    cy.get('#btn_modal_sair').click();

    // Tenta acessar uma rota protegida
    cy.visit('http://localhost:3000/users');
    // Verifica que foi redirecionado para a página de login
    cy.url().should('include', '/users/sign_in');
    cy.contains('Você precisa fazer login ou se cadastrar antes de continuar.').should('be.visible');
  });
});
