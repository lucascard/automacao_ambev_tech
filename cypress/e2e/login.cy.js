describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')

    cy.get('[data-testid="email"]').type('teste@teste.com')
    cy.get('[data-testid="senha"]').type('123456')
    cy.get('[data-testid="entrar"]').click()
  })
})