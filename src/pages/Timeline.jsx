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
    // Procura a categoria pelo nome no array importado
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
                  <div key={gasto.id} className="gasto-item">
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