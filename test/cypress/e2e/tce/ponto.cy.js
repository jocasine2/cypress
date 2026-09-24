
import * as utils from "../../support/utils"

describe("ponto", () => {
  it("tests ponto", () => {
    cy.viewport(1253, 854);
    
    //login no sistema
    cy.visit("http://meta4.tceto.tc.br/");
    cy.get("#_USER").type("JOAQUIMCSN");
    cy.get("#_PASSWD").type("151720Jcs");
    cy.get("#enviarNovo").click();

    // navega para a seção de ponto eletrônico
    cy.get("li:nth-of-type(2) li:nth-of-type(2) > a").click();
    cy.location("href").should("eq", "http://meta4.tceto.tc.br/servlet/CheckSecurity/JSP/cbw_m3/cjf_meu_ponto_eletronico.jsp");
   
    // deve clicar no botão "Registrar Entrada" ou "Registrar Saída" dependendo do horário
    // entrada
    // cy.get("#btnSaida > span").click();
    // cy.get("div.ui-dialog-buttonpane span").click();
    
    // saída
    // cy.get("#btnEntrada > span").click();
    // cy.get("div.ui-dialog-buttonpane span").click();
  
  });
});
  