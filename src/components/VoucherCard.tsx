import React from 'react';
import styles from './Vouches.module.css';

interface VoucherCardProps {
  id: number;
  imageUrl: string;
  preco: number;
  onClick: () => void;
  disabled: boolean;
  isPurchasing: boolean;
  showPrice?: boolean;
  isInCooldown?: boolean;
  cooldownTime?: string;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  imageUrl,
  preco,
  onClick,
  disabled,
  isPurchasing,
  showPrice = false,
  isInCooldown = false,
}) => {
  const isClickable = !disabled && !isPurchasing && !isInCooldown;

  return (
    <div 
      className={`${styles['voucher-card']} ${disabled ? styles['voucher-disabled'] : ''} ${isPurchasing ? styles['voucher-purchasing'] : ''} ${isInCooldown ? styles['voucher-cooldown'] : ''}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className={styles['voucher-image-container']}>
        <img 
          src={imageUrl} 
          alt="Voucher" 
          className={styles['voucher-image']}
        />
        
        {/* Overlay de carregamento */}
        {isPurchasing && (
          <div className={styles['voucher-loading-overlay']}>
            <div className={styles['loading-spinner']}></div>
          </div>
        )}

        {/* Overlay de desabilitado */}
        {disabled && !isPurchasing && !isInCooldown && (
          <div className={styles['voucher-disabled-overlay']} style={{color:'#fff'}}>
            <span className={styles['disabled-text']}>Moedas Insuficientes</span>
          </div>
        )}
        
        {/* Preço do voucher - só mostra se showPrice for true */}
        {showPrice && (
          <div className={styles['voucher-price-badge']}>
            🪙 {preco}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherCard;
