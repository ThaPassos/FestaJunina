import React from 'react';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png'
import violao2 from '../assets/imagens/violão2.png'
import danca from '../assets/imagens/dança.png';
import styles from '../components/InialJogos.module.css';
import logo2 from '../assets/imagens/Logo2.png';
import palhaco from '../assets/imagens/palhaco.png';
import latas from '../assets/imagens/latas.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import { useState, useEffect } from 'react';
import SetaVoltar from './SetaVoltar';

const InicialJogos: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <div className={styles.container}>

        <Button
        style={{
          position: 'absolute',
          top: isMobile ? '3rem' : '30px',
          right: isMobile ? '250px' : '80px',
          zIndex: 999,
        }}
      />

      <picture>
        <source media="(min-width: 768px)" srcSet={bandeirasPc} />
        <source media="(max-width: 767px)" srcSet={bandeirasCell} />
        <img className={styles.bandeira} src={bandeirasPc} alt="Bandeiras" />
      </picture>

      <div className={styles.titulo}>
        <picture>
          <source media="(min-width: 768px)" srcSet={logo} />
          <source media="(max-width: 767px)" srcSet={logo2} />
          <img className={styles.logo} src={logo2} alt="Logo" />
        </picture>
      </div>

      <div className={styles.elementosFooter}>
        <picture>
          <source media="(min-width: 768px)" srcSet={violao} />
          <source media="(max-width: 767px)" srcSet={violao2} />
          <img className={styles.violao} src={violao} alt="vilao" />
        </picture>

        <img className={styles.danca} src={danca} alt="danca" />

      </div>

    <svg 
        width="300" 
        height="300" 
        viewBox="0 0 300 300" 
        className={styles.gradientSquare}
        style={{
            position: 'absolute',
            top: '250px',
            left: '37%',
            transform: 'translateX(-50%)',
            zIndex: 2
        }}
        >
        <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#202c65', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#202c65', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#060d31', stopOpacity: 1}} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="15" floodOpacity="0.2"/>
            </filter>
        </defs>
        
        <rect 
            x="0" 
            y="0" 
            width="300" 
            height="300" 
            rx="15" 
            ry="15" 
            fill="url(#blueGradient)" 
            filter="url(#shadow)"
        />
    </svg>
        
        <svg 
        width="300" 
        height="300" 
        viewBox="0 0 300 300" 
        className={styles.gradientSquare2}
        style={{
            position: 'absolute',
            top: '250px',
            left: '63%',
            transform: 'translateX(-50%)',
            zIndex: 2
        }}
        >
        <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#202c65', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#202c65', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#060d31', stopOpacity: 1}} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="15" floodOpacity="0.2"/>
            </filter>
        </defs>
        
        <rect 
            x="0" 
            y="0" 
            width="300" 
            height="300" 
            rx="15" 
            ry="15" 
            fill="url(#blueGradient)" 
            filter="url(#shadow)"
        />
    </svg>
      
    <div className={styles.jogos}>
<Link to="/InicialJogos">
            <motion.img
                src={latas}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={styles.latas}
                alt="botão"
            />
    </Link>
    
    <Link to="/JogoBocaDoPalhaço">
            <motion.img
                src={palhaco}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={styles.palhaco}
                alt="botão"
            />
    </Link>
    </div >

      <div className={styles.frase}>
        <p className={styles.paragrafo}>Acerte as latas!</p>
        <p className={styles.paragrafo2}>Boca do palhaço</p>
    </div>
    
    <SetaVoltar />

    </div>
  );
};

export default InicialJogos;
