import { faker } from '@faker-js/faker'

describe('API - Autenticação', () => {  
  it('deve logar com sucesso', () => {
    const email = faker.internet.email();
    const password = 'teste123';

    // Cria o usuário
    cy.request('POST', `https://serverest.dev/usuarios`, {
      nome: 'Teste',
      email,
      password,
      administrador: 'true'
    }).then(({ status }) => {
      expect(status).to.eq(201);
    });

    // Faz login 
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: {
        email: email,
        password: password
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
      url: 'https://serverest.dev/login',
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
      url: 'https://serverest.dev/login',
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
      url: 'https://serverest.dev/login',
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