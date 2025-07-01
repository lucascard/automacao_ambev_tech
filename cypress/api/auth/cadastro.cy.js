describe('API - Cadastro de Usuário', () => {
  describe('POST /usuarios', () => {
    it('Cadastro de usuário admin com sucesso (201)', () => {
      const email = `fulano${Date.now()}@email.com`;
      
      cy.request('POST', 'https://serverest.dev/usuarios', {
        nome: 'Fulano da Silva',
        email: email,
        password: 'teste',
        administrador: 'true'
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        expect(response.body).to.have.property('_id');
        expect(response.body._id).to.be.a('string');
      });
    });

    it('Cadastro de usuário comum com sucesso (201)', () => {
      const email = `fulano${Date.now()}@email.com`;
      
      cy.request('POST', 'https://serverest.dev/usuarios', {
        nome: 'Fulano da Silva',
        email: email,
        password: 'teste',
        administrador: 'false'
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        expect(response.body).to.have.property('_id');
        expect(response.body._id).to.be.a('string');
      });
    });

    it('Deve retornar erro ao tentar cadastrar usuário com email já utilizado (400)', () => {
      const email = `duplicado${Date.now()}@email.com`;
      const userData = {
        nome: 'Fulano da Silva',
        email: email,
        password: 'teste',
        administrador: 'true'
      };

      // realizo o cadastro de um usuário
      cy.request('POST', 'https://serverest.dev/usuarios', userData)
        .then((response) => {
          expect(response.status).to.equal(201);
          expect(response.body.message).to.equal('Cadastro realizado com sucesso');
        });

      // tento cadastrar um usuário com o mesmo email
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: userData,
        failOnStatusCode: false
      }).then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('Este email já está sendo usado');
          
        });
    });

    it('Deve validar campos obrigatórios', () => {
      // Teste sem nome
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: {
          email: 'teste@email.com',
          password: 'teste',
          administrador: 'true'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });

      // Teste sem email
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: {
          nome: 'Fulano da Silva',
          password: 'teste',
          administrador: 'true'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });

      // Teste sem password
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: {
          nome: 'Fulano da Silva',
          email: 'teste@email.com',
          administrador: 'true'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });

      // Teste sem administrador
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/usuarios',
        body: {
          nome: 'Fulano da Silva',
          email: 'teste@email.com',
          password: 'teste'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it('Deve validar formatos inválidos de email', () => {
      const invalidEmails = [
        'email-invalido',
        '@email.com',
        'email@',
        'email.com',
        'teste@',
        '@teste.com',
        'lucas..@',
        '.lucas@',
        '_lucas@', 
        '-lucas@',
        'lucas..rodrigues@',
        'lucas__rodrigues',
        'lucas..rodrigues..silva@',
        'lucas@@rodrigues@',
        'lucas..@@rodrigues@',
        'lucas__..rodrigues@'
      ];

      invalidEmails.forEach(email => {
        cy.request({
          method: 'POST',
          url: 'https://serverest.dev/usuarios',
          body: {
            nome: 'Fulano da Silva',
            email: email,
            password: 'teste',
            administrador: 'true'
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(400);
        });
      });
    });
  });
}); 