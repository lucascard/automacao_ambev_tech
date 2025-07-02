import { faker } from '@faker-js/faker';
const apiUrl = Cypress.env('apiUrl');

describe('API - Produtos', () => {
    it('deve listar todos os produtos', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            expect(status).to.equal(200);
            expect(body).to.have.property('quantidade');
            expect(body).to.have.property('produtos');
            expect(body.produtos).to.be.an('array');
        });
    });

    it('deve buscar produto por ID', () => {
        // Primeiro, obter um produto existente
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            const produto = body.produtos[0];
            cy.request({
                method: 'GET',
                url: `${apiUrl}/produtos?_id=${produto._id}`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                expect(body.produtos[0]._id).to.equal(produto._id);
            });
        });
    });

    it('deve buscar produto por nome', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            const produto = body.produtos[0];
            cy.request({
                method: 'GET',
                url: `${apiUrl}/produtos?nome=${encodeURIComponent(produto.nome)}`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                expect(body.produtos[0].nome).to.equal(produto.nome);
            });
        });
    });

    it('deve buscar produto por preço', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            const produto = body.produtos[0];
            cy.request({
                method: 'GET',
                url: `${apiUrl}/produtos?preco=${produto.preco}`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                body.produtos.forEach(p => {
                    expect(p.preco).to.equal(produto.preco);
                });
            });
        });
    });

    it('deve buscar produto por descrição', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            const produto = body.produtos[0];
            cy.request({
                method: 'GET',
                url: `${apiUrl}/produtos?descricao=${encodeURIComponent(produto.descricao)}`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                body.produtos.forEach(p => {
                    expect(p.descricao).to.equal(produto.descricao);
                });
            });
        });
    });

    it('deve buscar produto por quantidade', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            const produto = body.produtos[0];
            cy.request({
                method: 'GET',
                url: `${apiUrl}/produtos?quantidade=${produto.quantidade}`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                body.produtos.forEach(p => {
                    expect(p.quantidade).to.equal(produto.quantidade);
                });
            });
        });
    });

    it('deve buscar produto com múltiplos filtros combinados', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos`
        }).then(({ body, status }) => {
            const produto = body.produtos[0];
            const query = `?_id=${produto._id}&nome=${encodeURIComponent(produto.nome)}&preco=${produto.preco}&descricao=${encodeURIComponent(produto.descricao)}&quantidade=${produto.quantidade}`;
            cy.request({
                method: 'GET',
                url: `${apiUrl}/produtos${query}`
            }).then(({ body, status }) => {
                expect(status).to.equal(200);
                expect(body.produtos[0]._id).to.equal(produto._id);
                expect(body.produtos[0].nome).to.equal(produto.nome);
                expect(body.produtos[0].preco).to.equal(produto.preco);
                expect(body.produtos[0].descricao).to.equal(produto.descricao);
                expect(body.produtos[0].quantidade).to.equal(produto.quantidade);
            });
        });
    });

    it('deve retornar lista vazia ao buscar produto inexistente', () => {
        cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos?nome=ProdutoInexistente123456`
        }).then(({ body, status }) => {
            expect(status).to.equal(200);
            expect(body.produtos).to.be.an('array').that.is.empty;
        });
    });
}); 