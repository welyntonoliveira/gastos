// src/pages/Timeline.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { categorias, getCategoriaById as getCatById } from '../config/categorias';
import './Timeline.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Timeline() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMes, setTotalMes] = useState(0);
  const [mediaDiaria, setMediaDiaria] = useState(0);
  
  // Estados para edição
  const [editandoGasto, setEditandoGasto] = useState(null);
  const [formEdicao, setFormEdicao] = useState({
    categoria: '',
    valor: '',
    metodo: '',
    user_name: ''
  });
  
  // Estado para exclusão
  const [excluindoGasto, setExcluindoGasto] = useState(null);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  // Navegação entre meses
  const mesAnterior = () => setDataAtual(subMonths(dataAtual, 1));
  const proximoMes = () => setDataAtual(addMonths(dataAtual, 1));
  const mesAtual = () => setDataAtual(new Date());

  // Carregar dados quando mudar o mês
  useEffect(() => {
    carregarGastosDoMes();
  }, [dataAtual]);

  const carregarGastosDoMes = async () => {
    setLoading(true);
    
    const inicio = startOfMonth(dataAtual);
    const fim = endOfMonth(dataAtual);

    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .gte('created_at', inicio.toISOString())
      .lte('created_at', fim.toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGastos(data);
      
      // Calcular totais
      const total = data.reduce((acc, g) => acc + parseFloat(g.valor), 0);
      setTotalMes(total);
      
      const diasNoMes = endOfMonth(dataAtual).getDate();
      setMediaDiaria(total / diasNoMes);
    }
    
    setLoading(false);
  };

  // Função para iniciar edição
  const iniciarEdicao = (gasto) => {
    setEditandoGasto(gasto.id);
    setFormEdicao({
      categoria: gasto.categoria,
      valor: gasto.valor.toString(),
      metodo: gasto.metodo,
      user_name: gasto.user_name
    });
  };

  // Função para cancelar edição
  const cancelarEdicao = () => {
    setEditandoGasto(null);
    setFormEdicao({
      categoria: '',
      valor: '',
      metodo: '',
      user_name: ''
    });
  };

  // Função para salvar edição
  const salvarEdicao = async (gastoId) => {
    try {
      const { error } = await supabase
        .from('gastos')
        .update({
          categoria: formEdicao.categoria,
          valor: parseFloat(formEdicao.valor),
          metodo_pagamento: formEdicao.metodo,
        })
        .eq('id', gastoId);

      if (error) throw error;

      // Recarregar dados
      await carregarGastosDoMes();
      cancelarEdicao();
      
      // Feedback visual (opcional: adicionar toast)
      alert('Gasto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar gasto:', error);
      alert('Erro ao atualizar gasto. Tente novamente.');
    }
  };

  // Função para confirmar exclusão
  const confirmarExclusao = (gastoId) => {
    setExcluindoGasto(gastoId);
    setShowConfirmacao(true);
  };

  // Função para excluir gasto
  const excluirGasto = async () => {
    try {
      const { error } = await supabase
        .from('gastos')
        .delete()
        .eq('id', excluindoGasto);

      if (error) throw error;

      // Recarregar dados
      await carregarGastosDoMes();
      setShowConfirmacao(false);
      setExcluindoGasto(null);
      
      // Feedback visual
      alert('Gasto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir gasto:', error);
      alert('Erro ao excluir gasto. Tente novamente.');
    }
  };

  // Agrupar gastos por dia
  const gastosPorDia = () => {
    const inicio = startOfMonth(dataAtual);
    const fim = endOfMonth(dataAtual);
    const diasDoMes = eachDayOfInterval({ start: inicio, end: fim });
    
    return diasDoMes.map(dia => {
        const gastosDoDia = gastos.filter(g => 
            isSameDay(parseISO(g.created_at), dia)
        );
        
        const totalDia = gastosDoDia.reduce((acc, g) => acc + parseFloat(g.valor), 0);
        
        return {
            data: dia,
            gastos: gastosDoDia,
            total: totalDia,
            temGastos: gastosDoDia.length > 0
        };
    });
  };

  const getCorCategoria = (nomeCategoria) => {
    const categoria = categorias.find(c => c.nome === nomeCategoria);
    
    if (categoria) {
        const catCompleta = getCatById(categoria.id);
        return catCompleta?.cor || '#9E9E9E';
    }
    return '#9E9E9E';
  };

  const dias = gastosPorDia();

  if (loading) {
    return (
      <div className="timeline-loading">
        <div className="loading-spinner"></div>
        <p>Carregando seus gastos...</p>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      {/* Modal de confirmação de exclusão */}
      {showConfirmacao && (
        <div className="modal-overlay">
          <div className="modal-confirmacao">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este gasto?</p>
            <p className="modal-aviso">Esta ação não pode ser desfeita.</p>
            <div className="modal-botoes">
              <button 
                className="btn-cancelar"
                onClick={() => {
                  setShowConfirmacao(false);
                  setExcluindoGasto(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn-excluir"
                onClick={excluirGasto}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header com navegação */}
      <div className="timeline-header">
        <Link to="/" className="back-button">
          ← Voltar
        </Link>
        
        <div className="mes-navegacao">
          <button onClick={mesAnterior} className="nav-arrow">◀</button>
          <h2 className="mes-atual">
            {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <button onClick={proximoMes} className="nav-arrow">▶</button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="resumo-cards">
        <div className="resumo-card">
          <span className="resumo-label">Total do Mês</span>
          <span className="resumo-valor">R$ {totalMes.toFixed(2)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Média Diária</span>
          <span className="resumo-valor">R$ {mediaDiaria.toFixed(2)}</span>
        </div>
        <div className="resumo-card">
          <span className="resumo-label">Dias com Gasto</span>
          <span className="resumo-valor">{dias.filter(d => d.temGastos).length} dias</span>
        </div>
      </div>

      {/* Linha do tempo */}
      <div className="timeline">
        {dias.map((dia, index) => (
          <div key={index} className={`timeline-dia ${dia.temGastos ? 'tem-gastos' : 'sem-gastos'} ${isToday(dia.data) ? 'hoje' : ''}`}>
            {/* Cabeçalho do dia */}
            <div className="dia-header">
              <div className="dia-data">
                <span className="dia-numero">{format(dia.data, 'dd')}</span>
                <span className="dia-semana">{format(dia.data, 'EEE', { locale: ptBR })}</span>
              </div>
              
              {dia.temGastos && (
                <div className="dia-total">
                  R$ {dia.total.toFixed(2)}
                </div>
              )}
              
              {!dia.temGastos && (
                <div className="dia-vazio">
                  Sem gastos
                </div>
              )}
            </div>

            {/* Lista de gastos do dia */}
            {dia.temGastos && (
              <div className="gastos-lista">
                {dia.gastos.map(gasto => (
                  <div key={gasto.id}>
                    {editandoGasto === gasto.id ? (
                      // Formulário de edição
                      <div className="gasto-item gasto-editando">
                        <div className="gasto-edicao-form">
                          <select
                            value={formEdicao.categoria}
                            onChange={(e) => setFormEdicao({...formEdicao, categoria: e.target.value})}
                            className="edit-select"
                          >
                            {categorias.map(cat => (
                              <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                            ))}
                          </select>
                          
                          <input
                            type="number"
                            step="0.01"
                            value={formEdicao.valor}
                            onChange={(e) => setFormEdicao({...formEdicao, valor: e.target.value})}
                            className="edit-input"
                            placeholder="Valor"
                          />
                          
                          <select
                            value={formEdicao.metodo}
                            onChange={(e) => setFormEdicao({...formEdicao, metodo: e.target.value})}
                            className="edit-select"
                          >
                            <option value="PIX">PIX</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Cartão de Débito">Cartão de Débito</option>
                            <option value="Dinheiro">Dinheiro</option>
                          </select>
                          
                          
                          <div className="edicao-acoes">
                            <button className="btn-cancelar-edicao" onClick={cancelarEdicao}>
                              Cancelar
                            </button>
                            <button className="btn-salvar" onClick={() => salvarEdicao(gasto.id)}>
                              Salvar
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Visualização normal do gasto
                      <div className="gasto-item">
                        <div 
                          className="gasto-indicador"
                          style={{ backgroundColor: getCorCategoria(gasto.categoria) }}
                        />
                        <div className="gasto-info">
                          <span className="gasto-categoria">{gasto.categoria}</span>
                          <span className="gasto-hora">
                            {format(parseISO(gasto.created_at), 'HH:mm')}
                          </span>
                          <span className="gasto-hora">
                            {gasto.user_name}
                          </span>
                        </div>
                        <span className="gasto-valor">
                          R$ {parseFloat(gasto.valor).toFixed(2)}
                        </span>
                        <span className="gasto-metodo">
                          {gasto.metodo}
                        </span>
                        
                        {/* Botões de ação */}
                        <div className="gasto-acoes">
                          <button 
                            className="btn-editar"
                            onClick={() => iniciarEdicao(gasto)}
                            title="Editar gasto"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-excluir-gasto"
                            onClick={() => confirmarExclusao(gasto.id)}
                            title="Excluir gasto"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botão flutuante para adicionar (atalho) */}
      <Link to="/" className="fab-adicionar">
        + Novo Gasto
      </Link>
    </div>
  );
}

export default Timeline;