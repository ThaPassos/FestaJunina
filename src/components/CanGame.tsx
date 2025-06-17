import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ballImg from '../assets/imagens/bolaa.png';
import barracaImg from '../assets/imagens/barraca.png';
import styles from '../components/CanGame.module.css';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png';
import violao2 from '../assets/imagens/violão2.png';
import danca from '../assets/imagens/dança.png';
import logo2 from '../assets/imagens/Logo2.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Can3D } from './Can3D';
import { useCoins } from '../hooks/useCoins';
import { CoinDisplay } from './CoinDisplay';

interface Can {
  id: number;
  x: number;
  y: number;
  z: number;
  isHit: boolean;
  isFalling: boolean;
}

// Hook para detectar tamanho da tela
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// ... mantenho todas as funções de configuração responsiva existentes
const getResponsiveCansConfig = (windowWidth) => {
  if (windowWidth <= 480) {
    return {
      scale: 0.6,
      spacing: 0.8,
      positions: [
        { id: 1, x: -1.2, y: -0.4, z: 0 },
        { id: 2, x: -0.4, y: -0.4, z: 0 },
        { id: 3, x: 0.4, y: -0.4, z: 0 },
        { id: 4, x: 1.2, y: -0.4, z: 0 },
        { id: 5, x: -0.8, y: 0.6, z: 0 },
        { id: 6, x: 0, y: 0.6, z: 0 },
        { id: 7, x: 0.8, y: 0.6, z: 0 },
        { id: 8, x: -0.4, y: 1.6, z: 0 },
        { id: 9, x: 0.4, y: 1.6, z: 0 },
        { id: 10, x: 0, y: 2.6, z: 0 },
      ]
    };
  } else if (windowWidth <= 767) {
    return {
      scale: 0.7,
      spacing: 0.9,
      positions: [
        { id: 1, x: -1.3, y: -0.45, z: 0 },
        { id: 2, x: -0.45, y: -0.45, z: 0 },
        { id: 3, x: 0.45, y: -0.45, z: 0 },
        { id: 4, x: 1.3, y: -0.45, z: 0 },
        { id: 5, x: -0.9, y: 0.45, z: 0 },
        { id: 6, x: 0, y: 0.45, z: 0 },
        { id: 7, x: 0.9, y: 0.45, z: 0 },
        { id: 8, x: -0.45, y: 1.35, z: 0 },
        { id: 9, x: 0.45, y: 1.35, z: 0 },
        { id: 10, x: 0, y: 2.25, z: 0 },
      ]
    };
  } else if (windowWidth <= 1024) {
    return {
      scale: 0.85,
      spacing: 1.1,
      positions: [
        { id: 1, x: -1.4, y: -0.5, z: 0 },
        { id: 2, x: -0.5, y: -0.5, z: 0 },
        { id: 3, x: 0.5, y: -0.5, z: 0 },
        { id: 4, x: 1.4, y: -0.5, z: 0 },
        { id: 5, x: -0.95, y: 0.5, z: 0 },
        { id: 6, x: 0, y: 0.5, z: 0 },
        { id: 7, x: 0.95, y: 0.5, z: 0 },
        { id: 8, x: -0.5, y: 1.4, z: 0 },
        { id: 9, x: 0.5, y: 1.4, z: 0 },
        { id: 10, x: 0, y: 2.3, z: 0 },
      ]
    };
  } else {
    return {
      scale: 1,
      spacing: 1,
      positions: [
        { id: 1, x: -1.5, y: -0.5, z: 0 },
        { id: 2, x: -0.5, y: -0.5, z: 0 },
        { id: 3, x: 0.5, y: -0.5, z: 0 },
        { id: 4, x: 1.5, y: -0.5, z: 0 },
        { id: 5, x: -1, y: 0.5, z: 0 },
        { id: 6, x: 0, y: 0.5, z: 0 },
        { id: 7, x: 1, y: 0.5, z: 0 },
        { id: 8, x: -0.5, y: 1.5, z: 0 },
        { id: 9, x: 0.5, y: 1.5, z: 0 },
        { id: 10, x: 0, y: 2.5, z: 0 },
      ]
    };
  }
};

const getResponsiveCameraConfig = (windowWidth) => {
  if (windowWidth <= 480) {
    return { position: [0, 1, 8], fov: 75 };
  } else if (windowWidth <= 767) {
    return { position: [0, 1, 7.5], fov: 70 };
  } else if (windowWidth <= 1024) {
    return { position: [0, 1, 7.2], fov: 68 };
  } else {
    return { position: [0, 1, 7], fov: 65 };
  }
};

const getResponsiveCanvasStyle = (windowWidth) => {
  if (windowWidth <= 480) {
    return {
      position: 'absolute',
      top: '20%',
      left: '45%',
      transform: 'translateX(-50%)',
      width: '250px',
      height: '450px',
      zIndex: 5
    };
  } else if (windowWidth <= 767) {
    return {
      position: 'absolute',
      top: '20%',
      left: '45%',
      transform: 'translateX(-50%)',
      width: '250px',
      height: '450px',
      zIndex: 5
    };
  } else {
    return {
      position: 'absolute',
      top: '28%',
      left: '36.5%',
      width: '400px',
      height: '580px',
      zIndex: 5
    };
  }
};

