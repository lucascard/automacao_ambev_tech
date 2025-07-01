# Bugs e Melhorias Encontrados

Este arquivo documenta os bugs e melhorias identificados durante a execução dos testes automatizados.

## BUG-001: VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS COM EMAIL MODIFICADO

### Descrição
Ao tentar cadastrar um usuário que já está cadastrado no bd, é acusado o erro "Email já está sendo usado", mas quando adicionado um caractere aleatório (tornando o email válido), o sistema então acusa que os campos nome e senha não estão preenchidos, mesmo estando preenchidos corretamente.

### Passos para Reproduzir
1. Acessar a tela de cadastro
2. Preencher nome, email (de um usuário já cadastrado) e senha
3. Clicar em cadastrar
4. Receber mensagem "email já está sendo usado"
5. Modificar o email adicionando um caractere aleatório
6. Clicar em cadastrar novamente
7. Sistema acusa que nome e senha não estão preenchidos

### Comportamento Esperado
- Ao modificar o email para um não cadastrado, o sistema deveria permitir o cadastro normalmente
- Os campos nome e senha deveriam manter seus valores preenchidos

### Comportamento Atual
- Sistema valida incorretamente que não tem dados no campo.
- Exibe mensagens de erro incorretas para campos obrigatórios

### Evidência
<div style="text-align: center">
<img src="evidencias_bug/bug01-VALIDACAO_DE_CAMPOS_OBRIGATORIOS_COM_EMAIL_MODIFICADO.png"  width="500" alt="Evidência do Bug 01 - Validação de Campos Obrigatórios com Email Modificado">
</div>

### Status
- [ ] Reproduzido
- [ ] Reportado
- [ ] Em análise
- [ ] Corrigido
- [ ] Testado

## BUG-002: VALIDAÇÃO DE EMAIL COM CARACTERES ESPECIAIS

### Descrição
O sistema não está validando corretamente endereços de email conforme especificação RFC 5322. Emails inválidos que são aceitos:
- `-teste@gmail.com` (começa com hífen)
- `_teste@gmail.com` (começa com underscore)
- `teste-@gmail.com` (termina com hífen)
- `teste--@gmail.com` (termina com hífens consecutivos)
- `teste__@gmail.com` (termina com underscores consecutivos)

### Passos para Reproduzir
1. Acessar a tela de cadastro
2. Preencher nome e senha
3. Inserir um dos emails inválidos listados acima
4. Clicar em cadastrar
5. Sistema aceita o cadastro incorretamente

### Comportamento Esperado
- O sistema deveria rejeitar emails que começam ou terminam com caracteres especiais
- O sistema deveria rejeitar emails com caracteres especiais consecutivos
- Deveria exibir mensagem de erro indicando que o email é inválido

### Comportamento Atual
- Sistema aceita emails que começam ou terminam com caracteres especiais
- Sistema aceita emails com caracteres especiais consecutivos
- Permite o cadastro de usuários com emails inválidos

### Status
- [x] Reproduzido
- [ ] Reportado
- [ ] Em análise
- [ ] Corrigido
- [ ] Testado

## BUG-003: EXPOSIÇÃO DE SENHA EM CONSULTA DE USUÁRIO

### Descrição
O endpoint `GET /usuarios/{_id}` está retornando a senha do usuário na resposta, o que representa uma vulnerabilidade de segurança grave.

### Passos para Reproduzir
1. Criar um usuário via API POST `/usuarios`
2. Obter o ID do usuário criado
3. Fazer uma requisição GET para `/usuarios/{_id}`
4. Verificar que a senha está sendo retornada na resposta

### Comportamento Esperado
- A senha do usuário NÃO deve ser retornada na resposta
- Apenas dados não sensíveis devem ser expostos (nome, email, administrador, etc.)

### Comportamento Atual
- A senha do usuário está sendo retornada na resposta
- Dados sensíveis estão sendo expostos desnecessariamente

### Impacto na Segurança
- **Alto**: Exposição de credenciais de usuários
- **Risco**: Possível comprometimento de contas
- **Violação**: Princípios básicos de segurança de APIs

### Recomendações
1. Remover o campo `password` da resposta do endpoint GET
2. Implementar filtros de resposta para excluir dados sensíveis
3. Revisar outros endpoints que possam estar expondo dados sensíveis

### Status
- [x] Reproduzido
- [ ] Reportado
- [ ] Em análise
- [ ] Corrigido
- [ ] Testado

## BUG-004: COMPORTAMENTO DE DOUBLE SUBMIT

### Descrição
Ao clicar duas vezes rapidamente no botão "Cadastrar", o sistema retorna duas mensagens conflitantes:
- ✅ "Cadastro realizado com sucesso"  
- ❌ "Este email já está sendo usado"

### Passos para Reproduzir
1. Acessar a tela de cadastro
2. Preencher nome, email e senha válidos
3. Clicar duas vezes rapidamente no botão "Cadastrar"
4. Observar as duas mensagens conflitantes

