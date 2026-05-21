export enum MensagensAuth {
    LOGIN_EM_USO = 'Login já está em uso',
    CREDENCIAIS_INVALIDAS = 'Credenciais inválidas',
    TOKEN_NAO_INFORMADO = 'Token não informado',
    TOKEN_MAL_FORMATADO = 'Token mal formatado',
    TOKEN_INVALIDO = 'Token inválido',
    JWT_SECRET_NAO_CONFIGURADO = 'JWT_SECRET não configurado',
}

export enum MensagensValidacao {
    DADOS_INVALIDOS = 'Dados inválidos',
    LOGIN_MIN_CARACTERES = 'Login precisa ter no mínimo 3 caracteres',
    SENHA_MIN_CARACTERES = 'Senha precisa ter no mínimo 6 caracteres',
    LOGIN_OBRIGATORIO = 'Login é obrigatório',
    SENHA_OBRIGATORIA = 'Senha é obrigatória',
}

export enum MensagensErro {
    INTERNO = 'Erro interno do servidor',
    USUARIO_NAO_RECUPERADO = 'Falha ao recuperar usuário recém criado',
}
