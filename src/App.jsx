import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css'; // Vamos estilizar depois
import { getCategoriasAtivas, getDespesas, getCategoriasAgrupadas } from './config/categorias';


// Inicializa Supabase com variáveis de ambiente
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
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

  // Foca automaticamente no campo ao abrir o app
  useEffect(() => {
    document.getElementById('input-valor').focus();
  }, []);

  const salvarGasto = async (categoria, valorPadrao = null) => {
    // Se o botão tem valor pré-definido (ex: Ifood R$45), usa ele, senão usa o input
    const valorFinal = valorPadrao !== null ? valorPadrao : parseFloat(valor);
    
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
      .insert([{ valor: valorFinal, categoria, metodo_pagamento: metodo }]);

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

      <div className="botoes-rapidos">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className="botao-gasto"
            style={{ borderLeftColor: cat.cor }} // Cor já vem do grupo!
            onClick={() => salvarGasto(cat.nome, cat.valorPadrao)}
          >
            <span className="label">{cat.nome}</span>
            <span className="grupo-badge">
              {cat.grupoNome}
            </span>
            {cat.valorPadrao && (
              <span className="valor-sugerido">R$ {cat.valorPadrao}</span>
            )}
          </button>
        ))}
      </div>

      {/* Rodapé com atalho para Dashboard (futuro) */}
      <div className="footer">
        <button className="ver-historico" onClick={() => alert('Em breve: dashboard!')}>
          📊 Ver histórico
        </button>
      </div>
    </div>
  );
}

export default App;