import { useState, useEffect, useMemo} from 'react';
import { createClient } from '@supabase/supabase-js';
import FiltroGrupos from '../components/FiltroGrupos';
import '../App.css'; // Vamos estilizar depois
import { getCategoriasAtivas, getDespesas, getCategoriasAgrupadas, grupos } from '../config/categorias';
import { Link } from 'react-router-dom';

// Inicializa Supabase com variáveis de ambiente
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Marcou() {
  const [valor, setValor] = useState('');
  const [metodo, setMetodo] = useState('credito'); // 'credito' ou 'debito'
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
    // Categorias já vêm com a cor do grupo aplicada
  const categorias = getCategoriasAtivas();
  // Ou apenas despesas (exclui receitas)
  const despesas = getDespesas();
  // Ou agrupadas para um futuro accordion
  const categoriasAgrupadas = getCategoriasAgrupadas();

    // NOVO: Estado do filtro
  const [grupoSelecionado, setGrupoSelecionado] = useState('todos');
  
  // Carregar categorias (apenas despesas, exclui receitas)
  const todasCategorias = useMemo(() => getDespesas(), []);
  
  // NOVO: Categorias filtradas por grupo
  const categoriasFiltradas = useMemo(() => {
    if (grupoSelecionado === 'todos') {
      return todasCategorias;
    }
    return todasCategorias.filter(cat => cat.grupoId === grupoSelecionado);
  }, [grupoSelecionado, todasCategorias]);
  
  // Contar quantas categorias em cada grupo (para feedback visual)
  const contagemPorGrupo = useMemo(() => {
    const contagem = { todos: todasCategorias.length };
    todasCategorias.forEach(cat => {
      contagem[cat.grupoId] = (contagem[cat.grupoId] || 0) + 1;
    });
    return contagem;
  }, [todasCategorias]);

  // Foca automaticamente no campo ao abrir o app
  useEffect(() => {
    document.getElementById('input-valor').focus();
  }, []);

  const salvarGasto = async (categoria, valorPadrao = null) => {
    // Se o botão tem valor pré-definido (ex: Ifood R$45), usa ele, senão usa o input
    const valorFinal = valorPadrao !== null ? valorPadrao : parseFloat(valor);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFeedback('Faça login novamente');
      return;
    }
    
    if (!valorFinal || valorFinal <= 0) {
      setFeedback('Digite um valor primeiro');
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    setLoading(true);
    setFeedback(null);

    // Insere no Supabase
    const { error } = await supabase
      .from('gastos')
      .insert([{ valor: valorFinal, categoria, metodo_pagamento: metodo, user_id: user.id, user_name: user.user_metadata.name }]);

    setLoading(false);

    if (error) {
      setFeedback('Erro ao salvar 😕');
      console.error(error);
    } else {
      setFeedback(`✅ R$ ${valorFinal.toFixed(2)} salvo!`);
      setValor(''); // Limpa o campo para o próximo
      document.getElementById('input-valor').focus();
    }

    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="app-container">
      {/* Cabeçalho minimalista */}
      <div className="header">
        <h2> Gastou, Marcou</h2>
      </div>

      <div className="metodo-toggle">
        <button 
          className={metodo === 'credito' ? 'active' : ''}
          onClick={() => setMetodo('credito')}
        >
          Crédito 
        </button>
        <button 
          className={metodo === 'debito' ? 'active' : ''}
          onClick={() => setMetodo('debito')}
        >
          Débito
        </button>
        <button 
          className={metodo === 'caju' ? 'active' : ''}
          onClick={() => setMetodo('caju')}
        >
          Caju
        </button>
        <button 
          className={metodo === 'pix' ? 'active' : ''}
          onClick={() => setMetodo('pix')}
        >
          Pix
        </button>
      </div>

      {/* Área do Valor - Gigante */}
      <div className="valor-area">
        <label htmlFor="input-valor">Qual foi o valor?</label>
        <input
          id="input-valor"
          type="number"
          inputMode="decimal"
          placeholder="0,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Feedback visual temporário */}
      {feedback && <div className="feedback">{feedback}</div>}

            {/* NOVO: Filtro por Grupo */}
      <FiltroGrupos 
        grupoSelecionado={grupoSelecionado}
        onSelectGrupo={setGrupoSelecionado}
      />

      {/* Botões de Categorias - Agora filtrados */}
      <div className="botoes-rapidos">
        {categoriasFiltradas.length === 0 ? (
          <div className="sem-resultados">
            <p>😕 Nenhuma categoria neste grupo</p>
            <button onClick={() => setGrupoSelecionado('todos')}>
              Ver todas
            </button>
          </div>
        ) : (
          categoriasFiltradas.map((cat) => (
            <button
              key={cat.id}
              className="botao-gasto"
              style={{ borderLeftColor: cat.cor }}
              onClick={() => salvarGasto(cat.nome, cat.valorPadrao)}
              disabled={loading}
            >
              <span className="label">{cat.nome}</span>
              <span 
                className="grupo-badge" 
                style={{ backgroundColor: cat.corClara }}
              >
                {cat.grupoNome}
              </span>
              {cat.valorPadrao && (
                <span className="valor-sugerido">R$ {cat.valorPadrao}</span>
              )}
            </button>
          ))
        )}
      </div>

      {/* Rodapé com atalho para Dashboard (futuro) */}
      <div className="footer">
        <Link to="/timeline" className="ver-historico">
          Linha do Tempo
        </Link>
      </div>
    </div>
  );
}

export default Marcou;