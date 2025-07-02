const apiUrl = Cypress.env('apiUrl');

// Função helper para gerar dados de usuário
function gerarDadosUsuario() {
  const primeiroNome = Cypress._.random(1000, 9999).toString()
  const ultimoNome = Cypress._.random(1000, 9999).toString()
  const nome = `Usuário ${primeiroNome} ${ultimoNome}`
  const email = `usuario${primeiroNome}.${ultimoNome}@serverest.com`
  const senha = `senha${Cypress._.random(1000, 9999)}`

  return {
    nome: nome,
    email: email,
    senha: senha
  }
}

function gerarDadosUsuarioAdmin() {
  const dados = gerarDadosUsuario()
  return {
    ...dados,
    administrador: 'true'
  }
}

function gerarDadosUsuarioComum() {
  const dados = gerarDadosUsuario()
  return {
    ...dados,
    administrador: 'false'
  }
}

describe('Login', () => {
  beforeEach(() => {
    cy.intercept('POST', `${apiUrl}/login`).as('login')
    cy.visit('/')
  })

  it('Login com sucesso - usuário comum', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuarioComum()

    // cria o usuário via API antes do teste
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        password: dadosUsuario.senha,
        administrador: dadosUsuario.administrador
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(201)

      // faz login com o usuário criado
      cy.get('[data-testid="email"]').type(dadosUsuario.email)
      cy.get('[data-testid="senha"]').type(dadosUsuario.senha, { log: false })
      cy.get('[data-testid="entrar"]').click()

      // valida a url
      cy.url().should('include', '/home')

      // valida os itens da topbar de usuário comum
      cy.get('[data-testid="home"]').should('be.visible')
      cy.get('[data-testid="logout"]').should('be.visible')
    })
  })

  it('Login com sucesso - usuário admin', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuarioAdmin()

    // cria o usuário admin via API antes do teste
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        password: dadosUsuario.senha,
        administrador: dadosUsuario.administrador
      }
    }).then(({ body, status }) => {
      expect(status).to.equal(201)

      // faz login com o usuário criado
      cy.get('[data-testid="email"]').type(dadosUsuario.email)
      cy.get('[data-testid="senha"]').type(dadosUsuario.senha, { log: false })
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
      cy.contains('h1', `Bem Vindo ${dadosUsuario.nome}`).should('be.visible')
    })
  })

  it('Login com credenciais inválidas', () => {
    cy.get('[data-testid="email"]').type('invalid@email.com')
    cy.get('[data-testid="senha"]').type('wrongpassword', { log: false })
    cy.get('[data-testid="entrar"]').click()

    cy.contains('span', 'Email e/ou senha inválidos').should('be.visible')
    cy.wait('@login').then(({ response }) => {
      expect(response.statusCode).to.equal(401)
      expect(response.body.message).to.equal('Email e/ou senha inválidos')
    })
  })

  it('Deve retornar erro ao não preencher os campos obrigatórios', () => {
    cy.get('[data-testid="entrar"]').click()

    cy.contains('span', 'Email é obrigatório').should('be.visible')
    cy.contains('span', 'Password é obrigatório').should('be.visible')
  })

  it('Campo email deve ser do tipo email', () => {
    cy.get('[data-testid="email"]').type('emailinvalido')
    cy.get('[data-testid="senha"]').type('123456', { log: false })
    cy.get('[data-testid="entrar"]').click()

    // valida que o campo de email está inválido usando a API de validação do HTML5
    cy.get('[data-testid="email"]').should('have.attr', 'type', 'email')
  })

  it('Botão Cadastre-se redireciona para a tela de cadastro', () => {
    cy.contains('a', 'Cadastre-se').click()
    
    cy.url().should('include', '/cadastrarusuarios')
    cy.contains('h2', 'Cadastro').should('be.visible')
  })
})