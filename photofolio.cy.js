cy.get(".image")
  .first()
  .trigger("mouseover");

cy.get(".image")
  .first()
  .find('img[alt="update"]')
  .click({ force: true });

cy.get(".image")
  .first()
  .trigger("mouseover");

cy.get(".image")
  .first()
  .find('img[alt="delete"]')
  .click({ force: true });