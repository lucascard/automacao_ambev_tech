import { faker } from '@faker-js/faker/locale/pt_BR';

// Gerador de dados de teste usando Faker
export class DataGenerator {
  
  // Gera dados de usuário válidos
  static generateValidUser() {
    return {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
      administrador: 'true'
    };
  }

  // Gera dados de produto válidos
  static generateValidProduct() {
    return {
      nome: faker.commerce.productName(),
      preco: parseInt(faker.commerce.price({ min: 1, max: 1000 })),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 100 })
    };
  }

  // Gera email único
  static generateUniqueEmail() {
    return faker.internet.email({
      provider: 'test.com',
      suffix: Date.now().toString()
    });
  }

  // Gera dados de login
  static generateLoginData() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 })
    };
  }

  // Gera dados para teste de validação
  static generateInvalidData() {
    return {
      emptyUser: {
        nome: '',
        email: '',
        password: '',
        administrador: ''
      },
      invalidEmail: {
        nome: faker.person.fullName(),
        email: 'email-invalido',
        password: faker.internet.password({ length: 6 }),
        administrador: 'true'
      },
      shortPassword: {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: '123',
        administrador: 'true'
      }
    };
  }

  // Gera dados para teste de produtos
  static generateProductTestData() {
    return {
      validProduct: this.generateValidProduct(),
      invalidProduct: {
        nome: '',
        preco: -1,
        descricao: '',
        quantidade: -1
      },
      expensiveProduct: {
        nome: faker.commerce.productName(),
        preco: 999999,
        descricao: faker.commerce.productDescription(),
        quantidade: 1
      }
    };
  }
}

// Disponibiliza globalmente para uso nos testes
window.DataGenerator = DataGenerator; 