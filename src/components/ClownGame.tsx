import React, { useRef, useState, useEffect } from 'react';
import clownImg from '../assets/imagens/palhacoJogo.png';
import ballImg from '../assets/imagens/bolaa.png';
import barracaImg from '../assets/imagens/barraca.png';
import styles from '../components/ClownGame.module.css';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png';
import violao2 from '../assets/imagens/violão2.png';
import danca from '../assets/imagens/dança.png';
import logo2 from '../assets/imagens/Logo2.png';
import { motion } from 'framer-motion';
import moeda from '../assets/imagens/moeda.png';
import { Link } from 'react-router-dom';
export const ClownGame = () => {
  const ballRef = useRef<HTMLImageElement>(null);
  const clownRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const barracaRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [fall, setFall] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [clownPosition, setClownPosition] = useState({ x: 47, y: 35 });
  const [combo, setCombo] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [showPoints, setShowPoints] = useState<{points: number, x: number, y: number} | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Inicializa e atualiza a posição da bola de forma responsiva
  useEffect(() => {
    const updateBallPosition = () => {
      if (gameAreaRef.current && ballRef.current) {
        const gameArea = gameAreaRef.current.getBoundingClientRect();
        const initialX = gameArea.width * 0.6898;  // 70% da largura
        const initialY = gameArea.height * 0.85; // 80% da altura
      }
    };

    // Atualiza imediatamente
    updateBallPosition();

    // Configura o observer de redimensionamento
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      updateBallPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Movimento aleatório do palhaço
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setClownPosition(prev => {
        // Limites da barraca ajustados
        const minX = 30; 
        const maxX = 55; 
        const minY = 30; 
        const maxY = 38;
        
        // Movimento mais suave
        let newX = prev.x + (Math.random() * 4 - 2); 
        let newY = prev.y + (Math.random() * 2 - 1); 
        
        // Garante que o palhaço não saia dos limites
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
        
        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      resetBallPosition();
    }
  };

  const resetBallPosition = () => {
    if (gameAreaRef.current && ballRef.current) {
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const initialX = gameArea.width * 0.48;
      const initialY = gameArea.height * 0.85;
      
      ballRef.current.style.left = `${initialX}px`;
      ballRef.current.style.top = `${initialY}px`;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ballRef.current || !gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current;
    const rect = gameArea.getBoundingClientRect();
    
    // Calcula a posição relativa dentro da gameArea
    const x = e.clientX - rect.left - ballRef.current.width / 2;
    const y = e.clientY - rect.top - ballRef.current.height / 2;

    // Limita a bola à área do jogo
    const boundedX = Math.max(0, Math.min(rect.width - ballRef.current.width, x));
    const boundedY = Math.max(0, Math.min(rect.height - ballRef.current.height, y));

    ballRef.current.style.left = `${boundedX}px`;
    ballRef.current.style.top = `${boundedY}px`;
    
    checkCollision(boundedX + ballRef.current.width / 2, boundedY + ballRef.current.height / 2);
  };

  // Função para touch events
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !ballRef.current || !gameAreaRef.current) return;
    
    const touch = e.touches[0];
    const gameArea = gameAreaRef.current;
    const rect = gameArea.getBoundingClientRect();
    
    const x = touch.clientX - rect.left - ballRef.current.width / 2;
    const y = touch.clientY - rect.top - ballRef.current.height / 2;

    const boundedX = Math.max(0, Math.min(rect.width - ballRef.current.width, x));
    const boundedY = Math.max(0, Math.min(rect.height - ballRef.current.height, y));

    ballRef.current.style.left = `${boundedX}px`;
    ballRef.current.style.top = `${boundedY}px`;
    
    checkCollision(boundedX + ballRef.current.width / 2, boundedY + ballRef.current.height / 2);
  };

  const showPointsGained = (points: number, x: number, y: number) => {
    setShowPoints({ points, x, y });
    setTimeout(() => setShowPoints(null), 1000);
  };

  const checkCollision = (ballX: number, ballY: number) => {
    const clown = clownRef.current;
    const ball = ballRef.current;

    if (clown && ball && gameAreaRef.current) {
      const clownRect = clown.getBoundingClientRect();
      const gameRect = gameAreaRef.current.getBoundingClientRect();
      
      const mouthCenterX = (clownRect.left - gameRect.left) + clownRect.width / 2;
      const mouthCenterY = (clownRect.top - gameRect.top) + clownRect.height / 1.5;

      const distance = Math.hypot(ballX - mouthCenterX, ballY - mouthCenterY);

      // Sistema de pontuação
      if (distance < 40) {
        const bonusChance = Math.random();
        let points = 50;
        
        if (bonusChance > 0.9) {
          points = 500;
          setShowBonus(true);
          setTimeout(() => setShowBonus(false), 1000);
        } else if (bonusChance > 0.8) {
          points = 200;
        }
        
        const comboMultiplier = 1 + combo * 0.2;
        points = Math.floor(points * comboMultiplier);
        
        setScore(prev => prev + points);
        setFall(true);
        setCombo(prev => prev + 1);
        
        showPointsGained(points, mouthCenterX, mouthCenterY);
        
        setTimeout(() => setFall(false), 1000);
        resetBallPosition();
        setIsDragging(false);
      } else if (distance < 80) {
        const points = 0;
        setScore(prev => prev + points);
        setCombo(0);
        showPointsGained(points, mouthCenterX, mouthCenterY);
      } else {
        setCombo(0);
      }
    }
  };

  return (
    <div 
      ref={gameAreaRef}
      className={styles.gameArea} 
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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

      <div className={styles.moedaContainer}>
        <img src={moeda} alt="Moeda" className={styles.moedaIcon} />
        <span className={styles.moedaTexto}>{score.toString().padStart(2, '0')}</span>
        {combo > 1 && <span className={styles.comboText}>Combo x{combo}</span>}
        {showBonus && <span className={styles.bonusText}>BÔNUS!</span>}
      </div>

      {showPoints && (
        <motion.div 
          className={styles.pointsPopup}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -50 }}
          transition={{ duration: 1 }}
          style={{
            left: `${showPoints.x}px`,
            top: `${showPoints.y}px`,
          }}
        >
          +{showPoints.points}
        </motion.div>
      )}

      <div className={styles.barraca} ref={barracaRef}>
        <img src={barracaImg} alt="Barraca" className={styles.barracaImg} />
        <div 
          ref={clownRef} 
          className={`${styles.clown} ${fall ? styles.fall : ''}`}
          style={{
            left: `${clownPosition.x}%`,
            top: `${clownPosition.y}%`,
            transition: 'all 0.2s ease'
          }}
        >
          <img src={clownImg} alt="Palhaço" />
        </div>
      </div>

      <div className={styles.botaoo}>
        <motion.img
          src={ballImg}
          ref={ballRef}
          initial={{ scale: 1 }}
          animate={{ scale: isDragging ? 1.1 : [1, 1.1, 1] }}
          transition={{ repeat: isDragging ? 0 : Infinity, duration: 0.5 }}
          className={styles.ball}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          alt="Bola"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
          draggable="false"
        />
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
    </div>
  );
};

export default ClownGame;