describe('API - Autenticação', () => {
  
  it('deve logar com sucesso', () => {
    const email = `user${Date.now()}@mail.com`;
    const password = 'teste123';

    // Cria o usuário
    cy.request('POST', `https://serverest.dev/usuarios`, {
      nome: 'Teste',
      email,
      password,
      administrador: 'true'
    }).then((createRes) => {
      expect(createRes.status).to.eq(201);

      // Faz login 
      cy.request('POST', `https://serverest.dev/login`, {
        email,
        password
      }).then((loginRes) => {
        expect(loginRes.status).to.eq(200);
        expect(loginRes.body).to.have.property('authorization');
        expect(loginRes.body.authorization).to.not.be.empty;
        cy.log('Token:', loginRes.body.authorization);
      });
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
    }).then((response) => {
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Email e/ou senha inválidos');
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
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.password).to.equal('password não pode ficar em branco');
    });

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: {
        email: '',
        password: 'teste123'
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal('email não pode ficar em branco');
    });
  });
});