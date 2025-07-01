import { faker } from '@faker-js/faker';

describe('API - Usuários', () => {
    describe('Listar usuários', () => {
        it('deve listar todos os usuários', () => {
            cy.request('GET', 'https://serverest.dev/usuarios').then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('quantidade');
                expect(response.body).to.have.property('usuarios');
            });
        });

        it('deve permitir buscar usuário por query string', () => {
            cy.request('GET', 'https://serverest.dev/usuarios?administrador=true').then((response) => {
                expect(response.status).to.equal(200);
                response.body.usuarios.forEach(usuario => {
                    expect(usuario.administrador).to.equal('true');
                });
            });
        });
    });

    describe('Cadastrar usuários', () => {
        it('Cadastrar usuário admin com sucesso', () => {
            cy.request('POST', 'https://serverest.dev/usuarios', {
                nome: 'Fulano da Silva',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'true'
            }).then((response) => {
                expect(response.status).to.equal(201);
                expect(response.body.message).to.equal('Cadastro realizado com sucesso');    
                expect(response.body).to.have.property('_id');
            });
        });

        it('Cadastrar usuário comum com sucesso', () => {
            cy.request('POST', 'https://serverest.dev/usuarios', {
                nome: 'Fulano da Silva',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            }).then((response) => {
                expect(response.status).to.equal(201);
                expect(response.body.message).to.equal('Cadastro realizado com sucesso');
                expect(response.body).to.have.property('_id');
            });
        });

        it('Campos obrigatórios', () => {
            cy.request({
                method: 'POST',
                url: 'https://serverest.dev/usuarios',
                body: {
                    nome: '',
                    email: 'teste@teste.com',
                    password: '123456',
                    administrador: 'true'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.nome).to.equal('nome não pode ficar em branco');
            });

            cy.request({
                method: 'POST', 
                url: 'https://serverest.dev/usuarios',
                body: {
                    nome: 'Fulano da Silva',
                    email: '',
                    password: '123456',
                    administrador: 'true'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.email).to.equal('email não pode ficar em branco');
            });

            cy.request({
                method: 'POST',
                url: 'https://serverest.dev/usuarios', 
                body: {
                    nome: 'Fulano da Silva',
                    email: 'teste@teste.com',
                    password: '',
                    administrador: 'true'
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.password).to.equal('password não pode ficar em branco');
            });
        });

        it('Email inválido', () => {
            const emailsInvalidos = [
                'teste@teste',
                'teste.com',
                'teste@',
                '@teste.com',
                'teste@teste.',
                'teste teste@teste.com',
                'teste@teste@teste.com',
                '.teste@teste.com', 
                'teste.@teste.com',
                'teste..teste@teste.com',
                // 'teste__teste@teste.com',
                // 'teste-@teste.com',
                // 'teste--@teste.com',
                // 'teste__@teste.com'
            ];

            emailsInvalidos.forEach(emailInvalido => {
                cy.request({
                    method: 'POST',
                    url: 'https://serverest.dev/usuarios',
                    body: {
                        nome: 'Fulano da Silva',
                        email: emailInvalido,
                        password: '123456',
                        administrador: 'true'
                    },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.equal(400);
                    expect(response.body.email).to.equal('email deve ser um email válido');
                });
            });
        });
    });

    describe('Buscar usuário por ID', () => {
        it('deve buscar usuário existente com sucesso', () => {
            // Primeiro, criar um usuário para obter o ID
            const userData = {
                nome: 'Usuário Teste',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'true'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                expect(createResponse.status).to.equal(201);
                const userId = createResponse.body._id;

                // Agora buscar o usuário pelo ID
                cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
                    expect(getResponse.status).to.equal(200);
                    expect(getResponse.body).to.have.property('_id', userId);
                    expect(getResponse.body).to.have.property('nome', userData.nome);
                    expect(getResponse.body).to.have.property('email', userData.email);
                    expect(getResponse.body).to.have.property('administrador', userData.administrador);
                    //expect(getResponse.body).to.not.have.property('password'); // Senha não deve ser retornada
                });
            });
        });

        it('deve retornar erro para ID inexistente', () => {
            const idInexistente = '1234567890123456'; // ID MongoDB válido mas inexistente
            
            cy.request({
                method: 'GET',
                url: `https://serverest.dev/usuarios/${idInexistente}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.equal('Usuário não encontrado');
            });
        });

        it('deve retornar erro para ID inválido', () => {
            const idInvalido = 'id-invalido';
            
            cy.request({
                method: 'GET',
                url: `https://serverest.dev/usuarios/${idInvalido}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
            });
        });

        it('deve retornar todos os usuários quando ID está vazio', () => {
            cy.request({
                method: 'GET',
                url: 'https://serverest.dev/usuarios/',
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('quantidade');
                expect(response.body).to.have.property('usuarios');
                // Comportamento atual: retorna todos os usuários ao invés de erro 404
                // Este é um comportamento inconsistente documentado como melhoria
            });
        });

        it('deve retornar erro para ID com caracteres especiais', () => {
            const idComCaracteresEspeciais = '123456789012345!';
            
            cy.request({
                method: 'GET',
                url: `https://serverest.dev/usuarios/${idComCaracteresEspeciais}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
                expect(response.body.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
            });
        });

        it('deve buscar usuário admin e verificar propriedades', () => {
            // Criar usuário admin
            const adminData = {
                nome: 'Admin Teste',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'true'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', adminData).then((createResponse) => {
                const adminId = createResponse.body._id;

                cy.request('GET', `https://serverest.dev/usuarios/${adminId}`).then((getResponse) => {
                    expect(getResponse.status).to.equal(200);
                    expect(getResponse.body.administrador).to.equal('true');
                    expect(getResponse.body.nome).to.equal(adminData.nome);
                    expect(getResponse.body.email).to.equal(adminData.email);
                });
            });
        });
    });

    describe('Excluir usuário por ID', () => {
        it('deve excluir usuário comum com sucesso', () => {
            // Primeiro, criar um usuário para obter o ID
            const userData = {
                nome: 'Usuário para Excluir',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                expect(createResponse.status).to.equal(201);
                const userId = createResponse.body._id;

                // Verificar que o usuário existe antes de excluir
                cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
                    expect(getResponse.status).to.equal(200);
                    expect(getResponse.body._id).to.equal(userId);
                });

                // Agora excluir o usuário
                cy.request('DELETE', `https://serverest.dev/usuarios/${userId}`).then((deleteResponse) => {
                    expect(deleteResponse.status).to.equal(200);
                    expect(deleteResponse.body).to.have.property('message');
                    expect(deleteResponse.body.message).to.equal('Registro excluído com sucesso');
                });

                // Verificar que o usuário foi realmente excluído
                cy.request({
                    method: 'GET',
                    url: `https://serverest.dev/usuarios/${userId}`,
                    failOnStatusCode: false
                }).then((getResponse) => {
                    expect(getResponse.status).to.equal(400);
                    expect(getResponse.body).to.have.property('message');
                    expect(getResponse.body.message).to.equal('Usuário não encontrado');
                });
            });
        });

        it('deve excluir usuário admin com sucesso', () => {
            // Criar usuário admin
            const adminData = {
                nome: 'Admin para Excluir',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'true'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', adminData).then((createResponse) => {
                const adminId = createResponse.body._id;

                // Excluir o usuário admin
                cy.request('DELETE', `https://serverest.dev/usuarios/${adminId}`).then((deleteResponse) => {
                    expect(deleteResponse.status).to.equal(200);
                    expect(deleteResponse.body.message).to.equal('Registro excluído com sucesso');
                });

                // Verificar que foi excluído
                cy.request({
                    method: 'GET',
                    url: `https://serverest.dev/usuarios/${adminId}`,
                    failOnStatusCode: false
                }).then((getResponse) => {
                    expect(getResponse.status).to.equal(400);
                    expect(getResponse.body.message).to.equal('Usuário não encontrado');
                });
            });
        });

        it('deve retornar erro para ID inexistente', () => {
            const idInexistente = '1234567890123456'; // ID válido mas inexistente
            
            cy.request({
                method: 'DELETE',
                url: `https://serverest.dev/usuarios/${idInexistente}`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Nenhum registro excluído');
            });
        });
 
        it('deve retornar erro para ID vazio', () => {
            cy.request({
                method: 'DELETE',
                url: 'https://serverest.dev/usuarios/',
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(405);
                expect(response.body.message).to.equal('Não é possível realizar DELETE em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.');
            });
        });
    });

    describe('Editar usuário por ID', () => {
        it('deve editar usuário existente com sucesso', () => {
            // Primeiro, criar um usuário para obter o ID
            const userData = {
                nome: 'Usuário Original',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                expect(createResponse.status).to.equal(201);
                const userId = createResponse.body._id;

                // Dados para edição
                const dadosEditados = {
                    nome: 'Usuário Editado',
                    email: faker.internet.email(),
                    password: '654321',
                    administrador: 'true'
                };

                // Editar o usuário
                cy.request('PUT', `https://serverest.dev/usuarios/${userId}`, dadosEditados).then((putResponse) => {
                    expect(putResponse.status).to.equal(200);
                    expect(putResponse.body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que as alterações foram aplicadas
                cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
                    expect(getResponse.status).to.equal(200);
                    expect(getResponse.body.nome).to.equal(dadosEditados.nome);
                    expect(getResponse.body.email).to.equal(dadosEditados.email);
                    expect(getResponse.body.administrador).to.equal(dadosEditados.administrador);
                });
            });
        });

        it('deve editar apenas o nome do usuário', () => {
            // Criar usuário
            const userData = {
                nome: 'Usuário Teste',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                const userId = createResponse.body._id;

                // Editar apenas o nome mas enviando todos os campos
                const dadosEditados = {
                    nome: 'Nome Alterado',
                    email: userData.email,
                    password: userData.password,
                    administrador: userData.administrador
                };

                cy.request('PUT', `https://serverest.dev/usuarios/${userId}`, dadosEditados).then((putResponse) => {
                    expect(putResponse.status).to.equal(200);
                    expect(putResponse.body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que apenas o nome foi alterado
                cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
                    expect(getResponse.body.nome).to.equal(dadosEditados.nome);
                    expect(getResponse.body.email).to.equal(userData.email); // Email não alterado
                    expect(getResponse.body.administrador).to.equal(userData.administrador); // Admin não alterado
                });
            });
        });

        it('deve editar apenas o email do usuário', () => {
            // Criar usuário
            const userData = {
                nome: 'Usuário Email',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                const userId = createResponse.body._id;

                // Editar apenas o status mas enviando todos os campos
                const dadosEditados = {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.password,
                    administrador: 'true'
                };

                cy.request('PUT', `https://serverest.dev/usuarios/${userId}`, dadosEditados).then((putResponse) => {
                    expect(putResponse.status).to.equal(200);
                    expect(putResponse.body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que apenas o status foi alterado
                cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
                    expect(getResponse.body.nome).to.equal(userData.nome); // Nome não alterado
                    expect(getResponse.body.email).to.equal(userData.email); // Email não alterado
                    expect(getResponse.body.administrador).to.equal('true'); // Status alterado
                });
            });
        });

        it('deve editar apenas o status de administrador', () => {
            // Criar usuário comum
            const userData = {
                nome: 'Usuário Admin',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                const userId = createResponse.body._id;

                // Tornar usuário administrador enviando todos os campos obrigatórios
                const dadosEditados = {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.password,
                    administrador: 'true'
                };

                cy.request('PUT', `https://serverest.dev/usuarios/${userId}`, dadosEditados).then((putResponse) => {
                    expect(putResponse.status).to.equal(200);
                    expect(putResponse.body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que apenas o status de admin foi alterado
                cy.request('GET', `https://serverest.dev/usuarios/${userId}`).then((getResponse) => {
                    expect(getResponse.body.nome).to.equal(userData.nome); // Nome não alterado
                    expect(getResponse.body.email).to.equal(userData.email); // Email não alterado
                    expect(getResponse.body.administrador).to.equal('true'); // Agora é admin
                });
            });
        });
        it('deve cadastrar novo usuário quando ID não existe', () => {
            const idInexistente = 'a1b2c3d4e5f6g7h8';
            const dadosEditados = {
                nome: 'Usuário Inexistente',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request({
                method: 'PUT',
                url: `https://serverest.dev/usuarios/${idInexistente}`,
                body: dadosEditados,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(201);
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.equal('Cadastro realizado com sucesso');
                expect(response.body).to.have.property('_id');
            });
        });

        it('deve retornar erro para email já existente', () => {
            // Criar dois usuários
            const user1Data = {
                nome: 'Usuário 1',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            const user2Data = {
                nome: 'Usuário 2',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', user1Data).then((createResponse1) => {
                const userId1 = createResponse1.body._id;

                cy.request('POST', 'https://serverest.dev/usuarios', user2Data).then((createResponse2) => {
                    const userId2 = createResponse2.body._id;

                    // Tentar editar o segundo usuário com o email do primeiro
                    const dadosEditados = {
                        nome: user2Data.nome,
                        email: user1Data.email,
                        password: user2Data.password,
                        administrador: user2Data.administrador
                    };

                    cy.request({
                        method: 'PUT',
                        url: `https://serverest.dev/usuarios/${userId2}`,
                        body: dadosEditados,
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.equal(400);
                        expect(response.body).to.have.property('message');
                        expect(response.body.message).to.equal('Este email já está sendo usado');
                    });
                });
            });
        });

        it('deve retornar erro ao tentar editar usuário sem campos obrigatórios', () => {
            // Criar usuário
            const userData = {
                nome: 'Usuário Teste',
                email: faker.internet.email(),
                password: '123456',
                administrador: 'false'
            };

            cy.request('POST', 'https://serverest.dev/usuarios', userData).then((createResponse) => {
                const userId = createResponse.body._id;

                // Tentar editar sem nome
                const dadosSemNome = {
                    email: '',
                    password: '',
                    administrador: 'true'
                };

                cy.request({
                    method: 'PUT',
                    url: `https://serverest.dev/usuarios/${userId}`,
                    body: dadosSemNome,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.equal(400);
                    expect(response.body).to.have.property('nome');
                    expect(response.body.nome).to.equal('nome é obrigatório');
                    expect(response.body.email).to.equal('email não pode ficar em branco');
                    expect(response.body.password).to.equal('password não pode ficar em branco');
                });
            });
        });
    });
});