import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoins } from '../hooks/useCoins';
import { apiService } from '../services/api';
import { CoinDisplay } from './CoinDisplay';
import styles from '../components/Perfil.module.css';

// Assets
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png';
import violao2 from '../assets/imagens/violão2.png';
import danca from '../assets/imagens/dança.png';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  moedas: number;
  fotoPerfil?: string;
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const navigate = useNavigate();

  const { 
    totalCoins, 
    isLoading: coinsLoading, 
    error: coinsError, 
    refreshCoins 
  } = useCoins();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true);
        setProfileError('');
        
        const cpfLogado = localStorage.getItem('cpfUsuario');
        if (!cpfLogado) {
          throw new Error('Usuário não está logado');
        }

        // Sincroniza moedas primeiro
        await refreshCoins();

        // Tenta carregar do localStorage
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        let dadosUsuario: Usuario;

        if (usuarioLogado) {
          dadosUsuario = JSON.parse(usuarioLogado);
        } else {
          // Busca do backend
          dadosUsuario = await apiService.consultarPerfil(cpfLogado);
          localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        }

        // Atualiza com as moedas sincronizadas
        const usuarioAtualizado = {
          ...dadosUsuario,
          moedas: totalCoins
        };
        
        setUsuario(usuarioAtualizado);

        // Tenta carregar foto de perfil
        try {
          const fotoUrl = await apiService.obterFotoPerfil(cpfLogado);
          setFotoPerfil(fotoUrl);
        } catch (error) {
          console.log('Não foi possível carregar a foto:', error);
          // Usa foto do perfil se existir nos dados
          if (dadosUsuario.fotoPerfil) {
            setFotoPerfil(dadosUsuario.fotoPerfil);
          }
        }

      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setProfileError(error instanceof Error ? error.message : 'Erro ao carregar perfil');
        
        if (error instanceof Error && error.message === 'Usuário não está logado') {
          navigate('/entrar');
        }
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [navigate, refreshCoins, totalCoins]);

  const formatarCPF = (cpf: string) => {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleLogout = () => {
    localStorage.removeItem('cpfUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('userCoins');
    navigate('/entrar');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <picture>
        <source media="(min-width: 768px)" srcSet={bandeirasPc} />
        <source media="(max-width: 767px)" srcSet={bandeirasCell} />
        <img className={styles.bandeira} src={bandeirasPc} alt="Bandeiras" />
      </picture>

      <img className={styles.logo} src={logo} alt="Logo" />

      <div className={styles.FormsFundo}>
        <div className={styles.perfilContent}>
          <div className={styles.fotoPerfil}>
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto do perfil" className={styles.fotoUsuario} />
            ) : (
              <div className={styles.avatarDefault}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#8B9DC3"/>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                </svg>
              </div>
            )}
          </div>

          <div className={styles.dadosContainer}>
            <h2 className={styles.tituloPerfil}>TROCA-TROCA JUNINO</h2>
            
            {profileError ? (
              <div className={styles.error}>{profileError}</div>
            ) : usuario ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome:</label>
                  <div className={styles.inputField}>
                    {usuario.nome || 'Não informado'}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>E-mail:</label>
                  <div className={styles.inputField}>
                    {usuario.email || 'Não informado'}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>CPF:</label>
                  <div className={styles.inputField}>
                    {formatarCPF(usuario.cpf)}
                  </div>
                </div>

                <div className={styles.moedasContainer}>
                  <label className={styles.label}>Suas moedas totais:</label>
                  {coinsLoading ? (
                    <div>Atualizando moedas...</div>
                  ) : coinsError ? (
                    <div className={styles.error}>{coinsError}</div>
                  ) : (
                    <CoinDisplay 
                      totalCoins={totalCoins}
                      style={{
                        fontSize: '20px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                        color: '#000',
                        border: '2px solid #ffd700',
                        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={styles.error}>Nenhum dado de usuário disponível</div>
            )}

            <button onClick={handleLogout} className={styles.logoutButton}>
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className={styles.elementosFooter}>
        <picture>
          <source media="(min-width: 768px)" srcSet={violao} />
          <source media="(max-width: 767px)" srcSet={violao2} />
          <img className={styles.violao} src={violao} alt="violao" />
        </picture>

        <img className={styles.danca} src={danca} alt="danca" />
      </div>
    </div>
  );
};

export default Perfil;