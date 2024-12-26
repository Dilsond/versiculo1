const dp = (fieldName, value) => {
    switch (fieldName) {
      case "nome":
        if (!value || value.length < 4) {
          return "O nome deve ter pelo menos 4 caracteres.";
        }
        break;
  
      case "descricao":
        if (!value || value.length < 10) {
          return "A descrição deve ter pelo menos 10 caracteres.";
        }
        break;
  
      case "preco":
        if (!value || isNaN(Number(value)) || Number(value) <= 0) {
          return "O preço deve ser um número maior que 0.";
        }
        break;
  
      case "localizacao":
        if (!value || value.length < 3) {
          return "A localização deve ter pelo menos 3 caracteres.";
        }
        break;
  
      case "condicao":
        if (!value) {
          return "A condição do produto é obrigatória.";
        }
        break;
  
      case "categoria":
        if (!value) {
          return "A categoria é obrigatória.";
        }
        break;
  
      default:
        return null;
    }
    return null; 
  };
  
  export default dp;
  