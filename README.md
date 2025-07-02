# Automação Ambev Tech

Projeto de automação de testes E2E e API utilizando Cypress

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação
```bash
npm install
```

### Executar Testes

#### Todos os Testes
```bash
npm run test:all
```

#### Apenas Testes E2E
```bash
npm run test:e2e
```

#### Apenas Testes de API
```bash
npm run test:api
```

#### Modo Interativo
```bash
npm run cypress:open
```

#### Navegadores Específicos
```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

## 📋 Tipos de Testes

### 1. Testes E2E (End-to-End)
- Localizados em `cypress/e2e/`
- Testam o fluxo completo da aplicação
- Simulam ações do usuário real
- Capturam screenshots e vídeos automaticamente

### 2. Testes de API
- Localizados em `cypress/api/`
- Testam endpoints diretamente
- Validação de status codes e respostas
- Autenticação e autorização

## 📝 Cenários de Teste

Todos os cenários automatizados estão documentados em [docs/testes/CENARIOS_TESTE.md](docs/testes/CENARIOS_TESTE.md).

**Total:** 43 cenários de teste
- **E2E:** 17 cenários
- **API:** 26 cenários

## 📊 Geração de Dados

O projeto utiliza `@faker-js/faker` para gerar dados de teste dinâmicos:

## 🔧 Configuração

### Configurações do Cypress
- Viewport: 1920x1080
- Screenshots automáticos em falhas
- Vídeos gravados automaticamente
- Tratamento de exceções não capturadas

## 🎯 Boas Práticas

1. **Separação de Responsabilidades**: E2E e API em pastas separadas
3. **Dados Dinâmicos**: Uso do Faker para dados de teste
5. **Organização**: Estrutura clara e intuitiva
6. **Documentação**: README detalhado e comentários no código

## 📈 Relatórios

Os testes geram automaticamente:
- Screenshots em caso de falha
- Vídeos da execução
- Logs detalhados
- Relatórios de cobertura (se configurado)

## Dependências

```bash
# Dependências de desenvolvimento
cypress: ^14.5.0
@faker-js/faker: ^9.8.0
```

## Licença

Este projeto está sob a licença MIT. 