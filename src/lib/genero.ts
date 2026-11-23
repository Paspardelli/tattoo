// Modelo para tatuador (masculino) ou tatuadora (feminino).
// O campo "genero" do painel (Configurações) escolhe qual das duas versões o site usa.

export type Genero = 'm' | 'f';

export function normalizeGenero(value: unknown): Genero {
  return value === 'f' ? 'f' : 'm';
}

export function palavras(genero: Genero) {
  const f = genero === 'f';
  return {
    tatuador: f ? 'tatuadora' : 'tatuador',
    Tatuador: f ? 'Tatuadora' : 'Tatuador',
    profissional: f ? 'Tatuadora profissional' : 'Tatuador profissional',
  };
}

/** Textos de abertura e "Sobre" já na forma certa (tatuador/tatuadora). Editáveis no painel. */
export function textosPadrao(genero: Genero) {
  const profissao = genero === 'f' ? 'tatuadora' : 'tatuador';
  return {
    hero_texto:
      'Cada tatuagem nasce de uma conversa e de um desenho feito do zero para você. Traço firme, sombras limpas, biossegurança total e um atendimento que respeita a sua ideia.',
    sobre_texto1: `Sou ${profissao} profissional e trabalho com desenhos autorais. Antes de pegar a máquina, a gente conversa: entendo o significado, o local do corpo, o tamanho ideal e o estilo que combina com você.`,
    sobre_texto2:
      'Meu compromisso é entregar uma tatuagem bem executada, que envelheça bem e que você tenha orgulho de mostrar pelo resto da vida, num ambiente limpo, tranquilo e seguro.',
  };
}
