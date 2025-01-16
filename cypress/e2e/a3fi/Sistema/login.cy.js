describe('Funcionalidade de Logout', () => {
  it('login', () => {
    cy.visit('http://localhost:3000/users/sign_in')
    // Preenche o campo de email
    cy.get('input[name="user[email]"]').type('dev@dev.com');
    // Preenche o campo de senha
    cy.get('input[name="user[password]"]').type('123456');
    // Submete o formulário de login
    cy.get('#new_user').submit();
    // Verifica se o login foi bem-sucedido (personalize conforme sua aplicação)
    cy.url().should('not.include', '/users/sign_in');
  })
})