
import * as utils from "../../../support/utils"

describe('Funcionalidade de Movimentar Animais', () => {

  it('Deve exibir a Visão Geral', () => {

    cy.visit('https://staging.ibrowse.cloud/');

    // removendo a Blank Page (Nova Pagina)
    cy.get('[href="/siastec"]').invoke('removeAttr', 'target')

    utils.click_text_by_class('.item-title','SIASTEC' )

    cy.get('input[name="username"]').invoke('val','teste')
    
    utils.login()

    cy.get('#menu-button > .pi').click()

    utils.click_text_by_class(null,'Acompanhamento CAUC')

    utils.click_text_in_element('span', 'Visão Geral')
  });   

});
  