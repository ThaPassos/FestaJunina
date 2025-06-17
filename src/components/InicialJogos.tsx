import React from 'react';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png';
import violao2 from '../assets/imagens/violão2.png';
import danca from '../assets/imagens/dança.png';
import palhaco from '../assets/imagens/palhaco.png';
import latas from '../assets/imagens/latas.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button'; // Seu botão de cadastro/entrar
import styles from '../components/InialJogos.module.css';

const InicialJogos: React.FC = () => (
  <div className={styles.container}>
    {/* Top bar com botões */}
    <div className={styles.topBar}>
      <Link to="/" className={styles.setaVoltar}>
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
      <div className={styles.buttonCadastro}>
        <Button />
      </div>
    </div>

    {/* Bandeirinhas topo */}
    <div className={styles.header}>
      <picture>
        <source media="(max-width: 767px)" srcSet={bandeirasCell} />
        <img className={styles.bandeira} src={bandeirasPc} alt="Bandeiras" />
      </picture>
    </div>

    {/* Logo centralizado */}
    <div className={styles.logoArea}>
      <img className={styles.logo} src={logo} alt="Troca-Troca Junino" />
    </div>

    {/* Área dos jogos com os quadrados SVG */}
    <div className={styles.jogosArea}>
      <div className={styles.gradientSquares}>
        <div className={styles.gradientSquareWrap}>
          <svg width="220" height="220" viewBox="0 0 300 300" className={styles.gradientSquare}>
            <defs>
              <linearGradient id="blueGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#202c65" />
                <stop offset="50%" stopColor="#202c65" />
                <stop offset="100%" stopColor="#060d31" />
              </linearGradient>
              <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="15" floodOpacity="0.2"/>
              </filter>
            </defs>
            <rect x="0" y="0" width="220" height="220" rx="24" ry="24" fill="url(#blueGradient1)" filter="url(#shadow1)" />
          </svg>
          <Link to="/JogoLatas" className={styles.cardLink}>
            <motion.img
              src={latas}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={styles.cardImg}
              alt="Acerte as latas"
            />
            <span className={styles.cardText}>Acerte as latas</span>
          </Link>
        </div>
        <div className={styles.gradientSquareWrap}>
          <svg width="220" height="220" viewBox="0 0 300 300" className={styles.gradientSquare}>
            <defs>
              <linearGradient id="blueGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#202c65" />
                <stop offset="50%" stopColor="#202c65" />
                <stop offset="100%" stopColor="#060d31" />
              </linearGradient>
              <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="15" floodOpacity="0.2"/>
              </filter>
            </defs>
            <rect x="0" y="0" width="220" height="220" rx="24" ry="24" fill="url(#blueGradient2)" filter="url(#shadow2)" />
          </svg>

          <Link to="/JogoBocaDoPalhaço" className={styles.cardLink}>
            <motion.img
              src={palhaco}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={styles.cardImg}
              alt="Boca do palhaço"
            />
            <span className={styles.cardText}>Boca do palhaço</span>
          </Link>

        </div>
      </div>
    </div>

    {/* Rodapé com violão e dança */}
    <div className={styles.footer}>
      <picture>
        <source media="(max-width: 767px)" srcSet={violao2} />
        <img className={styles.violao} src={violao} alt="Violão" />
      </picture>
      <img className={styles.danca} src={danca} alt="Dança" />
    </div>
  </div>
);

export default InicialJogos;
