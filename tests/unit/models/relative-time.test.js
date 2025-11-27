// tests/unit/relative-time.test.js
import { describe, expect, it } from 'vitest';

import { calcularTempoRelativo } from '../../../models/relative-time.js';

describe('calcularTempoRelativo', () => {
  it("deve retornar 'há 1 minuto' para diferença de 1 minuto", () => {
    const agora = new Date('2024-01-01T12:00:00Z');
    const criado = new Date('2024-01-01T11:59:00Z');

    const resultado = calcularTempoRelativo(agora, criado);

    expect(resultado).toBe('há 1 minuto');
  });

  it("deve retornar 'há 2 horas' para diferença de 2 horas", () => {
    const agora = new Date('2024-01-01T12:00:00Z');
    const criado = new Date('2024-01-01T10:00:00Z');

    const resultado = calcularTempoRelativo(agora, criado);

    expect(resultado).toBe('há 2 horas');
  });

  it("deve retornar 'há 1 dia' para diferença de 1 dia", () => {
    const agora = new Date('2024-01-02T12:00:00Z');
    const criado = new Date('2024-01-01T12:00:00Z');

    const resultado = calcularTempoRelativo(agora, criado);

    expect(resultado).toBe('há 1 dia');
  });

  it("deve retornar 'agora' quando a data de criação está no futuro", () => {
    const agora = new Date('2024-01-01T10:00:00Z');
    const criado = new Date('2024-01-01T10:05:00Z');

    const resultado = calcularTempoRelativo(agora, criado);

    expect(resultado).toBe('agora');
  });
});