### Comportamento Esperado
- O sistema deveria processar apenas uma requisição
- Deveria exibir apenas uma mensagem (sucesso ou erro)
- O botão deveria ser desabilitado durante o processamento

### Comportamento Atual
- Sistema processa múltiplas requisições simultâneas
- Exibe mensagens conflitantes
- Pode causar problemas de concorrência na base de dados

### Risco
- Confusão para o usuário
- Erros de concorrência na base de dados
- Comportamento imprevisível do sistema

### Solução Sugerida
- Desabilitar o botão durante o envio
- Implementar debounce de 1 segundo
- Implementar controle de estado de loading

### Evidência
![Evidência do bug de double submit](../evidencias_cadastro/melhoria02-DOUBLE_SUBMIT.png)

### Status
- [x] Reproduzido
- [ ] Reportado
- [ ] Em análise
- [ ] Corrigido
- [ ] Testado

## MELHORIA-001: CAMPO NOME - MAXLENGTH

### Descrição
O campo nome aparece na mensagem "Bem Vindo [nome]" para usuários admin, mas não possui limite de caracteres, o que pode causar problemas de layout.

### Problema
- Nomes muito longos podem quebrar o layout da interface
- A mensagem de bem-vindo pode ficar desalinhada
- Falta de controle sobre o tamanho do nome

### Comportamento Atual
- Campo nome aceita infinitos caracteres
- Nomes longos podem causar problemas de layout
- Interface pode ficar desorganizada

### Comportamento Esperado
- Campo nome deveria ter limite adequado para a interface
- Mensagem de bem-vindo deveria sempre se ajustar ao layout
- Interface deveria permanecer organizada

### Solução Sugerida
- Implementar `maxlength` no campo nome
- Limitar a 50 caracteres para garantir compatibilidade com a interface
- Validar o limite tanto no frontend quanto no backend

### Benefício
- Garante que a mensagem de bem-vindo sempre se ajuste ao layout
- Melhora a experiência do usuário
- Mantém a interface organizada

### Status
- [x] Identificado
- [ ] Reportado
- [ ] Em análise
- [ ] Implementado
- [ ] Testado

## MELHORIA-002: PADRONIZAÇÃO DE IDIOMA

### Descrição
O sistema apresenta inconsistências de idioma entre backend e frontend, misturando português e inglês em diferentes partes da aplicação.

### Problema
- **Campo Senha:** Backend usa `password` (inglês), frontend usa `senha` (português)
- **Mensagens de erro:** Mistura de idiomas e termos inconsistentes
- **Experiência do usuário:** Confusão causada pela inconsistência

### Inconsistências Identificadas

#### 1. Campo Senha/Password
| Local | Termo Usado | Idioma |
|-------|-------------|--------|
| **Backend (API)** | `password` | Inglês |
| **Frontend (Interface)** | `senha` | Português |

#### 2. Mensagens de Erro
| Campo | Backend (API) | Frontend (Interface) | Problema |
|-------|---------------|---------------------|----------|
| **Nome** | `'nome é obrigatório'` | `'Nome é obrigatório'` | ✅ Consistente |
| **Email** | `'email é obrigatório'` | `'Email é obrigatório'` | ✅ Consistente |
| **Senha** | `'password não pode ficar em branco'` | `'Password é obrigatório'` | ❌ Inconsistente |

### Comportamento Atual
- Backend retorna: `'password não pode ficar em branco'`
- Frontend exibe: `'Password é obrigatório'`
- Mistura de idiomas: `'Password é obrigatório'` (inglês + português)
- Termos diferentes: `'não pode ficar em branco'` vs `'é obrigatório'`

### Comportamento Esperado
- **Padronização completa em português brasileiro**
- Backend: `'senha não pode ficar em branco'`
- Frontend: `'Senha é obrigatório'`
- Campos: `senha` em vez de `password`

### Solução Sugerida
1. **Backend (API):**
   - Alterar campo `password` para `senha`
   - Padronizar mensagens de erro em português
   - Manter consistência com outros campos

2. **Frontend (Interface):**
   - Manter `senha` como já está
   - Padronizar mensagens de erro
   - Garantir consistência visual

3. **Documentação:**
   - Atualizar documentação da API
   - Padronizar exemplos de código
   - Manter consistência em todos os arquivos

### Benefício
- **Experiência do usuário:** Interface mais consistente e intuitiva
- **Manutenibilidade:** Código mais fácil de manter
- **Profissionalismo:** Aplicação com padrão de idioma definido
- **Internacionalização:** Base sólida para futuras traduções

### Impacto
- **Baixo:** Mudanças principalmente cosméticas
- **Benefício:** Melhoria significativa na experiência do usuário
- **Prioridade:** Média (não afeta funcionalidade, mas melhora UX)

### Status
- [x] Identificado
- [ ] Reportado
- [ ] Em análise
- [ ] Implementado
- [ ] Testado

---

*Nota: Este arquivo será atualizado conforme novos bugs e melhorias forem identificados.* 