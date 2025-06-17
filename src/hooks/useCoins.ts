import { useState, useEffect, useCallback } from 'react';

interface CoinState {
  totalCoins: number;
  gameCoins: number;
}

export const useCoins = () => {
  const [coinState, setCoinState] = useState<CoinState>({
    totalCoins: 0,
    gameCoins: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCoins = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Carrega do localStorage com fallback para 0
      const localCoins = parseInt(localStorage.getItem('userCoins') || '0', 10);
      const savedGameCoins = parseInt(localStorage.getItem('gameCoins') || '0', 10);
      
      console.log(`💰 Carregando moedas - localStorage: ${localCoins}, gameCoins: ${savedGameCoins}`);
      
      setCoinState({
        totalCoins: localCoins,
        gameCoins: savedGameCoins
      });

      // Sincroniza com backend se houver CPF
      const cpf = localStorage.getItem('cpfUsuario');
      if (cpf) {
        console.log('🔄 Sincronizando com backend...');
        await refreshCoins();
      }
    } catch (error) {
      console.error('Erro ao carregar moedas:', error);
      setError('Erro ao carregar moedas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  const addCoins = useCallback(async (amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`➕ Adicionando ${amount} moedas`);
      
      // Atualiza estado local
      setCoinState(prev => {
        const newTotal = (prev.totalCoins || 0) + amount;
        const newGame = (prev.gameCoins || 0) + amount;
        
        localStorage.setItem('userCoins', newTotal.toString());
        localStorage.setItem('gameCoins', newGame.toString());
        
        console.log(`💰 Novas moedas - Total: ${newTotal}, Game: ${newGame}`);
        
        return {
          totalCoins: newTotal,
          gameCoins: newGame
        };
      });

      // Sincroniza com backend
      const cpf = localStorage.getItem('cpfUsuario');
      if (cpf) {
        await fetch(`http://localhost:8080/usuarios/adicionar-moedas?cpf=${cpf}&quantidade=${amount}`, {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar moedas:', error);
      setError('Erro ao adicionar moedas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetGameCoins = useCallback(() => {
    setCoinState(prev => ({
      ...prev,
      gameCoins: 0
    }));
    localStorage.removeItem('gameCoins');
  }, []);

  const refreshCoins = useCallback(async () => {
    const cpf = localStorage.getItem('cpfUsuario');
    if (!cpf) return 0;

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Consultando moedas no backend...');
      const response = await fetch(`http://localhost:8080/usuarios/consultar-moedas?cpf=${cpf}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dados recebidos do backend:', data);
        
        // Usa o campo moedas da sua API
        const moedas = data.moedas ?? data.coins ?? data.total ?? data ?? 0;
        console.log(`💰 Moedas sincronizadas: ${moedas}`);
        
        setCoinState(prev => ({
          ...prev,
          totalCoins: moedas
        }));
        
        localStorage.setItem('userCoins', moedas.toString());
        return moedas;
      }
      throw new Error('Falha ao buscar moedas');
    } catch (error) {
      console.error('Erro ao sincronizar com backend:', error);
      setError('Erro ao sincronizar moedas');
      return coinState.totalCoins;
    } finally {
      setIsLoading(false);
    }
  }, [coinState.totalCoins]);

  const updateCoins = useCallback((amount: number) => {
    console.log(`💰 Atualizando moedas localmente: ${amount}`);
    setCoinState(prev => {
      const newTotal = (prev.totalCoins || 0) + amount;
      const newState = {
        ...prev,
        totalCoins: Math.max(0, newTotal)
      };
      
      console.log(`💰 Moedas antes: ${prev.totalCoins}, depois: ${newState.totalCoins}`);
      
      // Salva no localStorage
      localStorage.setItem('userCoins', newState.totalCoins.toString());
      
      return newState;
    });
  }, []);

  const subtractCoins = useCallback((amount: number) => {
    updateCoins(-amount);
  }, [updateCoins]);

  const syncWithBackend = useCallback(async () => {
    console.log('🔄 Sincronizando moedas com backend...');
    return await refreshCoins();
  }, [refreshCoins]);

  return {
    totalCoins: coinState.totalCoins,
    gameCoins: coinState.gameCoins,
    addCoins,
    updateCoins,
    subtractCoins,
    resetGameCoins,
    loadCoins,
    refreshCoins,
    syncWithBackend,
    isLoading,
    error
  };
};