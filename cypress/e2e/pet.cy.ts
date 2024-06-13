describe('Criando cenários com os pets', () => {

  it('Caso de teste: Usuário adicionando pet em seus favoritos sem estar autenticado', () => {
    cy.visit('localhost:4200/adote')
    cy.get('.pet-carousel .image-container').first().as('imagemContainer');
    cy.get('@imagemContainer').trigger('mouseover');
    cy.get('@imagemContainer').find('.carousel-buttons .button-add-favorite-pets').click({ force: true });
    cy.contains('Faça login na plataforma Miaudote');

  });

  it('Caso de teste: Removendo um pet da lista de favoritos', () => {
    cy.visit('localhost:4200/adote')
    cy.get('div#sidebar ul#list li#favorite-pets').click();
    cy.get('#email').type('laura.ellen.souza@hotmail.com')
    cy.get('#password').type('123456')
    cy.get('.button-entrar').click();
    cy.get('div#sidebar ul#list li#favorite-pets').click();

    cy.get('.pet-carousel .image-container').first().as('imagemContainer');
    cy.get('@imagemContainer').trigger('mouseover');
    cy.get('@imagemContainer').find('.carousel-buttons .button-remove-favorite-pet').click({ force: true });
    cy.contains('Remover pet?');
    cy.get('.button-confirm-remove').click();
  });

  it('Caso de teste: Usuário adicionando pet em seus favoritos', () => {
    cy.visit('localhost:4200/adote')
    cy.get('.pet-carousel .image-container').first().as('imagemContainer');
    cy.get('@imagemContainer').trigger('mouseover');
    cy.get('@imagemContainer').find('.carousel-buttons .button-add-favorite-pets').click({ force: true });
    cy.contains('Faça login na plataforma Miaudote');
    cy.get('.button-navigate-login').click();
    cy.get('#email').type('laura.ellen.souza@hotmail.com')
    cy.get('#password').type('123456')
    cy.get('.button-entrar').click();
    cy.contains('MIAUDOTE');
    cy.get('.pet-carousel .image-container').first().as('imagemContainer');
    cy.get('@imagemContainer').trigger('mouseover');
    cy.get('@imagemContainer').find('.carousel-buttons .button-add-favorite-pets').click({ force: true });
    cy.contains('Pet adicionado!');
  });

  it('Caso de teste: Usuário adicionando um pet já adicionado em seus favoritos', () => {
    cy.visit('localhost:4200/adote')
    cy.get('.pet-carousel .image-container').first().as('imagemContainer');
    cy.get('@imagemContainer').trigger('mouseover');
    cy.get('@imagemContainer').find('.carousel-buttons .button-add-favorite-pets').click({ force: true });
    cy.contains('Faça login na plataforma Miaudote');
    cy.get('.button-navigate-login').click();
    cy.get('#email').type('laura.ellen.souza@hotmail.com')
    cy.get('#password').type('123456')
    cy.get('.button-entrar').click();
    cy.contains('MIAUDOTE');
    cy.get('.pet-carousel .image-container').first().as('imagemContainer');
    cy.get('@imagemContainer').trigger('mouseover');
    cy.get('@imagemContainer').find('.carousel-buttons .button-add-favorite-pets').click({ force: true });
    cy.contains('Atenção!');
  });
});
