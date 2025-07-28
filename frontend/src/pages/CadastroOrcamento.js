// src/pages/CadastroOrcamento.js
import React, { useState } from 'react';
import './CadastroOrcamento.css';

const CadastroOrcamento = () => {
  const [dados, setDados] = useState([]);
  const [form, setForm] = useState({
    codigo: '',
    descricao: '',
    jul: '',
    ago: '',
    set: '',
    out: '',
    nov: '',
    dez: '',
    realizado: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const adicionarLinha = () => {
    const totalReal = 
      Number(form.jul || 0) + Number(form.ago || 0) + Number(form.set || 0) +
      Number(form.out || 0) + Number(form.nov || 0) + Number(form.dez || 0);

    setDados([...dados, { ...form, total: totalReal }]);
    setForm({
      codigo: '',
      descricao: '',
      jul: '',
      ago: '',
      set: '',
      out: '',
      nov: '',
      dez: '',
      realizado: ''
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cadastro de Orçamento</h2>
      <div className="formulario">
        <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} />
        <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
        <input name="jul" placeholder="Jul/25" value={form.jul} onChange={handleChange} />
        <input name="ago" placeholder="Ago/25" value={form.ago} onChange={handleChange} />
        <input name="set" placeholder="Set/25" value={form.set} onChange={handleChange} />
        <input name="out" placeholder="Out/25" value={form.out} onChange={handleChange} />
        <input name="nov" placeholder="Nov/25" value={form.nov} onChange={handleChange} />
        <input name="dez" placeholder="Dez/25" value={form.dez} onChange={handleChange} />
        <input name="realizado" placeholder="Realizado" value={form.realizado} onChange={handleChange} />
        <button onClick={adicionarLinha}>Adicionar</button>
      </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>Código</th>
            <th>Função</th>
            <th>Jul/25</th>
            <th>Ago/25</th>
            <th>Set/25</th>
            <th>Out/25</th>
            <th>Nov/25</th>
            <th>Dez/25</th>
            <th>Total</th>
            <th>Realizado</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((d, i) => (
            <tr key={i}>
              <td>{d.codigo}</td>
              <td>{d.descricao}</td>
              <td>{d.jul}</td>
              <td>{d.ago}</td>
              <td>{d.set}</td>
              <td>{d.out}</td>
              <td>{d.nov}</td>
              <td>{d.dez}</td>
              <td>{d.total}</td>
              <td>{d.realizado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CadastroOrcamento;
