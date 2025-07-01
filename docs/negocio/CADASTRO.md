# Regras de Negócio - Cadastro

Este documento define as regras de negócio para o processo de cadastro de usuários.

## 1. Campo Email

### 1.1 Validações de Formato
- **1.1.1** Não pode conter `.`, `-` ou `_` no começo ou no fim do corpo do email
  - ❌ `.lucas@email.com`
  - ❌ `lucas.@email.com`
  - ❌ `-lucas@email.com`
  - ❌ `lucas-@email.com`
  - ❌ `_lucas@email.com`
  - ❌ `lucas_@email.com`
  - ✅ `lucas@email.com`

- **1.1.2** Não pode conter `.`, `-` ou `_` juntos (consecutivos)
  - ❌ `lucas..rodrigues@email.com`
  - ❌ `lucas__rodrigues@email.com`
  - ❌ `lucas--rodrigues@email.com`
  - ❌ `lucas._rodrigues@email.com`
  - ❌ `lucas.-rodrigues@email.com`
  - ✅ `lucas.rodrigues@email.com`
  - ✅ `lucas_rodrigues@email.com`
  - ✅ `lucas-rodrigues@email.com`

- **1.1.3** Deve seguir a máscara `texto@texto.texto`
  - ❌ `lucas@email`
  - ❌ `lucas@.com`
  - ❌ `@email.com`
  - ❌ `lucas@email.`
  - ✅ `lucas@email.com`
  - ✅ `lucas@email.com.br`
  - ✅ `lucas@email.co.uk`

## 2. Campo Nome

### 2.1 Validações de Formato
- **2.1.1** Pode conter apenas 1 caracter
  - ✅ `A`
  - ✅ `1` 
  - ✅ `!`

## 3. Campo Senha

- Aceita qualquer formato ou caracter
- É um campo obrigatório

## 4. Validações Gerais

### 4.1 Campos Obrigatórios
- Todos os campos (nome, email, senha) são obrigatórios
- Não é possível cadastrar com campos vazios

### 4.2 Unicidade de Email
- Cada email pode ser cadastrado apenas uma vez
- Não é possível cadastrar dois usuários com o mesmo email

### 4.3 Tipo de Usuário
- Usuário pode ser cadastrado como normal ou administrador
- A opção "Cadastrar como administrador" é opcional

---

*Nota: Estas regras devem ser validadas tanto no frontend quanto no backend.* 