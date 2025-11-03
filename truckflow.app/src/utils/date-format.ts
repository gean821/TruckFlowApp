export const formatarData = (dataString: string): string => {
    if (!dataString) {
        return '';
    }
  
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}