import React, { useState } from 'react';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png'
import violao2 from '../assets/imagens/violão2.png'
import danca from '../assets/imagens/dança.png'
import styles from '../components/Cadastro.module.css'
import { Link } from 'react-router-dom';
import continuar from '../assets/imagens/continuar.png'
import { useNavigate } from 'react-router-dom';

const Entrar: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', {nome, email, cpf });
    navigate('/entrar'); 
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const cpfNumbers = value.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (cpfNumbers.length <= 11) {
      return cpfNumbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setCpf(formattedCPF);
  };

  return (
    <div className={styles.container}>
      <picture>
        <source media="(min-width: 768px)" srcSet={bandeirasPc} />
        <source media="(max-width: 767px)" srcSet={bandeirasCell} />
        <img className={styles.bandeira} src={bandeirasPc} alt="Bandeiras" />
      </picture>

        <img className={styles.logo} src={logo} alt="Logo" />

        <p className={styles.paragrafoC}>Ê cumadi (cumpadi)! Bem vindo!</p>

        <form className={styles.formulario} onSubmit={handleSubmit}>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={styles.inputField}
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="Digite o seu e-mail"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>CPF:</label>
            <input
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              className={styles.inputField}
              placeholder="XXX.XXX.XXX-XX"
              maxLength={14}
              required
            />
          </div>

          <button type="submit" className={styles.continuar}>
            <img src={continuar} alt="Continuar" />
          </button> 

        </form>

    <div className={styles.elementosFooter}>
      <picture>
        <source media="(min-width: 768px)" srcSet={violao} />
        <source media="(max-width: 767px)" srcSet={violao2} />
        <img className={styles.violao} src={violao} alt="vilao" />
      </picture>

      <img className={styles.danca} src={danca} alt="danca" />
    </div>

    <Link to="/InicialJogos" className={styles.setaVoltar}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

      <div className={styles.fundoForm}>

      </div>
        
    </div>
  );
};

export default Entrar;