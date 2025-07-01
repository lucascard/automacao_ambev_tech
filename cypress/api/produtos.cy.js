import { faker } from '@faker-js/faker';

describe('API - Produtos', () => {
    it('deve listar todos os produtos', () => {
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('quantidade');
            expect(response.body).to.have.property('produtos');
            expect(response.body.produtos).to.be.an('array');
        });
    });

    it('deve buscar produto por ID', () => {
        // Primeiro, obter um produto existente
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            const produto = response.body.produtos[0];
            cy.request('GET', `https://serverest.dev/produtos?_id=${produto._id}`).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.produtos[0]._id).to.equal(produto._id);
            });
        });
    });

    it('deve buscar produto por nome', () => {
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            const produto = response.body.produtos[0];
            cy.request('GET', `https://serverest.dev/produtos?nome=${encodeURIComponent(produto.nome)}`).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.produtos[0].nome).to.equal(produto.nome);
            });
        });
    });

    it('deve buscar produto por preço', () => {
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            const produto = response.body.produtos[0];
            cy.request('GET', `https://serverest.dev/produtos?preco=${produto.preco}`).then((res) => {
                expect(res.status).to.equal(200);
                res.body.produtos.forEach(p => {
                    expect(p.preco).to.equal(produto.preco);
                });
            });
        });
    });

    it('deve buscar produto por descrição', () => {
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            const produto = response.body.produtos[0];
            cy.request('GET', `https://serverest.dev/produtos?descricao=${encodeURIComponent(produto.descricao)}`).then((res) => {
                expect(res.status).to.equal(200);
                res.body.produtos.forEach(p => {
                    expect(p.descricao).to.equal(produto.descricao);
                });
            });
        });
    });

    it('deve buscar produto por quantidade', () => {
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            const produto = response.body.produtos[0];
            cy.request('GET', `https://serverest.dev/produtos?quantidade=${produto.quantidade}`).then((res) => {
                expect(res.status).to.equal(200);
                res.body.produtos.forEach(p => {
                    expect(p.quantidade).to.equal(produto.quantidade);
                });
            });
        });
    });

    it('deve buscar produto com múltiplos filtros combinados', () => {
        cy.request('GET', 'https://serverest.dev/produtos').then((response) => {
            const produto = response.body.produtos[0];
            const query = `?_id=${produto._id}&nome=${encodeURIComponent(produto.nome)}&preco=${produto.preco}&descricao=${encodeURIComponent(produto.descricao)}&quantidade=${produto.quantidade}`;
            cy.request('GET', `https://serverest.dev/produtos${query}`).then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body.produtos[0]._id).to.equal(produto._id);
                expect(res.body.produtos[0].nome).to.equal(produto.nome);
                expect(res.body.produtos[0].preco).to.equal(produto.preco);
                expect(res.body.produtos[0].descricao).to.equal(produto.descricao);
                expect(res.body.produtos[0].quantidade).to.equal(produto.quantidade);
            });
        });
    });

    it('deve retornar lista vazia ao buscar produto inexistente', () => {
        cy.request('GET', 'https://serverest.dev/produtos?nome=ProdutoInexistente123456').then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.produtos).to.be.an('array').that.is.empty;
        });
    });
}); 