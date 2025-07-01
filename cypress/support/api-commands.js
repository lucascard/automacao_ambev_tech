// Comandos específicos para testes de API
Cypress.Commands.add('apiRequest', (method, endpoint, body = null, headers = {}) => {
  const baseUrl = Cypress.env('apiBaseUrl');
  
  return cy.request({
    method: method,
    url: `${baseUrl}${endpoint}`,
    body: body,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    failOnStatusCode: false
  });
});

// Comando para validar resposta contra Swagger
Cypress.Commands.add('validateSwaggerSchema', (response, schemaPath) => {
  // Aqui você pode implementar validação contra o schema do Swagger
  cy.fixture('api/swagger.json').then((swagger) => {
    // Implementar validação do schema
    expect(response.status).to.be.oneOf([200, 201, 204]);
  });
});

// Comando para login via API
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request('POST', `https://serverest.dev/login`, {
    email,
    password
  }).then((response) => {
    cy.wrap(response.body.authorization).as('authToken');
    return response;
  });
});


// Comando para criar usuário via API
Cypress.Commands.add('apiCreateUser', (userData) => {
  return cy.apiRequest('POST', 'https://serverest.dev/usuarios', userData);
});

// Comando para obter token de autenticação
Cypress.Commands.add('getAuthToken', () => {
  return cy.get('@authToken');
});

// Comando para requisições autenticadas
Cypress.Commands.add('authenticatedRequest', (method, endpoint, body = null) => {
  return cy.getAuthToken().then((token) => {
    return cy.apiRequest(method, endpoint, body, {
      'Authorization': token
    });
  });
}); 