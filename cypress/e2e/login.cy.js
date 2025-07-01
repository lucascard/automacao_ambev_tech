import { faker } from '@faker-js/faker'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Login com sucesso - usuário comum', () => {
    // define as variaveis aleatorias
    const nome = faker.person.fullName()
    const email = faker.internet.email()
    const senha = faker.internet.password()

    // cria o usuário via API antes do teste
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: {
        nome: nome,
        email: email,
        password: senha,
        administrador: 'false'
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(201)

      // faz login com o usuário criado
      cy.get('[data-testid="email"]').type(email)
      cy.get('[data-testid="senha"]').type(senha)
      cy.get('[data-testid="entrar"]').click()

      // valida a url
      cy.url().should('include', '/home')

      // valida os itens da topbar de usuário comum
      cy.get('[data-testid="home"]').should('be.visible')
      cy.get('[data-testid="logout"]').should('be.visible')
    })
  })

  it('Login com sucesso - usuário admin', () => {
    // define as variaveis aleatorias
    const nome = faker.person.fullName()
    const email = faker.internet.email()
    const senha = faker.internet.password()

    // cria o usuário admin via API antes do teste
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: {
        nome: nome,
        email: email,
        password: senha,
        administrador: 'true'
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(201)

      // faz login com o usuário criado
      cy.get('[data-testid="email"]').type(email)
      cy.get('[data-testid="senha"]').type(senha)
      cy.get('[data-testid="entrar"]').click()

      // valida a url
      cy.url().should('include', '/home')

      // valida os itens da topbar de admin
      cy.get('[data-testid="home"]').should('be.visible')
      cy.get('[data-testid="cadastrar-usuarios"]').should('be.visible')
      cy.get('[data-testid="listar-usuarios"]').should('be.visible')
      cy.get('[data-testid="cadastrar-produtos"]').should('be.visible')
      cy.get('[data-testid="listar-produtos"]').should('be.visible')
      cy.get('[data-testid="link-relatorios"]').should('be.visible')
      cy.get('[data-testid="logout"]').should('be.visible')

      // valida a mensagem de bem-vindo com o nome do usuário
      cy.get('h1').contains('Bem Vindo ' + nome).should('be.visible')
    })
  })

  it('Login com credenciais inválidas', () => {
    cy.get('[data-testid="email"]').type('invalid@email.com')
    cy.get('[data-testid="senha"]').type('wrongpassword')
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Email e/ou senha inválidos').should('be.visible')
  })

  it('Campos obrigatórios', () => {
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
  })

  it('Email inválido', () => {
    cy.get('[data-testid="email"]').type('emailinvalido')
    cy.get('[data-testid="senha"]').type('123456')
    cy.get('[data-testid="entrar"]').click()

    // valida que o campo de email está inválido usando a API de validação do HTML5
    cy.get('[data-testid="email"]')
      .then(($input) => {
        expect($input[0].validity.valid).to.be.false
      })
  })

  it('Ir para a tela de cadastro', () => {
    cy.contains('Cadastre-se').click()
    cy.url().should('include', '/cadastrarusuarios')
  })
})