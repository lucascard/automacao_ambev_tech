const API_URL = Cypress.env('apiUrl');

Cypress.Commands.add('login', (email = null, password = null) => {
  // Função para criar um usuário, com tratamento de erro
  const criarUsuario = () => {
    const primeiroNome = Cypress._.random(1000, 9999).toString();
    const ultimoNome = Cypress._.random(1000, 9999).toString();
    const usuarioEmail = email || `usuario${primeiroNome}.${ultimoNome}@serverest.com`;
    const usuarioSenha = password || `senha${Cypress._.random(1000, 9999)}`;

    return cy.request({
      method: 'POST',
      url: `${API_URL}/usuarios`,
      body: {
        nome: `Usuário ${primeiroNome} ${ultimoNome}`,
        email: usuarioEmail,
        password: usuarioSenha,
        administrador: 'false'
      }
    }).then((response) => {
      expect(response.status).to.equal(201, `Falha ao criar usuário com email ${usuarioEmail}. Status: ${response.status}, Body: ${JSON.stringify(response.body)}`);
      return { email: usuarioEmail, password: usuarioSenha };
    });
  };

  // Função de setup para cy.session
  const setup = () => {
    let finalEmail = email;
    let finalPassword = password;

    // Se não houver credenciais, cria um novo usuário
    if (!email || !password) {
      return criarUsuario().then(({ email: userEmail, password: userPassword }) => {
        finalEmail = userEmail;
        finalPassword = userPassword;
      }).then(() => {
        return cy.request({
          method: 'POST',
          url: `${API_URL}/login`,
          body: {
            email: finalEmail,
            password: finalPassword
          }
        }).then((response) => {
          expect(response.status).to.eq(200, `Falha ao fazer login com email ${finalEmail}. Status: ${response.status}, Body: ${JSON.stringify(response.body)}`);
          cy.window().then((win) => {
            win.localStorage.setItem('serverest/userEmail', finalEmail);
            win.localStorage.setItem('serverest/userToken', response.body.authorization);
          });
        });
      });
    } else {
      // Se credenciais foram fornecidas, usa elas diretamente
      return cy.request({
        method: 'POST',
        url: `${API_URL}/login`,
        body: {
          email: finalEmail,
          password: finalPassword
        }
      }).then((response) => {
        expect(response.status).to.eq(200, `Falha ao fazer login com email ${finalEmail}. Status: ${response.status}, Body: ${JSON.stringify(response.body)}`);
        cy.window().then((win) => {
          win.localStorage.setItem('serverest/userEmail', finalEmail);
          win.localStorage.setItem('serverest/userToken', response.body.authorization);
        });
      });
    }
  };

  // Configura a sessão usando o email como chave (ou fallback único)
  const sessionKey = email || `temp_user_${Cypress._.random(100000, 999999)}`;
  cy.session(sessionKey, setup, {
    validate: () => {
      cy.request({ method: 'GET', url: `${API_URL}/produtos`, failOnStatusCode: false })
        .its('status')
        .should('be.oneOf', [200, 401]);
    }
  });
});