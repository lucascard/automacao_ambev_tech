# Automação Ambev Tech

Projeto de automação de testes usando Cypress para a aplicação ServeRest.

## Configuração

- **Base URL**: https://front.serverest.dev/login
- **Framework**: Cypress
- **Linguagem**: JavaScript
- **Geração de dados**: @faker-js/faker

## Dependências

```bash
# Dependências de desenvolvimento
cypress: ^14.5.0
@faker-js/faker: ^9.8.0
```

## Como executar os testes

```bash
# Instalar dependências
npm install

# Executar testes no modo headless
npm run cypress:run

# Executar testes no modo interativo
npm run cypress:open
```

## Estrutura do projeto

```
cypress/
├── e2e/
│   ├── cadastro.cy.js    # Testes de cadastro
│   └── login.cy.js       # Testes de login
├── fixtures/
│   └── example.json
└── support/
    ├── commands.js
    └── e2e.js
```

## Testes implementados

### Cadastro de usuário
- Validação de campos obrigatórios
- Verificação de mensagens de erro
- Navegação para tela de login
- Cadastro de usuário com sucesso
- Cadastro de usuário admin com sucesso

## Funcionalidades da aplicação

### 1. Usuário Administrador

#### 1.1 Navegação na Topbar
- **Home**: Página inicial do sistema
- **Cadastrar usuários**: Formulário para criar novos usuários
- **Listar usuários**: Visualização de todos os usuários cadastrados
- **Cadastrar produtos**: Formulário para adicionar novos produtos
- **Listar produtos**: Visualização de todos os produtos cadastrados
- **Relatórios**: Acesso a relatórios e estatísticas do sistema

#### 1.2 Interface do usuário
- **Bem-vindo**: Exibe "Bem vindo (Nome do usuário)" na interface
- **Cards de funcionalidades**: Apresenta cards visuais para cada funcionalidade do CRUD
- **Acesso completo**: Permissões totais para gerenciar usuários, produtos e visualizar relatórios

### 2. Usuário Não Administrador

#### 2.1 Navegação na Topbar
- **Home**: Página inicial do sistema
- **Lista de compras**: Visualização dos produtos disponíveis para compra
- **Carrinho**: Gerenciamento dos itens selecionados para compra

#### 2.2 Interface do usuário
- **Produtos disponíveis**: Visualização de todos os produtos cadastrados no sistema
- **Adicionar à lista**: Opção para adicionar produtos à lista de compras
- **Funcionalidades limitadas**: Acesso restrito apenas às funcionalidades de compra

## Geração de dados com Faker

O projeto utiliza a biblioteca **@faker-js/faker** para gerar dados aleatórios nos testes, garantindo:

- **Dados únicos**: Cada execução de teste usa dados diferentes
- **Realismo**: Dados que simulam informações reais de usuários
- **Flexibilidade**: Fácil geração de emails, nomes, senhas e outros dados

### Exemplo de uso do Faker:

```javascript
import { faker } from '@faker-js/faker';

// Gerar dados para teste
const userData = {
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  senha: faker.internet.password()
};
```

## Melhorias sugeridas

### 1. Padronização de idioma
**Deixar como língua padrão o português ou inglês**

Exemplo de inconsistência atual:
- Mensagem de erro ao não preencher a senha no cadastro: "Password é obrigatório"

**Recomendações:**
- Padronizar todas as mensagens em português brasileiro
- Ou padronizar todas as mensagens em inglês
- Manter consistência em toda a aplicação

### 2. Melhorias de acessibilidade
- Adicionar atributos `aria-label` nos campos de formulário
- Implementar navegação por teclado
- Adicionar contraste adequado nas mensagens de erro

### 3. Melhorias de UX
- Adicionar validação em tempo real nos campos
- Implementar feedback visual mais claro para erros
- Adicionar tooltips explicativos nos campos obrigatórios

### 4. Melhorias de teste
- Adicionar testes para diferentes cenários de cadastro
- Implementar testes de regressão visual
- Adicionar testes de performance
- Criar testes para validação de formato de email
- Implementar testes para senha forte/fraca

### 5. Melhorias técnicas
- Implementar Page Object Model
- Adicionar relatórios de teste mais detalhados
- Configurar CI/CD pipeline
- Adicionar testes em diferentes navegadores
- Implementar testes de API

### 6. Documentação
- Criar documentação técnica detalhada
- Adicionar exemplos de uso
- Documentar padrões de teste utilizados

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 