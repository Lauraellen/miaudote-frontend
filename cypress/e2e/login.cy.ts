describe('Criando cenários de teste realizando login', () => {

  it('Caso de teste: E-mail e senha corretos', () => {
    cy.visit('localhost:4200/login')
    cy.get('#email').type('laura.ellen@gec.inatel.br')
    cy.get('#password').type('123456')
    cy.get('.button-entrar').click();
    cy.contains('MIAUDOTE');
  });

  it('Caso de teste: E-mail e senha incorretos', () => {
    cy.visit('localhost:4200/login')
    cy.get('#email').type('laura.ellen@gec.inatel.br')
    cy.get('#password').type('1234567')
    cy.get('.button-entrar').click();
    cy.contains('E-mail ou senha incorretos.');
  });

  it('Caso de teste: Cadastrar novo usuário', () => {
    cy.visit('localhost:4200/login')
    cy.get('.nova-conta').click();
    cy.get('#name').type('Ana B')
    cy.get('#celphone').type('35985412622')
    cy.get('#email').type('anab@hotmail.com')
    cy.get('#password').type('1234567')
    cy.get('.button-entrar').click();
    cy.contains('Entrar');
  });
})