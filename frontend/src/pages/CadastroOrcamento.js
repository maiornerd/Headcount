// src/pages/CadastroOrcamento.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CadastroOrcamento.css';

const CadastroOrcamento = () => {
  const [dados, setDados] = useState([]);
  // Buscar todos os registros ao carregar a página
  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await axios.get('http://localhost:5000/orcamentos');
        setDados(res.data);
      } catch (err) {
        setMensagem('Erro ao buscar orçamentos');
      }
    };
    fetchDados();
  }, []);
  const [form, setForm] = useState({
    numEmpresa: '',
    nomeEmpresa: '',
    centroCustoContabil: '',
    centroCustoFolha: '',
    codSecao: '',
    atividade: '',
    superintendente: '',
    gestorArea: '',
    responsavelSetor: '',
    descSetor: '',
    codigo: '',
    funcao: '',
    jul25: '',
    ago25: '',
    set25: '',
    out25: '',
    nov25: '',
    dez25: '',
    realizado: ''
  });
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const adicionarLinha = async () => {
    const total =
      Number(form.jul25 || 0) + Number(form.ago25 || 0) + Number(form.set25 || 0) +
      Number(form.out25 || 0) + Number(form.nov25 || 0) + Number(form.dez25 || 0);
    try {
      await axios.post('http://localhost:5000/orcamentos', {
        ...form,
        jul25: Number(form.jul25),
        ago25: Number(form.ago25),
        set25: Number(form.set25),
        out25: Number(form.out25),
        nov25: Number(form.nov25),
        dez25: Number(form.dez25),
        total,
        realizado: Number(form.realizado)
      });
      setMensagem('Orçamento cadastrado com sucesso!');
      // Atualiza a lista buscando novamente do backend
      const res = await axios.get('http://localhost:5000/orcamentos');
      setDados(res.data);
      setForm({
        numEmpresa: '',
        nomeEmpresa: '',
        centroCustoContabil: '',
        centroCustoFolha: '',
        codSecao: '',
        atividade: '',
        superintendente: '',
        gestorArea: '',
        responsavelSetor: '',
        descSetor: '',
        codigo: '',
        funcao: '',
        jul25: '',
        ago25: '',
        set25: '',
        out25: '',
        nov25: '',
        dez25: '',
        realizado: ''
      });
    } catch (err) {
      setMensagem('Erro ao cadastrar orçamento');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cadastro de Orçamento</h2>
      <div className="formulario">
        <input name="numEmpresa" placeholder="Nº da Empresa" value={form.numEmpresa} onChange={handleChange} />
        <input name="nomeEmpresa" placeholder="Nome da Empresa" value={form.nomeEmpresa} onChange={handleChange} />
        <input name="centroCustoContabil" placeholder="Centro de Custo Contábil" value={form.centroCustoContabil} onChange={handleChange} />
        <input name="centroCustoFolha" placeholder="Centro de Custo Folha" value={form.centroCustoFolha} onChange={handleChange} />
        <input name="codSecao" placeholder="Código da Seção" value={form.codSecao} onChange={handleChange} />
        <input name="atividade" placeholder="Atividade" value={form.atividade} onChange={handleChange} />
        <input name="superintendente" placeholder="Superintendente" value={form.superintendente} onChange={handleChange} />
        <input name="gestorArea" placeholder="Gestor da Área" value={form.gestorArea} onChange={handleChange} />
        <input name="responsavelSetor" placeholder="Responsável pelo Setor" value={form.responsavelSetor} onChange={handleChange} />
        <input name="descSetor" placeholder="Descrição do Setor" value={form.descSetor} onChange={handleChange} />
        <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} />
        <input name="funcao" placeholder="Função" value={form.funcao} onChange={handleChange} />
        <input name="jul25" placeholder="Jul/25" value={form.jul25} onChange={handleChange} />
        <input name="ago25" placeholder="Ago/25" value={form.ago25} onChange={handleChange} />
        <input name="set25" placeholder="Set/25" value={form.set25} onChange={handleChange} />
        <input name="out25" placeholder="Out/25" value={form.out25} onChange={handleChange} />
        <input name="nov25" placeholder="Nov/25" value={form.nov25} onChange={handleChange} />
        <input name="dez25" placeholder="Dez/25" value={form.dez25} onChange={handleChange} />
        <input name="realizado" placeholder="Realizado" value={form.realizado} onChange={handleChange} />
        <button onClick={adicionarLinha}>Adicionar</button>
      </div>
      {mensagem && <p>{mensagem}</p>}

      <table className="tabela">
        <thead>
          <tr>
            <th>Nº da Empresa</th>
            <th>Nome da Empresa</th>
            <th>Centro de Custo Contábil</th>
            <th>Centro de Custo Folha</th>
            <th>Código da Seção</th>
            <th>Atividade</th>
            <th>Superintendente</th>
            <th>Gestor da Área</th>
            <th>Responsável pelo Setor</th>
            <th>Descrição do Setor</th>
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
              <td>{d.numEmpresa}</td>
              <td>{d.nomeEmpresa}</td>
              <td>{d.centroCustoContabil}</td>
              <td>{d.centroCustoFolha}</td>
              <td>{d.codSecao}</td>
              <td>{d.atividade}</td>
              <td>{d.superintendente}</td>
              <td>{d.gestorArea}</td>
              <td>{d.responsavelSetor}</td>
              <td>{d.descSetor}</td>
              <td>{d.codigo}</td>
              <td>{d.funcao}</td>
              <td>{d.jul25}</td>
              <td>{d.ago25}</td>
              <td>{d.set25}</td>
              <td>{d.out25}</td>
              <td>{d.nov25}</td>
              <td>{d.dez25}</td>
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
