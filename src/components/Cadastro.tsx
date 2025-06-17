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

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Primeiro, cadastrar o usuário
      const response = await fetch('http://localhost:8080/usuarios/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          cpf: cpf.replace(/\D/g, '') // remove máscara antes de enviar
        })
      });

      if (response.ok) {
        // Se há foto selecionada, fazer upload
        if (fotoPerfil) {
          const formData = new FormData();
          formData.append('cpf', cpf.replace(/\D/g, ''));
          formData.append('file', fotoPerfil);

          const uploadResponse = await fetch('http://localhost:8080/usuarios/upload-foto', {
            method: 'POST',
            body: formData
          });

          if (!uploadResponse.ok) {
            console.warn('Erro ao fazer upload da foto, mas cadastro foi realizado');
          }
        }

        alert('Cadastro realizado com sucesso!');
        navigate('/entrar');
      } else {
        const erro = await response.text();
        alert('Erro ao cadastrar: ' + erro);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro inesperado no cadastro!');
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB!');
        return;
      }

      setFotoPerfil(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewFoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
              type="email"
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

          <div className={styles.inputGroup}>
            <label className={styles.label}>Foto de Perfil (opcional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className={styles.inputField}
            />
            {previewFoto && (
              <div className={styles.previewContainer}>
                <img
                  src={previewFoto}
                  alt="Preview"
                  className={styles.previewImage}
                />
              </div>
            )}
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

export default Cadastro;
