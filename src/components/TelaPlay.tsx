import React from 'react';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import botao from '../assets/imagens/botão.png';
import violao from '../assets/imagens/violão.png';
import violao2 from '../assets/imagens/violão2.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import danca from '../assets/imagens/dança.png';
import styles from './TelaPlay.module.css';

const TelaPlay: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.bandeiraContainer}>
        <picture>
          <source media="(min-width: 768px)" srcSet={bandeirasPc} />
          <source media="(max-width: 767px)" srcSet={bandeirasCell} />
          <img className={styles.bandeira} src={bandeirasPc} alt="Bandeiras" />
        </picture>
      </div>

      {/* Logo centralizado */}
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={logo} alt="TROCA-TROCA JUNINO" />
      </div>

      {/* Botão central */}
      <div className={styles.botaoContainer}>
        <Link to="/cadastrar">
          <motion.img
            src={botao}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={styles.botao}
            alt="Botão Jogar"
          />
        </Link>
      </div>

      {/* Rodapé com elementos */}
      <div className={styles.footer}>
        <picture>
          <source media="(min-width: 768px)" srcSet={violao} />
          <source media="(max-width: 767px)" srcSet={violao2} />
          <img className={styles.violao} src={violao} alt="Violão" />
        </picture>
        
        <img className={styles.danca} src={danca} alt="Dança" />
      </div>
    </div>
  );
};

export default TelaPlay;