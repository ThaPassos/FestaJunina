import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCoins } from '../hooks/useCoins';
import { CoinDisplay } from './CoinDisplay';
import { VoucherCard } from './VoucherCard';
import { apiService } from '../services/api';
import bandeirasPc from '../assets/imagens/bandeiras-pc.png';
import bandeirasCell from '../assets/imagens/bandeiras-cell.png';
import logo from '../assets/imagens/Logo.png';
import violao from '../assets/imagens/violão.png';
import violao2 from '../assets/imagens/violão2.png';
import danca from '../assets/imagens/dança.png';
import voucher1 from '../assets/imagens/Voucher1.png';
import voucher2 from '../assets/imagens/Voucher2.png';
import voucher3 from '../assets/imagens/Voucher3.png';
import voucher4 from '../assets/imagens/Voucher4.png';
import voucher5 from '../assets/imagens/Voucher5.png';
import voucher6 from '../assets/imagens/Voucher6.png';
import styles from './Vouches.module.css';
import { useVoucherCooldown } from '../hooks/useVoucherCooldown';

interface VoucherData {
  id: number;
  nome: string;
  preco: number;
  imageUrl: string;
  descricao: string;
  categoria: string;
}

export const Voucher = () => {
  const { totalCoins, updateCoins, syncWithBackend } = useCoins();
  const [loading, setLoading] = useState(false);
  const { isInCooldown, timeRemaining, recordPurchase } = useVoucherCooldown();
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [voucherGerado, setVoucherGerado] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mensagem, setMensagem] = useState<string>('');

  // Dados dos vouchers com suas imagens importadas
  const vouchers: VoucherData[] = [
    { 
      id: 1, 
      nome: 'Voucher 50% OFF', 
      preco: 5000, 
      imageUrl: voucher1,
      descricao: 'Desconto de 50% ',
      categoria: 'Desconto'
    },
    { 
      id: 2, 
      nome: 'Vale 1x Pipoca', 
      preco: 600, 
      imageUrl: voucher2,
      descricao: 'Vale para 1 pipoca grátis',
      categoria: 'Brinde'
    },
    { 
      id: 3, 
      nome: 'Voucher 20% OFF', 
      preco: 2200, 
      imageUrl: voucher3,
      descricao: 'Desconto de 20% em produtos',
      categoria: 'Desconto'
    },
    { 
      id: 4, 
      nome: 'Voucher 30% OFF', 
      preco: 3000, 
      imageUrl: voucher4,
      descricao: 'Desconto de 30% em produtos',
      categoria: 'Desconto'
    },
    { 
      id: 5, 
      nome: 'Vale 1x Churros', 
      preco: 1000, 
      imageUrl: voucher5,
      descricao: 'Vale para 1 churros grátis',
      categoria: 'Brinde'
    },
    { 
      id: 6, 
      nome: 'Vale 1x Pastel', 
      preco: 900, 
      imageUrl: voucher6,
      descricao: 'Vale para 1 pastel grátis',
      categoria: 'Brinde'
    }
  ];

  useEffect(() => {
    console.log('🔄 Sincronizando moedas ao carregar componente...');
    syncWithBackend();
  }, [syncWithBackend]);

  const comprarVoucher = async (voucher: VoucherData) => {
    console.log(`🎫 Iniciando compra do voucher: ${voucher.nome} (ID: ${voucher.id})`);
    console.log(`💰 Moedas disponíveis: ${totalCoins}, Preço: ${voucher.preco}`);

    if (isInCooldown) {
      const errorMsg = `Você pode comprar outro voucher em ${timeRemaining}. Aguarde o tempo necessário!`;
      console.log(`⏰ ${errorMsg}`);
      setMensagem(errorMsg);
      setTimeout(() => setMensagem(''), 4000);
      return;
    }

    if (totalCoins < voucher.preco) {
      const errorMsg = `Você não possui moedas suficientes! Necessário: ${voucher.preco} moedas. Você tem: ${totalCoins} moedas.`;
      console.log(`❌ ${errorMsg}`);
      setMensagem(errorMsg);
      setTimeout(() => setMensagem(''), 3000);
      return;
    }

    setLoading(true);
    setPurchasingId(voucher.id);
    setMensagem('');
    
    try {
      const cpf = localStorage.getItem('cpfUsuario');
      if (!cpf) {
        console.error('❌ CPF não encontrado');
        setMensagem('Usuário não está logado!');
        return;
      }

      console.log(`👤 CPF do usuário: ${cpf}`);
      console.log(`🛒 Comprando voucher: ${voucher.nome} (ID: ${voucher.id}) por ${voucher.preco} moedas`);
      
      // CORREÇÃO: Passa o voucher.id em vez de voucher.preco
      const data = await apiService.gerarVoucher(cpf, voucher.id);
      console.log('✅ Voucher gerado com sucesso:', data);
      
      console.log(`💰 Atualizando moedas: ${totalCoins} - ${voucher.preco} = ${totalCoins - voucher.preco}`);
      updateCoins(-voucher.preco);

      recordPurchase();
      
      setTimeout(async () => {
        console.log('🔄 Sincronizando com backend após compra...');
        await syncWithBackend();
      }, 1000);
      
      setVoucherGerado(data.codigo);
      setShowModal(true);
      setMensagem(`${voucher.nome} comprado com sucesso! Código: ${data.codigo}`);

    } catch (error) {
      console.error('❌ Erro detalhado na compra do voucher:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao comprar voucher';
      setMensagem(`Erro: ${errorMessage}`);
      setTimeout(() => setMensagem(''), 3000);
    } finally {
      setLoading(false);
      setPurchasingId(null);
    }
  };

  const fecharModal = () => {
    setShowModal(false);
    setVoucherGerado(null);
    setMensagem('');
  };

  const imprimirVoucher = () => {
    window.print();
  };

  const copiarCodigo = () => {
    if (voucherGerado) {
      navigator.clipboard.writeText(voucherGerado);
      alert('Código copiado para a área de transferência!');
    }
  };

  return (
    <div className={styles.container}>
      {/* Bandeiras do topo - seguindo exatamente o design */}
      <div className={styles.bandeiras}>
        <picture>
          <source media="(min-width: 768px)" srcSet={bandeirasPc} />
          <source media="(max-width: 767px)" srcSet={bandeirasCell} />
          <img 
            src={bandeirasCell}
            alt="Bandeiras decorativas" 
            style={{ width: '100%', height: 'auto' }}
          />
        </picture>
      </div>

      {/* Container principal */}
      <div className={styles['main-container']}>
        {/* Header com botão voltar, logo e moedas */}
        <div className={styles['header-section']}>
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
          
          <div className={styles.logo}>
            <img src={logo} alt="TROCA-TROCA JUNINO" className={styles.logo}/>
          </div>

          <div className={styles.moeda}>
            <CoinDisplay 
              totalCoins={totalCoins}
            />
          </div>
        </div>

        {/* Mensagem de erro/sucesso */}
        {mensagem && (
          <div className={styles.alerta}>
            <p>{mensagem}</p>
          </div>
        )}

        {/* Grid de Vouchers - seguindo o design */}
        <div className={styles.vouchersContainer}>
          <div className={styles.vouchersGrid}>
            {vouchers.map((voucher) => {
              const isDisabled = totalCoins < voucher.preco;
              const isPurchasing = purchasingId === voucher.id;
              
              return (
                <div key={voucher.id} className={styles.VoucherCard}>
                  <VoucherCard
                    id={voucher.id}
                    imageUrl={voucher.imageUrl}
                    preco={voucher.preco}
                    onClick={() => comprarVoucher(voucher)}
                    disabled={isDisabled}
                    isPurchasing={isPurchasing}
                    showPrice={false} 
                    isInCooldown={isInCooldown}
                    cooldownTime={timeRemaining}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Elementos decorativos do rodapé */}
      <div className={styles.elementosFooter}>
        <picture>
          <source media="(min-width: 768px)" srcSet={violao} />
          <source media="(max-width: 767px)" srcSet={violao2} />
          <img src={violao} alt="Violão decorativo" className={styles.violao} />
        </picture>
        
        <img src={danca} alt="Dançarina decorativa" className={styles.danca} />
      </div>

      {/* Modal do código do voucher */}
      {showModal && voucherGerado && (
        <div className={styles['modal-backdrop']} style={{backgroundColor: '#ffff', height: '400px', width: '250px', borderRadius: '10px', padding: '20px', border:'10px, outset', position:'absolute', top:'230px'}}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-body']}>
              <div className={styles['codigo-section']}>
                <p className={styles['codigo-label']}>Código do voucher:</p>
                <div className={styles['codigo-display']}>
                  {voucherGerado}
                  <div className={styles['botoes-modal']} style={{display:'flex', justifyContent:'space-evenly'}}>
                <button onClick={copiarCodigo} className={styles['btn-copiar']}>
                  📋 
                </button>
                <button onClick={imprimirVoucher} className={styles['btn-imprimir']}>
                  🖨️ 
                </button>
              <Link to='/vouchers'>
               <button className={styles['btn-fechar']} onClick={fecharModal}>
                ✅ 
              </button>
              </Link>
                </div>
                </div>
              </div>
              
              <div className={styles['aviso-importante']}>
                <div className={styles['aviso-header']}>
                  <span className={styles['aviso-icon']}>⚠️</span>
                  <div>
                    <p className={styles['aviso-titulo']}>IMPORTANTE:</p>
                    <ul className={styles['aviso-lista']}>
                      <li>Salve este código em local seguro</li>
                      <li>Tire um print desta tela</li>
                      <li>Apresente este código no evento</li>
                      <li>Guarde bem, não há como recuperar!</li>
                    </ul>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voucher;