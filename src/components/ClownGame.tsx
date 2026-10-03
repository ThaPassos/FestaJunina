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
import { Link } from 'react-router-dom';
import { useCoins } from '../hooks/useCoins';
import { CoinDisplay } from './CoinDisplay';

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

  // Hook para gerenciar moedas
  const { totalCoins, gameCoins, addCoins } = useCoins();

  const [, setScore] = useState(0);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setClownPosition(prev => {
        const minX = 30; 
        const maxX = 55; 
        const minY = 30; 
        const maxY = 38;
        
        let newX = prev.x + (Math.random() * 4 - 2); 
        let newY = prev.y + (Math.random() * 2 - 1); 
        
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
        
        return { x: newX, y: newY };
      });
    }, 200);

    return () => clearInterval(moveInterval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
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
    
    const x = e.clientX - rect.left - ballRef.current.width / 2;
    const y = e.clientY - rect.top - ballRef.current.height / 2;

    const boundedX = Math.max(0, Math.min(rect.width - ballRef.current.width, x));
    const boundedY = Math.max(0, Math.min(rect.height - ballRef.current.height, y));

    ballRef.current.style.left = `${boundedX}px`;
    ballRef.current.style.top = `${boundedY}px`;
    
    checkCollision(boundedX + ballRef.current.width / 2, boundedY + ballRef.current.height / 2);
  };

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

  const checkCollision = async (ballX: number, ballY: number) => {
    const clown = clownRef.current;
    const ball = ballRef.current;

    if (clown && ball && gameAreaRef.current) {
      const clownRect = clown.getBoundingClientRect();
      const gameRect = gameAreaRef.current.getBoundingClientRect();
      
      const mouthCenterX = (clownRect.left - gameRect.left) + clownRect.width / 2;
      const mouthCenterY = (clownRect.top - gameRect.top) + clownRect.height / 1.5;

      const distance = Math.hypot(ballX - mouthCenterX, ballY - mouthCenterY);

      if (distance < 40) {
        const bonusChance = Math.random();
        let points = 10;
        
        if (bonusChance > 0.9) {
          points = 60;
          setShowBonus(true);
          setTimeout(() => setShowBonus(false), 1000);
        } else if (bonusChance > 0.8) {
          points = 40;
        }
        
        const comboMultiplier = 1 + combo * 0.2;
        points = Math.floor(points * comboMultiplier);
        
        setScore(prev => prev + points);
        setFall(true);
        setCombo(prev => prev + 1);
        
        // Adiciona moedas ao sistema global
        try {
          await addCoins(points);
          console.log(`✅ Adicionadas ${points} moedas ao total global!`);
        } catch (error) {
          console.error('Erro ao adicionar moedas:', error);
        }
        
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
        <CoinDisplay 
          totalCoins={totalCoins}
          gameCoins={gameCoins}
          showGameCoins={true}
        />
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