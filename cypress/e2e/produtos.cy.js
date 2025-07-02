const apiUrl = Cypress.env('apiUrl');

// Função helper para gerar dados de usuário admin
function gerarDadosUsuarioAdmin() {
  const primeiroNome = Cypress._.random(1000, 9999).toString()
  const ultimoNome = Cypress._.random(1000, 9999).toString()
  const nome = `Usuário ${primeiroNome} ${ultimoNome}`
  const email = `usuario${primeiroNome}.${ultimoNome}@serverest.com`
  const senha = `senha${Cypress._.random(1000, 9999)}`

  return {
    nome: nome,
    email: email,
    senha: senha,
    administrador: 'true'
  }
}

// Função helper para gerar dados de produto
function gerarDadosProduto() {
  const nome = `Produto ${Cypress._.random(1000, 9999)}`
  const preco = Cypress._.random(10, 1000)
  const descricao = `Descrição do produto ${Cypress._.random(1000, 9999)}`
  const quantidade = Cypress._.random(1, 100)

  return {
    nome: nome,
    preco: preco,
    descricao: descricao,
    quantidade: quantidade
  }
}

describe('Produtos', () => {
  beforeEach(() => {
    cy.login()
  })
  
  it('Adicionar um produto a lista de compra e depois ao carrinho', () => {
    cy.visit('/home')
    // adiciona o primeiro produto da lista
    cy.get('[data-testid="adicionarNaLista"]').first().click()
    
    cy.url().should('include', '/minhaListaDeProdutos')
    cy.contains('h1', 'Lista de Compras').should('be.visible')

    cy.contains('button', 'Adicionar no carrinho').click()

    cy.url().should('include', '/carrinho')

    cy.contains('h1', 'Em construção aguarde').should('be.visible')
  })

  it('Limpar a lista de compra', () => {
    cy.visit('/home')

      // adiciona o primeiro produto da lista
      cy.get('[data-testid="adicionarNaLista"]').first().click()

      cy.url().should('include', '/minhaListaDeProdutos')
      cy.contains('h1', 'Lista de Compras').should('be.visible')

      cy.get('[data-testid="limparLista"]').click()

      cy.contains('p', 'Seu carrinho está vazio').should('be.visible')
  })

  it('Pesquisar por um produto', () => {
    // gera dados de usuário admin e produto
    const dadosUsuario = gerarDadosUsuarioAdmin()
    const dadosProduto = gerarDadosProduto()

    // cria o usuário admin via API
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        password: dadosUsuario.senha,
        administrador: dadosUsuario.administrador
      }
    }).then(({ status }) => {
      expect(status).to.equal(201)

      // faz login como admin para obter o token
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          email: dadosUsuario.email,
          password: dadosUsuario.senha
        }
      }).then(({ body, status }) => {
        expect(status).to.equal(200)
        expect(body).to.have.property('authorization')
        
        const token = body.authorization

        // cria o produto usando o token de autorização
        cy.request({
          method: 'POST',
          url: `${apiUrl}/produtos`,
          headers: {
            'Authorization': token
          },
          body: {
            nome: dadosProduto.nome,
            preco: dadosProduto.preco,
            descricao: dadosProduto.descricao,
            quantidade: dadosProduto.quantidade
          }
        }).then(({ body, status }) => {
          expect(status).to.equal(201)
          expect(body.message).to.equal('Cadastro realizado com sucesso')

          // visita a página home
          cy.visit('/home')

          // pesquisa pelo produto criado
          cy.get('[data-testid="pesquisar"]').type(dadosProduto.nome)
          cy.get('[data-testid="botaoPesquisar"]').click()

          // valida que o produto foi encontrado
          cy.get('.card-title.negrito').should('contain', dadosProduto.nome)
          cy.get('.card-subtitle').should('contain', `$ ${dadosProduto.preco}`)
          
          // valida que só existe um produto na lista (um card)
          cy.get('.card').should('have.length', 1)
          
          // valida que o produto tem os elementos esperados
          cy.get('[data-testid="product-detail-link"]').should('be.visible')
          cy.get('[data-testid="adicionarNaLista"]').should('be.visible')
        })
      })
    })
  })
})