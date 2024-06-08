describe('Criando cenários de teste realizando filtros', () => {

  it('Caso de teste: Filtrar pet da espécie cachorro', () => {
    cy.visit('localhost:4200/adote')
    cy.get('#specie').should('exist').select('660219a1ad3b997c447f3a1e');
    cy.get('.button-search').click();
    cy.contains('Filtros aplicados:');
  });

  it('Caso de teste: Filtrar espécie de pet que não foi encontrado', () => {
    cy.visit('localhost:4200/adote')
    cy.get('#specie').should('exist').select('66021a68ad3b997c447f3a2c');
    cy.get('.button-search').click();
    cy.contains('Não há nenhum pet cadastrado para adoção no momento!');
  });

})
