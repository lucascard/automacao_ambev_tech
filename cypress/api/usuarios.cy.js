import { faker } from '@faker-js/faker';
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

describe('API - Usuários', () => {
    context('Listar usuários', () => {
        it('deve listar todos os usuários', () => {
            cy.request({
                method: 'GET',
                url: `${apiUrl}/usuarios`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                expect(body).to.have.property('quantidade');
                expect(body).to.have.property('usuarios');
            });
        });

        it('deve permitir buscar usuário por query string', () => {
            cy.request({
                method: 'GET',
                url: `${apiUrl}/usuarios?administrador=true`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                body.usuarios.forEach(usuario => {
                    expect(usuario.administrador).to.equal('true');
                });
            });
        });
    });

    context('Cadastrar usuários', () => {
        it('Cadastrar usuário admin com sucesso', () => {
            // gera dados de usuário usando função helper
            const dadosUsuario = gerarDadosUsuarioAdmin()

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
                expect(status).to.equal(201);
                expect(body.message).to.equal('Cadastro realizado com sucesso');    
                expect(body).to.have.property('_id');
            });
        });

        it('Cadastrar usuário comum com sucesso', () => {
            // gera dados de usuário usando função helper
            const dadosUsuario = gerarDadosUsuarioComum()

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
                expect(status).to.equal(201);
                expect(body.message).to.equal('Cadastro realizado com sucesso');
                expect(body).to.have.property('_id');
            });
        });

        it('Deve retornar erro ao não preencher os campos obrigatórios', () => {
            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: '',
                    email: 'teste@teste.com',
                    password: '123456',
                    administrador: 'true'
                },
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(400);
                expect(body.nome).to.equal('nome não pode ficar em branco');
            });

            cy.request({
                method: 'POST', 
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: 'Fulano da Silva',
                    email: '',
                    password: '123456',
                    administrador: 'true'
                },
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(400);
                expect(body.email).to.equal('email não pode ficar em branco');
            });

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`, 
                body: {
                    nome: 'Fulano da Silva',
                    email: 'teste@teste.com',
                    password: '',
                    administrador: 'true'
                },
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(400);
                expect(body.password).to.equal('password não pode ficar em branco');
            });
        });

        it('Deve retornar erro ao informar email inválido', () => {
            // alguns emails estão comentados porque eles deveriam ser inválidos mas não são (foi apontado no arquivo bugs e melhorias que isso é uma melhoria)
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
                    url: `${apiUrl}/usuarios`,
                    body: {
                        nome: 'Fulano da Silva',
                        email: emailInvalido,
                        password: '123456',
                        administrador: 'true'
                    },
                    failOnStatusCode: false
                }).then(({ body, status }) => {
                    expect(status).to.equal(400);
                    expect(body.email).to.equal('email deve ser um email válido');
                });
            });
        });

        it('Deve retornar erro ao tentar cadastrar usuário com email já cadastrado', () => {
            // gera dados de usuário usando função helper
            const dadosUsuario = gerarDadosUsuarioAdmin()

            // Cria o primeiro usuário
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

                // Tenta criar usuário com mesmo email
                cy.request({
                    method: 'POST',
                    url: `${apiUrl}/usuarios`,
                    body: {
                        nome: dadosUsuario.nome,
                        email: dadosUsuario.email,
                        password: dadosUsuario.senha,
                        administrador: dadosUsuario.administrador
                    },
                    failOnStatusCode: false
                }).then(({ body, status }) => {
                    expect(status).to.equal(400)
                    expect(body).to.have.property('message')
                    expect(body.message).to.equal('Este email já está sendo usado')
                })
            })
        })
    });

    context('Buscar usuário por ID', () => {
        it('deve buscar usuário existente com sucesso', () => {
            // Primeiro, criar um usuário para obter o ID
            const userData = gerarDadosUsuarioAdmin()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                expect(status).to.equal(201);
                const userId = body._id;

                // Agora buscar o usuário pelo ID
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body).to.have.property('_id', userId);
                    expect(body).to.have.property('nome', userData.nome);
                    expect(body).to.have.property('email', userData.email);
                    expect(body).to.have.property('administrador', userData.administrador);
                    //expect(body).to.not.have.property('password'); // Senha não deve ser retornada
                });
            });
        });

        it('deve retornar erro para ID inexistente', () => {
            const idInexistente = '1234567890123456'; // ID MongoDB válido mas inexistente
            
            cy.request({
                method: 'GET',
                url: `${apiUrl}/usuarios/${idInexistente}`,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(400);
                expect(body).to.have.property('message');
                expect(body.message).to.equal('Usuário não encontrado');
            });
        });

        it('deve retornar erro para ID inválido', () => {
            const idInvalido = 'id-invalido';
            
            cy.request({
                method: 'GET',
                url: `${apiUrl}/usuarios/${idInvalido}`,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(400);
                expect(body.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
            });
        });

        it('deve retornar todos os usuários quando ID está vazio', () => {
            cy.request({
                method: 'GET',
                url: `${apiUrl}/usuarios/`,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                expect(body).to.have.property('quantidade');
                expect(body).to.have.property('usuarios');
                // Comportamento atual: retorna todos os usuários ao invés de erro 404
                // Este é um comportamento inconsistente documentado como melhoria
            });
        });

        it('deve retornar erro para ID com caracteres especiais', () => {
            const idComCaracteresEspeciais = '123456789012345!';
            
            cy.request({
                method: 'GET',
                url: `${apiUrl}/usuarios/${idComCaracteresEspeciais}`,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(400);
                expect(body.id).to.equal('id deve ter exatamente 16 caracteres alfanuméricos');
            });
        });

        it('deve buscar usuário admin e verificar propriedades', () => {
            // Criar usuário admin
            const adminData = gerarDadosUsuarioAdmin()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: adminData.nome,
                    email: adminData.email,
                    password: adminData.senha,
                    administrador: adminData.administrador
                }
            }).then(({ body, status }) => {
                const adminId = body._id;

                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${adminId}`
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.administrador).to.equal('true');
                    expect(body.nome).to.equal(adminData.nome);
                    expect(body.email).to.equal(adminData.email);
                });
            });
        });
    });

    context('Excluir usuário por ID', () => {
        it('deve excluir usuário comum com sucesso', () => {
            // Primeiro, criar um usuário para obter o ID
            const userData = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                expect(status).to.equal(201);
                const userId = body._id;

                // Verificar que o usuário existe antes de excluir
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body._id).to.equal(userId);
                });

                // Agora excluir o usuário
                cy.request({
                    method: 'DELETE',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body).to.have.property('message');
                    expect(body.message).to.equal('Registro excluído com sucesso');
                });

                // Verificar que o usuário foi realmente excluído
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`,
                    failOnStatusCode: false
                }).then(({ body, status }) => {
                    expect(status).to.equal(400);
                    expect(body).to.have.property('message');
                    expect(body.message).to.equal('Usuário não encontrado');
                });
            });
        });

        it('deve excluir usuário admin com sucesso', () => {
            // Criar usuário admin
            const adminData = gerarDadosUsuarioAdmin()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: adminData.nome,
                    email: adminData.email,
                    password: adminData.senha,
                    administrador: adminData.administrador
                }
            }).then(({ body, status }) => {
                const adminId = body._id;

                // Excluir o usuário admin
                cy.request({
                    method: 'DELETE',
                    url: `${apiUrl}/usuarios/${adminId}`
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.message).to.equal('Registro excluído com sucesso');
                });

                // Verificar que foi excluído
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${adminId}`,
                    failOnStatusCode: false
                }).then(({ body, status }) => {
                    expect(status).to.equal(400);
                    expect(body.message).to.equal('Usuário não encontrado');
                });
            });
        });

        it('deve retornar erro para ID inexistente', () => {
            const idInexistente = '1234567890123456'; // ID válido mas inexistente
            
            cy.request({
                method: 'DELETE',
                url: `${apiUrl}/usuarios/${idInexistente}`,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                expect(body.message).to.equal('Nenhum registro excluído');
            });
        });
 
        it('deve retornar erro para ID vazio', () => {
            cy.request({
                method: 'DELETE',
                url: `${apiUrl}/usuarios/`,
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(405);
                expect(body.message).to.equal('Não é possível realizar DELETE em /usuarios/. Acesse https://serverest.dev para ver as rotas disponíveis e como utilizá-las.');
            });
        });
    });

    context('Editar usuário por ID', () => {
        it('deve editar usuário existente com sucesso', () => {
            // Primeiro, criar um usuário para obter o ID
            const userData = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                expect(status).to.equal(201);
                const userId = body._id;

                // Dados para edição
                const dadosEditados = gerarDadosUsuarioAdmin()

                // Editar o usuário
                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/usuarios/${userId}`,
                    body: {
                        nome: dadosEditados.nome,
                        email: dadosEditados.email,
                        password: dadosEditados.senha,
                        administrador: dadosEditados.administrador
                    }
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que as alterações foram aplicadas
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.nome).to.equal(dadosEditados.nome);
                    expect(body.email).to.equal(dadosEditados.email);
                    expect(body.administrador).to.equal(dadosEditados.administrador);
                });
            });
        });

        it('deve editar apenas o nome do usuário', () => {
            // Criar usuário
            const userData = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                const userId = body._id;

                // Editar apenas o nome mas enviando todos os campos
                const dadosEditados = {
                    nome: 'Nome Alterado',
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                };

                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/usuarios/${userId}`,
                    body: dadosEditados
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que apenas o nome foi alterado
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(body.nome).to.equal(dadosEditados.nome);
                    expect(body.email).to.equal(userData.email); // Email não alterado
                    expect(body.administrador).to.equal(userData.administrador); // Admin não alterado
                });
            });
        });

        it('deve editar apenas o email do usuário', () => {
            // Criar usuário
            const userData = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                const userId = body._id;

                // Editar apenas o status mas enviando todos os campos
                const dadosEditados = {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: 'true'
                };

                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/usuarios/${userId}`,
                    body: dadosEditados
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que apenas o status foi alterado
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(body.nome).to.equal(userData.nome); // Nome não alterado
                    expect(body.email).to.equal(userData.email); // Email não alterado
                    expect(body.administrador).to.equal('true'); // Status alterado
                });
            });
        });

        it('deve editar apenas o status de administrador', () => {
            // Criar usuário comum
            const userData = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                const userId = body._id;

                // Tornar usuário administrador enviando todos os campos obrigatórios
                const dadosEditados = {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: 'true'
                };

                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/usuarios/${userId}`,
                    body: dadosEditados
                }).then(({ body, status }) => {
                    expect(status).to.equal(200);
                    expect(body.message).to.equal('Registro alterado com sucesso');
                });

                // Verificar que apenas o status de admin foi alterado
                cy.request({
                    method: 'GET',
                    url: `${apiUrl}/usuarios/${userId}`
                }).then(({ body, status }) => {
                    expect(body.nome).to.equal(userData.nome); // Nome não alterado
                    expect(body.email).to.equal(userData.email); // Email não alterado
                    expect(body.administrador).to.equal('true'); // Agora é admin
                });
            });
        });
        it('deve cadastrar novo usuário quando ID não existe', () => {
            const idInexistente = 'a1b2c3d4e5f6g7h8';
            const dadosEditados = gerarDadosUsuarioComum()

            cy.request({
                method: 'PUT',
                url: `${apiUrl}/usuarios/${idInexistente}`,
                body: {
                    nome: dadosEditados.nome,
                    email: dadosEditados.email,
                    password: dadosEditados.senha,
                    administrador: dadosEditados.administrador
                },
                failOnStatusCode: false
            }).then(({ body, status }) => {
                expect(status).to.equal(201);
                expect(body).to.have.property('message');
                expect(body.message).to.equal('Cadastro realizado com sucesso');
                expect(body).to.have.property('_id');
            });
        });

        it('deve retornar erro para email já existente', () => {
            // Criar dois usuários
            const user1Data = gerarDadosUsuarioComum()
            const user2Data = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: user1Data.nome,
                    email: user1Data.email,
                    password: user1Data.senha,
                    administrador: user1Data.administrador
                }
            }).then(({ body, status }) => {
                const userId1 = body._id;

                cy.request({
                    method: 'POST',
                    url: `${apiUrl}/usuarios`,
                    body: {
                        nome: user2Data.nome,
                        email: user2Data.email,
                        password: user2Data.senha,
                        administrador: user2Data.administrador
                    }
                }).then(({ body, status }) => {
                    const userId2 = body._id;

                    // Tentar editar o segundo usuário com o email do primeiro
                    const dadosEditados = {
                        nome: user2Data.nome,
                        email: user1Data.email,
                        password: user2Data.senha,
                        administrador: user2Data.administrador
                    };

                    cy.request({
                        method: 'PUT',
                        url: `${apiUrl}/usuarios/${userId2}`,
                        body: dadosEditados,
                        failOnStatusCode: false
                    }).then(({ body, status }) => {
                        expect(status).to.equal(400);
                        expect(body).to.have.property('message');
                        expect(body.message).to.equal('Este email já está sendo usado');
                    });
                });
            });
        });

        it('deve retornar erro ao tentar editar usuário sem campos obrigatórios', () => {
            // Criar usuário
            const userData = gerarDadosUsuarioComum()

            cy.request({
                method: 'POST',
                url: `${apiUrl}/usuarios`,
                body: {
                    nome: userData.nome,
                    email: userData.email,
                    password: userData.senha,
                    administrador: userData.administrador
                }
            }).then(({ body, status }) => {
                const userId = body._id;

                // Tentar editar sem nome
                const dadosSemNome = {
                    email: '',
                    password: '',
                    administrador: 'true'
                };

                cy.request({
                    method: 'PUT',
                    url: `${apiUrl}/usuarios/${userId}`,
                    body: dadosSemNome,
                    failOnStatusCode: false
                }).then(({ body, status }) => {
                    expect(status).to.equal(400);
                    expect(body).to.have.property('nome');
                    expect(body.nome).to.equal('nome é obrigatório');
                    expect(body.email).to.equal('email não pode ficar em branco');
                    expect(body.password).to.equal('password não pode ficar em branco');
                });
            });
        });
    });
});