# Documentação do WebApp de Precificação Automática de Confeitaria (MVP)

## 1. Visão Geral

Este documento detalha o WebApp MVP (Produto Mínimo Viável) de precificação automática para confeitaria, desenvolvido para auxiliar confeiteiros a calcular de forma eficiente e intuitiva os custos e lucros de suas receitas. A aplicação oferece um sistema de login seguro, cadastro e gerenciamento de receitas, e cálculos automáticos baseados nos ingredientes e suas quantidades.

## 2. Funcionalidades Implementadas

O WebApp Confeitaria MVP inclui as seguintes funcionalidades:

### 2.1. Cadastro e Autenticação de Usuários
- **Criação de Conta**: Usuários podem se registrar com e-mail e senha.
- **Login Seguro**: Sistema de autenticação para acesso restrito às funcionalidades.
- **Gerenciamento de Sessão**: Usuários permanecem logados até que decidam sair.

### 2.2. Dashboard Inicial
- **Visão Geral das Receitas**: Exibe uma lista das receitas cadastradas pelo usuário, incluindo nome, custo total, preço sugerido e lucro.
- **Métricas Chave**: Apresenta o número total de receitas, custo médio e margem média de lucro.
- **Navegação Intuitiva**: Botões para "Nova Receita" e "Sair".

### 2.3. Formulário de Receita
- **Campos Detalhados**: Permite inserir nome da receita, rendimento (unidades), margem de lucro desejada e observações.
- **Gerenciamento de Ingredientes**: Adição dinâmica de múltiplos ingredientes com campos para:
    - Nome do ingrediente
    - Quantidade usada (com seleção de unidade: g, kg, ml, l, unidade, xícara, colher)
    - Preço pago na embalagem
    - Quantidade total da embalagem (com seleção de unidade)
- **Cálculos em Tempo Real**: Um painel lateral exibe automaticamente:
    - Custo total da receita
    - Custo por unidade
    - Preço sugerido
    - Lucro líquido por unidade

### 2.4. Cálculos Automáticos e Validações
- **Custo por Ingrediente**: Calculado como `(quantidade usada ÷ quantidade total da embalagem) × preço pago na embalagem`.
- **Custo Total da Receita**: Soma dos custos de todos os ingredientes.
- **Preço Sugerido**: Baseado no custo por unidade e na margem de lucro ajustável.
- **Lucro Líquido por Unidade**: Diferença entre o preço sugerido e o custo por unidade.
- **Alertas Visuais**: Feedback instantâneo ao usuário:
    - **Vermelho**: Se o preço de venda sugerido for menor que o custo por unidade.
    - **Verde**: Se a margem de lucro for superior a 50%.
    - **Amarelo**: Se a margem de lucro for inferior a 20%.

### 2.5. Armazenamento de Dados
- **Banco de Dados por Usuário**: Cada usuário possui suas receitas salvas de forma isolada.
- **Edição e Exclusão**: Funcionalidades para modificar ou remover receitas existentes.

## 3. Tecnologias Utilizadas

O WebApp foi construído utilizando um stack moderno e robusto:

- **Frontend**: React.js com Vite, Tailwind CSS e shadcn/ui para uma interface responsiva e moderna.
- **Backend**: FastAPI (Python) para a API RESTful, oferecendo alta performance e fácil documentação.
- **Banco de Dados**: SQLite para o MVP, ideal para prototipagem e fácil gerenciamento.
- **Autenticação**: JWT (JSON Web Tokens) para segurança e `passlib` com `pbkdf2_sha256` para hashing de senhas.

## 4. Como Rodar a Aplicação Localmente

Para configurar e rodar o projeto em seu ambiente local, siga os passos abaixo:

### 4.1. Pré-requisitos
- Python 3.9+
- Node.js 18+
- pnpm (gerenciador de pacotes Node.js)
- Git

### 4.2. Configuração do Backend
1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd confeitaria-mvp/backend
   ```
2. Crie e ative um ambiente virtual Python:
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # No Windows: .\venv\Scripts\activate
   ```
3. Instale as dependências do Python:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicie o servidor FastAPI:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   O backend estará disponível em `http://localhost:8000`.

### 4.3. Configuração do Frontend
1. Navegue até o diretório do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências do Node.js:
   ```bash
   pnpm install
   ```
3. Inicie o servidor de desenvolvimento do React:
   ```bash
   pnpm run dev
   ```
   O frontend estará disponível em `http://localhost:5173` (ou outra porta indicada).

## 5. Como Fazer o Deploy (Full-Stack)

Para o deploy da aplicação full-stack (frontend e backend juntos), o backend FastAPI foi configurado para servir os arquivos estáticos do frontend. 

1. Certifique-se de que o frontend foi construído:
   ```bash
   cd confeitaria-mvp/frontend
   pnpm run build
   ```
   Isso criará uma pasta `dist` com os arquivos estáticos do frontend.

2. Copie a pasta `dist` para o diretório `backend/frontend`:
   ```bash
   cd .. # Voltar para o diretório raiz confeitaria-mvp
   cp -r frontend/dist backend/frontend
   ```

3. O backend está configurado para servir esses arquivos. Para deploy em plataformas como Render ou Vercel, você pode apontar o serviço para o diretório `confeitaria-mvp/backend` e garantir que o comando de inicialização execute o `uvicorn` apontando para `app.main:app`.

   **Exemplo de comando de inicialização para o Render (se usar o `main.py` na raiz do backend):**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   *Nota: O deploy foi testado com um wrapper Flask para compatibilidade com a ferramenta de deploy, mas a abordagem ideal para FastAPI é usar o Uvicorn diretamente.* 

## 6. Extras Desejáveis (Implementados)

- **Design Limpo e Moderno**: A interface foi desenvolvida com Tailwind CSS e shadcn/ui, resultando em um design limpo, moderno e intuitivo, similar ao estilo Notion/Google Sheets.
- **Responsividade**: A aplicação é totalmente responsiva, adaptando-se a diferentes tamanhos de tela (desktop e mobile).

## 7. Próximos Passos (Melhorias Futuras)

- **Recuperação de Senha**: Implementar funcionalidade de recuperação de senha via e-mail.
- **Exportação de Receitas**: Adicionar opção para exportar receitas em PDF ou CSV.
- **Custo Adicional Fixo**: Incluir campo para adicionar embalagem e custos adicionais fixos por receita.
- **Testes Abrangentes**: Expandir a cobertura de testes unitários e de integração para frontend e backend.
- **Otimização de Performance**: Melhorar o carregamento de dados e a performance geral da aplicação.
- **Notificações**: Adicionar sistema de notificações para feedback ao usuário.

--- 

**Autor**: Manus AI
**Data**: 08 de Outubro de 2025
