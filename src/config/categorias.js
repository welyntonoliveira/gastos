// src/config/categorias.js
// Arquivo de configuração fixa de categorias para o app "Bateu, Salvou"

// ========== DEFINIÇÃO DOS GRUPOS COM CORES ==========
export const grupos = [
  { id: 'moradia', nome: 'Moradia', cor: '#D4A574', corClara: '#E8C39E' },        // Terracota
  { id: 'alimentacao', nome: 'Alimentação', cor: '#E8635A', corClara: '#F28B82' }, // Vermelho queimado
  { id: 'transporte', nome: 'Transporte', cor: '#7C9EB2', corClara: '#A3C0D1' },   // Azul acinzentado
  { id: 'saude', nome: 'Saúde', cor: '#C179B9', corClara: '#D9A3D2' },             // Lilás
  { id: 'financeiro', nome: 'Financeiro', cor: '#E8B339', corClara: '#F2CD7D' },   // Âmbar/Dourado
  { id: 'lazer', nome: 'Lazer', cor: '#9B6DB7', corClara: '#B994D4' },             // Roxo suave
  { id: 'compras', nome: 'Compras', cor: '#E87A90', corClara: '#F2A3B3' },         // Rosa queimado
  { id: 'educacao', nome: 'Educação', cor: '#6BA3C7', corClara: '#95C2DD' },       // Azul serenity
  { id: 'outros', nome: 'Outros', cor: '#9E9E9E', corClara: '#BDBDBD' }            // Cinza médio
];

// Mapa para busca rápida de cor por ID do grupo
const corPorGrupo = {};
grupos.forEach(grupo => {
  corPorGrupo[grupo.id] = grupo.cor;
});

// ========== CATEGORIAS ==========
// Cada categoria herda a cor do seu grupo automaticamente
export const categorias = [
  // ========== MORADIA ==========
  { id: 'financiamento', nome: 'Financiamento', grupoId: 'moradia', valorPadrao: null, ordem: 1, ativa: true },
  { id: 'condominio', nome: 'Condomínio', grupoId: 'moradia', valorPadrao: null, ordem: 2, ativa: true },
  { id: 'luz', nome: 'Luz', grupoId: 'moradia', valorPadrao: null, ordem: 3, ativa: true },
  { id: 'agua', nome: 'Água', grupoId: 'moradia', valorPadrao: null, ordem: 4, ativa: true },
  { id: 'internet', nome: 'Internet', grupoId: 'moradia', valorPadrao: null, ordem: 5, ativa: true },
  { id: 'gas', nome: 'Gás', grupoId: 'moradia', valorPadrao: null, ordem: 6, ativa: true },
  { id: 'manutencao_casa', nome: 'Manutenção', grupoId: 'moradia', valorPadrao: null, ordem: 7, ativa: true },
  { id: 'taxa_extra_condominio', nome: 'Taxa extra condomínio', grupoId: 'moradia', valorPadrao: null, ordem: 8, ativa: true },
  { id: 'compras_eletro', nome: 'Compras Eletro', grupoId: 'moradia', valorPadrao: null, ordem: 9, ativa: true },
  { id: 'compras_decoracao', nome: 'Compras Decoração', grupoId: 'moradia', valorPadrao: null, ordem: 10, ativa: true },

  // ========== ALIMENTAÇÃO ==========
  { id: 'supermercado', nome: 'Supermercado', grupoId: 'alimentacao', valorPadrao: null, ordem: 11, ativa: true },
  { id: 'feira', nome: 'Feira', grupoId: 'alimentacao', valorPadrao: null, ordem: 12, ativa: true },
  { id: 'restaurante', nome: 'Restaurante', grupoId: 'alimentacao', valorPadrao: null, ordem: 13, ativa: true },
  { id: 'delivery', nome: 'Delivery', grupoId: 'alimentacao', valorPadrao: null, ordem: 14, ativa: true },
  { id: 'lanches', nome: 'Lanches', grupoId: 'alimentacao', valorPadrao: null, ordem: 15, ativa: true },
  { id: 'padaria', nome: 'Padaria', grupoId: 'alimentacao', valorPadrao: null, ordem: 16, ativa: true },

  // ========== TRANSPORTE ==========
  { id: 'combustivel', nome: 'Combustível', grupoId: 'transporte', valorPadrao: null, ordem: 17, ativa: true },
  { id: 'onibus_metro', nome: 'Ônibus/Metrô', grupoId: 'transporte', valorPadrao: null, ordem: 18, ativa: true },
  { id: 'uber_taxi', nome: 'Uber/Táxi', grupoId: 'transporte', valorPadrao: null, ordem: 19, ativa: true },
  { id: 'manutencao_carro', nome: 'Manutenção', grupoId: 'transporte', valorPadrao: null, ordem: 20, ativa: true },
  { id: 'estacionamento', nome: 'Estacionamento', grupoId: 'transporte', valorPadrao: null, ordem: 21, ativa: true },

  // ========== SAÚDE ==========
  { id: 'plano_saude', nome: 'Plano de Saúde', grupoId: 'saude', valorPadrao: null, ordem: 22, ativa: true },
  { id: 'medico', nome: 'Médico', grupoId: 'saude', valorPadrao: null, ordem: 23, ativa: true },
  { id: 'farmacia', nome: 'Farmácia', grupoId: 'saude', valorPadrao: null, ordem: 24, ativa: true },
  { id: 'academia', nome: 'Academia', grupoId: 'saude', valorPadrao: null, ordem: 25, ativa: true },

  // ========== FINANCEIRO ==========
  { id: 'serasa', nome: 'Serasa', grupoId: 'financeiro', valorPadrao: null, ordem: 26, ativa: true },
  { id: 'cartao_credito', nome: 'Cartão de Crédito', grupoId: 'financeiro', valorPadrao: null, ordem: 27, ativa: true },
  { id: 'emprestimo', nome: 'Empréstimo', grupoId: 'financeiro', valorPadrao: null, ordem: 28, ativa: true },
  { id: 'financiamento_fin', nome: 'Financiamento', grupoId: 'financeiro', valorPadrao: null, ordem: 29, ativa: true },

  // ========== LAZER ==========
  { id: 'cinema', nome: 'Cinema', grupoId: 'lazer', valorPadrao: null, ordem: 30, ativa: true },
  { id: 'shows', nome: 'Shows', grupoId: 'lazer', valorPadrao: null, ordem: 31, ativa: true },
  { id: 'viagens', nome: 'Viagens', grupoId: 'lazer', valorPadrao: null, ordem: 32, ativa: true },
  { id: 'bar', nome: 'Bar', grupoId: 'lazer', valorPadrao: null, ordem: 33, ativa: true },

  // ========== COMPRAS ==========
  { id: 'compras_online', nome: 'Compras Online', grupoId: 'compras', valorPadrao: null, ordem: 34, ativa: true },
  { id: 'roupas', nome: 'Roupas', grupoId: 'compras', valorPadrao: null, ordem: 35, ativa: true },
  { id: 'calcados', nome: 'Calçados', grupoId: 'compras', valorPadrao: null, ordem: 36, ativa: true },
  { id: 'acessorios', nome: 'Acessórios', grupoId: 'compras', valorPadrao: null, ordem: 37, ativa: true },

  // ========== EDUCAÇÃO ==========
  { id: 'cursos', nome: 'Cursos', grupoId: 'educacao', valorPadrao: null, ordem: 38, ativa: true },
  { id: 'livros', nome: 'Livros', grupoId: 'educacao', valorPadrao: null, ordem: 39, ativa: true },
  { id: 'material', nome: 'Material', grupoId: 'educacao', valorPadrao: null, ordem: 40, ativa: true },

  // ========== OUTROS ==========
  { id: 'presentes', nome: 'Presentes', grupoId: 'outros', valorPadrao: null, ordem: 45, ativa: true },
  { id: 'doacoes', nome: 'Doações', grupoId: 'outros', valorPadrao: null, ordem: 46, ativa: true },
  { id: 'imprevistos', nome: 'Imprevistos', grupoId: 'outros', valorPadrao: null, ordem: 47, ativa: true }
];

