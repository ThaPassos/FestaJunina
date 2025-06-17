import { useState, useEffect, useCallback } from 'react';

const COOLDOWN_DURATION = 60 * 1000; // 1 minuto em milliseconds

export const useVoucherCooldown = () => {
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Verifica se está em cooldown ao inicializar
  useEffect(() => {
    const lastPurchase = localStorage.getItem('lastVoucherPurchase');
    if (lastPurchase) {
      const lastPurchaseTime = parseInt(lastPurchase);
      const timeSinceLastPurchase = Date.now() - lastPurchaseTime;
      
      if (timeSinceLastPurchase < COOLDOWN_DURATION) {
        setIsInCooldown(true);
        const remainingTime = COOLDOWN_DURATION - timeSinceLastPurchase;
        startCooldownTimer(remainingTime);
      }
    }
  }, []);

  const startCooldownTimer = (duration: number) => {
    const endTime = Date.now() + duration;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = endTime - now;
      
      if (remaining <= 0) {
        setIsInCooldown(false);
        setTimeRemaining('');
        return;
      }
      
      const seconds = Math.ceil(remaining / 1000);
      setTimeRemaining(`${seconds}s`);
      
      setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
  };

  const recordPurchase = useCallback(() => {
    const now = Date.now();
    localStorage.setItem('lastVoucherPurchase', now.toString());
    setIsInCooldown(true);
    startCooldownTimer(COOLDOWN_DURATION);
    
    console.log('Compra de voucher registrada, cooldown iniciado');
  }, []);

  return {
    isInCooldown,
    timeRemaining,
    recordPurchase
  };
};