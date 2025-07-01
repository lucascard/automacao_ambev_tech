import { faker } from '@faker-js/faker';

describe('Cadastro de usuário', () => {
  beforeEach(() => {
    // intercepta a requisição POST que retorna 400
    cy.intercept('POST', 'https://serverest.dev/usuarios').as('postUsuario')

    // visita a pagina de cadastro
    cy.visit('/')

    // clica no botão de cadastro
    cy.get('[data-testid="cadastrar"]').click()

    // valida a url
    cy.url().should('include', '/cadastrarusuarios')
    cy.get('h2').should('contain', 'Cadastro')
  })

  it('Cadastrar usuário comum com sucesso', () => {
    // define as variaveis aleatorias que vamos utilizar
    const nomeRandom = faker.person.fullName()
    const emailRandom = faker.internet.email()
    const senhaRandom = faker.internet.password()

    // preencher os campos e clica em cadastrar
    cy.get('[data-testid="nome"]').type(nomeRandom)
    cy.get('[data-testid="email"]').type(emailRandom)
    cy.get('[data-testid="password"]').type(senhaRandom)
    cy.get('[data-testid="cadastrar"]').click()

    // valida a mensagem de sucesso
    cy.contains('Cadastro realizado com sucesso').should('be.visible')

    // valida a url
    cy.url().should('include', '/home')
  })

  it('Cadastrar usuário admin com sucesso', () => {
    // define as variaveis aleatorias que vamos utilizar
    const nomeRandom = faker.person.fullName()
    const emailRandom = faker.internet.email()
    const senhaRandom = faker.internet.password()

    // preencher os campos e clica em cadastrar
    cy.get('[data-testid="nome"]').type(nomeRandom)
    cy.get('[data-testid="email"]').type(emailRandom)
    cy.get('[data-testid="password"]').type(senhaRandom)
    cy.contains('Cadastrar como administrador?').click()
    cy.get('[data-testid="cadastrar"]').click()

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
    cy.get('h1').contains('Bem Vindo ' + nomeRandom).should('be.visible')
  })

  it('Cadastrar usuário com email já cadastrado', () => {
    cy.get('[data-testid="nome"]').type('lucas rodrigues qa')
    cy.get('[data-testid="email"]').type('lucas_rodrigues_qa@aaa.com')
    cy.get('[data-testid="password"]').type('senha123')
    cy.get('[data-testid="cadastrar"]').click()

    // aguarda a requisição ser feita e valida o response
    cy.wait('@postUsuario').then((interception) => {
      expect(interception.response.statusCode).to.equal(400)
      expect(interception.response.body.message).to.equal('Este email já está sendo usado')
    })

    cy.get('span').contains('Este email já está sendo usado').should('be.visible')
  })

  it('Deve exibir mensagens de erro para campos obrigatórios', () => {
    // clica no botão de cadastrar para estourar as mensagens de erro
    cy.get('[data-testid="cadastrar"]').click()

    cy.wait('@postUsuario').then((interception) => {
      expect(interception.response.statusCode).to.equal(400)
      expect(interception.response.body.nome).to.equal('nome é obrigatório')
      expect(interception.response.body.email).to.equal('email é obrigatório')
      expect(interception.response.body.password).to.equal('password é obrigatório')
    })

    // valida que as mensagens de erro estão sendo exibidas
    cy.get('span').contains('Nome é obrigatório').should('be.visible')
    cy.get('span').contains('Email é obrigatório').should('be.visible')
    cy.get('span').contains('Password é obrigatório').should('be.visible')
  })

  it('Cadastrar usuário com email inválido - Sem o @', () => {
    cy.get('[data-testid="nome"]').type('nome')
    cy.get('[data-testid="email"]').type('email')
    cy.get('[data-testid="password"]').type('senha')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('[data-testid="email"]')
      .then(($input) => {
        expect($input[0].validity.valid).to.be.false
        expect($input[0].validationMessage).to.not.be.empty
      })
  })
  
  it('Cadastrar usuário com email inválido - Sem texto depois do @', () => {
    cy.get('[data-testid="nome"]').type('nome')
    cy.get('[data-testid="email"]').type('email@')
    cy.get('[data-testid="password"]').type('senha')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('[data-testid="email"]')
      .then(($input) => {
        expect($input[0].validity.valid).to.be.false
        expect($input[0].validationMessage).to.not.be.empty
      })
  })

  it('Cadastrar usuário com email inválido - Email sendo texto@texto ', () => {
    cy.get('[data-testid="nome"]').type('nome')
    cy.get('[data-testid="email"]').type('texto@texto')
    cy.get('[data-testid="password"]').type('senha')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('span').contains('Email deve ser um email válido').should('be.visible')
  })

  // deve ser descomentado após o ajuste do "bug" de double submit
  it.skip('Não deve cadastrar duas vezes ao clicar rapidamente', () => {
    const nome = faker.person.fullName()
    const email = faker.internet.email()
    const senha = faker.internet.password()
  
    cy.get('[data-testid="nome"]').type(nome)
    cy.get('[data-testid="email"]').type(email)
    cy.get('[data-testid="password"]').type(senha)
  
    cy.get('[data-testid="cadastrar"]').dblclick() // dois cliques rápidos
  
    // valida que só foi feita uma requisição
    cy.wait('@postUsuario')
    cy.get('@postUsuario.all').should('have.length', 1)
  })
  
  it('Ir para a tela de login', () => {
    // clica no botão de login
    cy.get('[data-testid="entrar"]').click()

    // valida a url
    cy.url().should('include', '/login')
  })
})