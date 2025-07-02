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

describe('API - Autenticação', () => {  
  it('deve logar com sucesso', () => {
    // gera dados de usuário usando função helper
    const dadosUsuario = gerarDadosUsuarioAdmin()

    // Cria o usuário
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
      expect(status).to.eq(201);
    });

    // Faz login 
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: dadosUsuario.email,
        password: dadosUsuario.senha
      },
      failOnStatusCode: false
    }).then(({ body, status }) => {
      expect(status).to.eq(200);
      expect(body).to.have.property('authorization');
      expect(body.authorization).to.not.be.empty;
    });
  });

  it('deve retornar erro com credenciais inválidas', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'invalid@email.com',
        password: 'wrongpassword'
      },
      failOnStatusCode: false
    }).then(({ body, status }) => {
      expect(status).to.equal(401);
      expect(body).to.have.property('message');
      expect(body.message).to.equal('Email e/ou senha inválidos');
    });
  });

  it('campos obrigatórios', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'invalid@email.com',
        password: ''
      },
      failOnStatusCode: false
    }).then(({ body, status }) => {
      expect(status).to.equal(400);
      expect(body.password).to.equal('password não pode ficar em branco');
    });

    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: '',
        password: 'teste123'
      },
      failOnStatusCode: false
    }).then(({ body, status }) => {
      expect(status).to.equal(400);
      expect(body.email).to.equal('email não pode ficar em branco');
    });
  });
});