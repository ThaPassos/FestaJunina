import React from 'react';

interface CoinDisplayProps {
  totalCoins: number;
  gameCoins?: number;
  showGameCoins?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({
  totalCoins,
  gameCoins = 0,
  showGameCoins = false,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`coin-display ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#ffd700',
        color: '#333',
        padding: '8px 12px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '16px',
        ...style
      }}
    >
      <span style={{ fontSize: '18px' }}>🪙</span>
      <span>{totalCoins.toLocaleString()}</span>
      {showGameCoins && gameCoins > 0 && (
        <>
          {/* <span style={{ color: '#666', fontSize: '14px' }}>+{gameCoins}</span> */}
        </>
      )}
    </div>
  );
};