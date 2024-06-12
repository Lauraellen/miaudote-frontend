describe('Criando cenários de teste atualizando usuário', () => {

  it('Caso de teste: Usuário atualizado com sucesso', () => {
    cy.visit('localhost:4200/adote')
    cy.get('div#sidebar ul#list li#profile').click();
    cy.get('#email').type('laura.ellen.souza@hotmail.com')
    cy.get('#password').type('123456')
    cy.get('.button-entrar').click();
    cy.get('div#sidebar ul#list li#profile').click();
    cy.get('.edit-profile').click();
    cy.get('#celphone').clear();
    cy.get('#celphone').type('35988510483')
    cy.get('.save-profile').click();
    cy.contains('Usuário atualizado com sucesso!');


  });

  it('Caso de teste: Logout do usuário', () => {
    cy.visit('localhost:4200/adote')
    cy.get('div#sidebar ul#list li#profile').click();
    cy.get('#email').type('laura.ellen.souza@hotmail.com')
    cy.get('#password').type('123456')
    cy.get('.button-entrar').click();
    cy.get('div#sidebar ul#list li#profile').click();
    cy.get('.button-logout').click();
    cy.contains('Sair?');
    cy.get('.button-confirm-logout').click();
    cy.contains('Entrar');
  });
})
