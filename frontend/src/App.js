import React, { useState } from 'react';
import axios from 'axios';
import PainelDiretor from './pages/PainelDiretor';
import PainelGestor from './pages/PainelGestor';
import CadastroOrcamento from './pages/CadastroOrcamento';



function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [perfil, setPerfil] = useState('');

  const fazerLogin = async () => {
    try {
      const resposta = await axios.post('http://localhost:5000/login', {
        email: email,
        senha: senha
      });
      setMensagem(`Bem-vindo, ${resposta.data.nome}`);
      // Aqui você pode setar o token e perfil se o backend retornar
      if (resposta.data.token) setToken(resposta.data.token);
      if (resposta.data.perfil) setPerfil(resposta.data.perfil);
    } catch (err) {
      // Mostra mensagem detalhada do backend, se houver
      if (err.response && err.response.data && err.response.data.mensagem) {
        setMensagem('Login falhou: ' + err.response.data.mensagem);
      } else {
        setMensagem('Login falhou');
      }
      // Para debug, mostra o erro no console
      console.error('Erro no login:', err.response?.data || err.message);
    }
  };

  const acessarPainel = async () => {
    try {
      const resposta = await axios.get('http://localhost:5000/painel', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMensagem(resposta.data.mensagem);
    } catch (err) {
  console.error('Erro no login:', err.response?.data || err.message);
  setMensagem('Login falhou');
}
  };

  // Função para download do arquivo .xlsx
  const handleDownload = () => {
    // Supondo que o backend tenha uma rota /download/xlsx
    window.open('http://localhost:5000/download/xlsx', '_blank');
  };

  return (
    <div style={{ padding: 20 }}>
      {!token && (
        <>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          /><br />
          <button onClick={fazerLogin}>Entrar</button>
        </>
      )}

      {token && (
        <>
          <h3>{mensagem}</h3>
          <p>Perfil: {perfil}</p>

          {/* Botão de download disponível para todos os perfis */}
          <button onClick={handleDownload}>Download .xlsx</button>
          <br /><br />

          {/* Painel de visualização para todos os perfis */}
          {perfil === 'diretor' && <PainelDiretor />}
          {(perfil === 'gestor' || perfil === 'coordenador' || perfil === 'supervisor') && <PainelGestor />}

          {/* CadastroOrcamento só para diretor */}
          {perfil === 'diretor' && <CadastroOrcamento />}

          {/* Mensagem para outros perfis */}
          {(perfil === 'gestor' || perfil === 'coordenador' || perfil === 'supervisor') && (
            <p>Você pode consultar e solicitar disponibilidade de vagas.</p>
          )}

          <button onClick={acessarPainel}>Testar Acesso Protegido</button>
          <br /><br />
          <button onClick={() => {
            setToken('');
            setPerfil('');
            setMensagem('');
            setEmail('');
            setSenha('');
          }}>
            Sair
          </button>
        </>
      )}
    </div>
  );
}
export default App;