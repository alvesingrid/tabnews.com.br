// models/relative-time.js
export function calcularTempoRelativo(agora, criado) {
  const diffMs = agora.getTime() - criado.getTime();
  const minutos = Math.floor(diffMs / 60000);

  if (minutos < 0) return 'agora';

  if (minutos < 60) {
    if (minutos === 0) return 'agora';
    return minutos === 1 ? 'há 1 minuto' : `há ${minutos} minutos`;
  }

  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    return horas === 1 ? 'há 1 hora' : `há ${horas} horas`;
  }

  const dias = Math.floor(horas / 24);
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
}
