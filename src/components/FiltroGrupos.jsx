// src/components/FiltroGrupos.jsx
import { grupos } from '../config/categorias';
import './FiltroGrupos.css';

function FiltroGrupos({ grupoSelecionado, onSelectGrupo }) {
  // Opção "Todos" + todos os grupos
  const opcoes = [
    { id: 'todos', nome: 'Todos', cor: '#9E9E9E' },
    ...grupos
  ];

  return (
    <div className="filtro-grupos">
      <div className="filtro-scroll">
        {opcoes.map((grupo) => (
          <button
            key={grupo.id}
            className={`filtro-chip ${grupoSelecionado === grupo.id ? 'active' : ''}`}
            onClick={() => onSelectGrupo(grupo.id)}
            style={{
              '--cor-grupo': grupo.cor
            }}
          >
            <span 
              className="chip-indicador" 
              style={{ backgroundColor: grupo.cor }}
            />
            <span className="chip-nome">{grupo.nome}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FiltroGrupos;