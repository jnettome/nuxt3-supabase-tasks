export default defineI18nConfig(nuxt => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      logout: 'logout',
      boards: 'Boards',
      create_board: 'Create new board',
      create_column: 'Click here to add a new column',
      cancel_editing: 'cancel editing',
      add_task: 'add task',
      edit_task: 'edit task',
      delete_task: 'delete task',
      update_task: 'Update task',
      close: 'close',
      edit_tags: 'Edit Tags',
      create_new_tag: 'Create new tag',
      create_tag: 'Create tag',
      back: 'back',
      add_column_name: 'Add column name',
      index: {
        title: 'Sign in or create your account',
        send_me_a_login_link: 'Send me a login link',
        please_wait: 'Please wait...',
        email_sent: "We've sent you an email with a link to sign in.",
        your_email_address: 'Your email address'
      }
    },
    'pt': {
      logout: 'sair',
      boards: 'Projetos',
      create_board: 'Criar novo projeto',
      create_column: 'Clique para adicionar uma nova coluna',
      cancel_editing: 'cancelar edição',
      add_task: 'adicionar tarefa',
      edit_task: 'editar tarefa',
      delete_task: 'apagar tarefa',
      update_task: 'Atualizar tarefa',
      close: 'fechar',
      edit_tags: 'Editar Tags',
      create_new_tag: 'Crie uma tag',
      create_tag: 'Criar tag',
      back: 'voltar',
      add_column_name: 'Informe um nome para a coluna',
      index: {
        title: 'Acesse ou crie sua conta',
        send_me_a_login_link: 'Me envie um link para acessar',
        please_wait: 'aguarde...',
        email_sent: "Enviamos um email com um link para você acessar.",
        your_email_address: 'Seu endereço de email'
      }
    }
  }
}))