const Scene = ({ cans, key: sceneKey }: { cans: Can[], key: string | number }) => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
    <pointLight position={[0, 5, 0]} intensity={0.5} />
    {cans.map(can => (
      <Can3D 
        key={`${sceneKey}-${can.id}`}
        position={[can.x, can.y, can.z]} 
        isHit={can.isHit}
        isFalling={can.isFalling}
      />
    ))}
    <Environment preset="sunset" />
  </>
);

export const CanGame = () => {
  const ballRef = useRef<HTMLImageElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
  const [showPoints, setShowPoints] = useState<{points: number, x: number, y: number} | null>(null);
  const [cans, setCans] = useState<Can[]>([]);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [isBallThrown, setIsBallThrown] = useState(false);
  const [initialBallPosition, setInitialBallPosition] = useState({ x: 0, y: 0 });
  const [isResetting, setIsResetting] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [canEarnCoins, setCanEarnCoins] = useState(true);
  const [sceneKey, setSceneKey] = useState(0);
  
  // Hook responsivo
  const windowSize = useWindowSize();

  // Hook para gerenciar moedas
  const { totalCoins, gameCoins, addCoins, resetGameCoins } = useCoins();

  // ... resto do código igual, só atualizando as partes relacionadas a moedas

  const getInitialCans = (): Can[] => {
    const config = getResponsiveCansConfig(windowSize.width);
    return config.positions.map(pos => ({
      id: pos.id,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      isHit: false,
      isFalling: false
    }));
  };

  useEffect(() => {
    setCans(getInitialCans());
  }, [windowSize.width]);

  useEffect(() => {
    resetBallPosition();
  }, []);

  useEffect(() => {
    const allCansHit = cans.length > 0 && cans.every(can => can.isHit);
    if (allCansHit && !gameCompleted && !isResetting) {
      setGameCompleted(true);
      console.log('Todas as latas foram derrubadas! Reiniciando jogo em 3 segundos...');
      
      setTimeout(() => {
        restartGame();
      }, 3000);
    }
  }, [cans, gameCompleted, isResetting]);

  const restartGame = () => {
    console.log('Reiniciando jogo - mantendo pontuação:', score);
    
    setIsResetting(true);
    
    const freshCans = getInitialCans();
    setCans(freshCans);
    
    setSceneKey(prev => prev + 1);
    
    resetBallPosition();
    setGameCompleted(false);
    
    setRoundsCompleted(prev => {
      const newRounds = prev + 1;
      if (newRounds >= 3) {
        setCanEarnCoins(false);
      }
      return newRounds;
    });
    
    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };

  useEffect(() => {
    if (!isBallThrown || !ballRef.current || isResetting || gameCompleted) return;

    const animateBall = () => {
      if (!ballRef.current || !isBallThrown) return;

      const deltaX = dragEnd.x - dragStart.x;
      const deltaY = dragEnd.y - dragStart.y;
      const normalizedX = deltaX * 0.02;
      const normalizedY = deltaY * 0.02;

      setBallPosition(prev => ({
        x: prev.x + normalizedX,
        y: prev.y + normalizedY
      }));

      if (canvasRef.current && ballRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const ballRect = ballRef.current.getBoundingClientRect();
        const ballCenterX = ballRect.left + ballRect.width / 2;
        const ballCenterY = ballRect.top + ballRect.height / 2;

        if (
          ballCenterX >= canvasRect.left &&
          ballCenterX <= canvasRect.right &&
          ballCenterY >= canvasRect.top &&
          ballCenterY <= canvasRect.bottom
        ) {
          handleRandomCanHit();
        }
      }

      if (
        ballPosition.y > window.innerHeight + 100 ||
        ballPosition.x < -100 ||
        ballPosition.x > window.innerWidth + 100 ||
        ballPosition.y < -100
      ) {
        resetBallPosition();
      }
    };

    const interval = setInterval(animateBall, 16);
    return () => clearInterval(interval);
  }, [isBallThrown, ballPosition, cans, isResetting, gameCompleted, dragStart, dragEnd]);

  const handleRandomCanHit = async () => {
    if (isResetting || gameCompleted) return;
    setIsResetting(true);

    const availableCans = cans.filter(can => !can.isFalling && !can.isHit);
    if (availableCans.length === 0) {
      setIsResetting(false);
      return;
    }

    const cansToFall = Math.min(Math.floor(Math.random() * 4) + 1, availableCans.length);
    const shuffled = [...availableCans].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, cansToFall).map(can => can.id);

    setCans(prevCans =>
      prevCans.map(can =>
        selected.includes(can.id)
          ? { ...can, isFalling: true, isHit: true }
          : can
      )
    );

    if (canEarnCoins) {
      let points = 0;
      if (cansToFall === 1) points = 10;
      else if (cansToFall === 2) points = 15;
      else if (cansToFall === 3) points = 25;
      else if (cansToFall >= 4) points = 50;
      
      setScore(prev => prev + points);

      // Adiciona moedas ao sistema global
      try {
        await addCoins(points);
        console.log(`✅ Adicionadas ${points} moedas ao total global!`);
      } catch (error) {
        console.error('Erro ao adicionar moedas:', error);
      }

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        showPointsGained(points, rect.width / 2, rect.height / 2);
      }
    }

    setTimeout(() => {
      resetBallPosition();
      setIsResetting(false);
    }, 2000);
  };

  // ... resto dos handlers iguais

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isBallThrown || isResetting || gameCompleted) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isBallThrown || isResetting || gameCompleted) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) setDragEnd({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setDragEnd({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && !isBallThrown && !isResetting && !gameCompleted) throwBall();
  };

  const throwBall = () => {
    setIsBallThrown(true);
    setIsDragging(false);
  };

  const resetBallPosition = () => {
    if (gameAreaRef.current && ballRef.current) {
      const gameArea = gameAreaRef.current.getBoundingClientRect();
      const initialX = gameArea.width * 0.48;
      const initialY = gameArea.height * 0.85;
      setInitialBallPosition({ x: initialX, y: initialY });
      setBallPosition({ x: initialX, y: initialY });
      setBallVelocity({ x: 0, y: 0 });
      setIsBallThrown(false);
      setIsDragging(false);
    }
  };

  const showPointsGained = (points: number, x: number, y: number) => {
    setShowPoints({ points, x, y });
    setTimeout(() => setShowPoints(null), 1000);
  };

  const aimLine = isDragging ? {
    x1: dragStart.x,
    y1: dragStart.y,
    x2: dragEnd.x,
    y2: dragEnd.y
  } : null;

  const cameraConfig = getResponsiveCameraConfig(windowSize.width);
  const canvasStyle = getResponsiveCanvasStyle(windowSize.width);

  return (
    <div 
      ref={gameAreaRef}
      className={styles.gameArea} 
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
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
          <img className={styles.violao} src={violao} alt="violao" />
        </picture>
        <img className={styles.danca} src={danca} alt="danca" />
      </div>

      <div className={styles.moedaContainer}>
        <CoinDisplay 
          totalCoins={totalCoins}
          gameCoins={gameCoins}
          showGameCoins={true}
        />
      </div>

      {canEarnCoins && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '80px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          Rodadas com moedas restantes: {3 - roundsCompleted}
        </div>
      )}

      {!canEarnCoins && (
        <div style={{
          position: 'absolute',
          top: '25px',
          right: windowSize.width <= 767 ? '50px' : '1200px',
          background: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          Modo treino - Sem moedas
        </div>
      )}

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

      {gameCompleted && (
        <motion.div 
          className={styles.gameCompletedMessage}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            zIndex: 20,
            fontSize: windowSize.width <= 767 ? '18px' : '24px',
            fontWeight: 'bold',
            width: windowSize.width <= 767 ? '200px' : 'auto',
            left: windowSize.width <= 767 ? '15%' : '35%',
          }}
        >
          Parabéns! Todas as latas derrubadas!<br />
          <span style={{ fontSize: windowSize.width <= 767 ? '14px' : '16px', 
          }}>Reiniciando em 3 segundos...</span>
        </motion.div>
      )}

      {aimLine && !gameCompleted && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 15
          }}
        >
          <line
            x1={aimLine.x1}
            y1={aimLine.y1}
            x2={aimLine.x2}
            y2={aimLine.y2}
            stroke="#53bb21"
            strokeWidth="3"
            strokeDasharray="5,5"
            opacity="0.8"
          />
          <circle
            cx={aimLine.x2}
            cy={aimLine.y2}
            r="8"
            fill="#53bb21"
            opacity="0.6"
          />
        </svg>
      )}

      <div className={styles.barraca}>
        <img src={barracaImg} alt="Barraca" className={styles.barracaImg} />
        <div 
          className={styles.latas}
          ref={canvasRef}
          style={canvasStyle}
        >
          <Canvas 
            key={sceneKey}
            camera={cameraConfig}
            shadows
            style={{ background: 'transparent' }}
          >
            <Suspense fallback={null}>
              <Scene cans={cans} key={sceneKey} />
              <OrbitControls 
                enablePan={false} 
                enableZoom={false} 
                enableRotate={false}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <div className={styles.botaoo}>
        <motion.img
          src={ballImg}
          ref={ballRef}
          initial={{ scale: 1 }}
          transition={{ repeat: isDragging ? 0 : Infinity, duration: 0.5 }}
          animate={{ 
            scale: isDragging ? 1.1 : isBallThrown ? 0.8 : [1, 1.1, 1],
            x: isBallThrown ? ballPosition.x - initialBallPosition.x : 0,
            y: isBallThrown ? ballPosition.y - initialBallPosition.y : 0,
            opacity: isBallThrown ? 0.8 : 1,
            rotate: isBallThrown ? 360 : 0
          }}
          className={styles.ball}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          alt="Bola"
          style={{ 
            cursor: isBallThrown || gameCompleted ? 'default' : isDragging ? 'grabbing' : 'grab',
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

export default CanGame;