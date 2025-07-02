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

describe('Cadastro de usuário', () => {
  beforeEach(() => {
    // intercepta a requisição POST que retorna 400
    cy.intercept('POST', `${apiUrl}/usuarios`).as('postUsuario')

    // visita a pagina de cadastro
    cy.visit('/')

    // clica no botão de cadastro
    cy.get('[data-testid="cadastrar"]').click()

    // valida a url
    cy.url().should('include', '/cadastrarusuarios')
    cy.get('h2').should('contain', 'Cadastro')
  })

  it('Cadastrar usuário comum com sucesso', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuario()

    // preencher os campos e clica em cadastrar
    cy.get('[data-testid="nome"]').type(dadosUsuario.nome)
    cy.get('[data-testid="email"]').type(dadosUsuario.email)
    cy.get('[data-testid="password"]').type(dadosUsuario.senha, { log: false })
    cy.get('[data-testid="cadastrar"]').click()

    // valida a mensagem de sucesso
    cy.contains('a', 'Cadastro realizado com sucesso').should('be.visible')

    // valida a url
    cy.url().should('include', '/home')
  })

  it('Cadastrar usuário admin com sucesso', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuarioAdmin()

    // preencher os campos e clica em cadastrar
    cy.get('[data-testid="nome"]').type(dadosUsuario.nome)
    cy.get('[data-testid="email"]').type(dadosUsuario.email)
    cy.get('[data-testid="password"]').type(dadosUsuario.senha, { log: false })
    cy.contains('label', 'Cadastrar como administrador?').click()
    cy.get('[data-testid="cadastrar"]').click()

    // valida a mensagem de sucesso
    cy.contains('a', 'Cadastro realizado com sucesso').should('be.visible')

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

  it('Cadastrar usuário com email já cadastrado', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuarioAdmin()

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
      expect(body.message).to.equal('Cadastro realizado com sucesso')

      // tenta cadastrar o mesmo usuário pela interface
      cy.get('[data-testid="nome"]').type(dadosUsuario.nome)
      cy.get('[data-testid="email"]').type(dadosUsuario.email) 
      cy.get('[data-testid="password"]').type(dadosUsuario.senha, { log: false })
      cy.get('[data-testid="cadastrar"]').click()

      // aguarda a requisição ser feita e valida o response
      cy.wait('@postUsuario').then(({ response }) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body.message).to.equal('Este email já está sendo usado')
      })

      cy.contains('span', 'Este email já está sendo usado').should('be.visible')
    })
  })

  it('Deve exibir mensagens de erro para campos obrigatórios', () => {
    // clica no botão de cadastrar para estourar as mensagens de erro
    cy.get('[data-testid="cadastrar"]').click()

    cy.wait('@postUsuario').then(({ response }) => {
      expect(response.statusCode).to.equal(400)
      expect(response.body.nome).to.equal('nome é obrigatório')
      expect(response.body.email).to.equal('email é obrigatório')
      expect(response.body.password).to.equal('password é obrigatório')
    })

    // valida que as mensagens de erro estão sendo exibidas
    cy.contains('span', 'Nome é obrigatório').should('be.visible')
    cy.contains('span', 'Email é obrigatório').should('be.visible')
    cy.contains('span', 'Password é obrigatório').should('be.visible')
  })

  it('Campo email deve ser do tipo email', () => {
    cy.get('[data-testid="nome"]').type('nome')
    cy.get('[data-testid="email"]').type('email@')
    cy.get('[data-testid="password"]').type('senha', { log: false })
    cy.get('[data-testid="cadastrar"]').click()

    // valida que o campo email é do tipo email
    cy.get('[data-testid="email"]').should('have.attr', 'type', 'email')
  })

  it('Botão entrar redireciona para a tela de login', () => {
    cy.get('[data-testid="entrar"]').click()
    cy.url().should('include', '/login')
    cy.contains('h1', 'Login').should('be.visible')
  })

  // deve ser descomentado após o ajuste do "bug" de double submit
  it.skip('Não deve cadastrar duas vezes ao clicar rapidamente', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuario()
  
    cy.get('[data-testid="nome"]').type(dadosUsuario.nome)
    cy.get('[data-testid="email"]').type(dadosUsuario.email)
    cy.get('[data-testid="password"]').type(dadosUsuario.senha, { log: false })
  
    cy.get('[data-testid="cadastrar"]').dblclick() // dois cliques rápidos
  
    // valida que só foi feita uma requisição
    cy.wait('@postUsuario')
    cy.get('@postUsuario.all').should('have.length', 1)
  })
})