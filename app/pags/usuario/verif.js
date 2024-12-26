// Validação do email
export const validateEmail = (value) => {
    if (!value) {
        return "Email é obrigatório";
    }
    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(value) || "Endereço de email inválido";
};

// Validação da senha
export const validatePassword = (value) => {
    if (!value) {
        return "Senha é obrigatória";
    }
    if (value.length < 4) {
        return "A senha deve ter pelo menos 4 caracteres";
    }
    if (value.length > 16) {
        return "A senha não pode exceder 16 caracteres";
    }
    return true;
};

// Validação do número de telefone
export const validatePhone = (value) => {
    if (!value) {
        return "Número de telefone é obrigatório";
    }
    if (!value.startsWith('9')) {
        return "O número de telefone deve começar com 9";
    }
    if (!/^(91|92|93|94|95|99)/.test(value)) {
        return "Número inválido";
    }
    if (value.length !== 9) {
        return "O número de telefone deve ter 9 dígitos";
    }
    return true;
};

// Função para formatação automática da data
export const handleDateInput = (value) => {
    let formattedValue = value.replace(/\D/g, '');

    if (formattedValue.length > 4 && formattedValue.length <= 6) {
        formattedValue = `${formattedValue.slice(0, 2)}→${formattedValue.slice(2)}`;
    } else if (formattedValue.length > 6) {
        formattedValue = `${formattedValue.slice(0, 2)}→${formattedValue.slice(2, 4)}→${formattedValue.slice(4)}`;
    }

    return formattedValue.slice(0, 10);
};