// ========== FUNÇÕES AUXILIARES ==========

// Retorna categoria com a cor do grupo já aplicada
export const getCategoriaCompleta = (categoria) => {
  const grupo = grupos.find(g => g.id === categoria.grupoId);
  return {
    ...categoria,
    cor: grupo?.cor || '#708090',
    corClara: grupo?.corClara || '#A9A9A9',
    grupoNome: grupo?.nome || 'Outros'
  };
};

// Retorna todas as categorias ativas com cores aplicadas
export const getCategoriasAtivas = () => {
  return categorias
    .filter(cat => cat.ativa)
    .sort((a, b) => a.ordem - b.ordem)
    .map(cat => getCategoriaCompleta(cat));
};

// Retorna categorias agrupadas (para accordion/filtros)
export const getCategoriasAgrupadas = () => {
  const gruposMap = {};
  
  getCategoriasAtivas().forEach(cat => {
    const grupoId = cat.grupoId;
    if (!gruposMap[grupoId]) {
      const grupo = grupos.find(g => g.id === grupoId);
      gruposMap[grupoId] = {
        id: grupoId,
        nome: grupo?.nome || 'Outros',
        cor: grupo?.cor || '#708090',
        corClara: grupo?.corClara || '#A9A9A9',
        categorias: []
      };
    }
    gruposMap[grupoId].categorias.push(cat);
  });
  
  return Object.values(gruposMap);
};

// Busca categoria por ID
export const getCategoriaById = (id) => {
  const cat = categorias.find(c => c.id === id);
  return cat ? getCategoriaCompleta(cat) : null;
};

// Retorna apenas despesas
export const getDespesas = () => {
  return getCategoriasAtivas().filter(cat => cat.tipo !== 'receita');
};

// Retorna apenas receitas
export const getReceitas = () => {
  return getCategoriasAtivas().filter(cat => cat.tipo === 'receita');
};

// Busca grupo por ID
export const getGrupoById = (id) => {
  return grupos.find(g => g.id === id);
};