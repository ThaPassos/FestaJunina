
const API_BASE_URL = 'http://localhost:8080';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  moedas?: number;
  fotoPerfil?: string;
}

interface LoginRequest {
  cpf: string;
  email: string;
}

export interface VoucherResponse {
  codigo: string;
  mensagem?: string;
}

interface MoedasResponse {
  moedas: number;
}

interface ErrorResponse {
  mensagem: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async cadastrarUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao cadastrar usuário');
    }

    return response.json();
  }

  async loginUsuario(loginData: LoginRequest): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao fazer login');
    }

    const usuario = await response.json();
    localStorage.setItem('cpfUsuario', usuario.cpf);
    localStorage.setItem('emailUsuario', usuario.email);
    return usuario;
  }

  async consultarPerfil(cpf: string): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuarios/perfil?cpf=${encodeURIComponent(cpf)}`);

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao consultar perfil');
    }

    return response.json();
  }

  async obterFotoPerfil(cpf: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/usuarios/foto?cpf=${encodeURIComponent(cpf)}`);
    
    if (!response.ok) {
      throw new Error('Erro ao obter foto de perfil');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  async adicionarMoedas(cpf: string, quantidade: number): Promise<MoedasResponse> {
    const response = await fetch(`${this.baseUrl}/usuarios/adicionar-moedas?cpf=${encodeURIComponent(cpf)}&quantidade=${quantidade}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao adicionar moedas');
    }

    return response.json();
  }

  async consultarMoedas(cpf: string): Promise<number> {
    console.log(`🔍 Consultando moedas para CPF: ${cpf}`);
    const response = await fetch(`${this.baseUrl}/usuarios/consultar-moedas?cpf=${encodeURIComponent(cpf)}`);

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao consultar moedas');
    }

    const data = await response.json();
    console.log('📊 Resposta do backend para consultar moedas:', data);
    
    // Tenta diferentes possíveis campos de resposta
    const moedas = data.moedas ?? data.coins ?? data.total ?? data ?? 0;
    console.log(`💰 Moedas extraídas: ${moedas}`);
    
    return moedas;
  }

  async gerarVoucher(cpf: string, voucherId: number): Promise<VoucherResponse> {
    console.log(`🎫 Gerando voucher - CPF: ${cpf}, Voucher ID: ${voucherId}`);
    
    const response = await fetch(`${this.baseUrl}/vouchers/gerar?cpf=${encodeURIComponent(cpf)}&voucherId=${voucherId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`📡 Status da resposta: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro na resposta do servidor:`, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.mensagem || 'Erro ao gerar voucher');
      } catch {
        throw new Error(`Erro ${response.status}: ${errorText || 'Erro inesperado ao gerar voucher'}`);
      }
    }

    const data = await response.json();
    console.log('✅ Voucher gerado com sucesso:', data);
    return data;
  }

  async listarVouchersUsuario(cpf: string): Promise<VoucherResponse[]> {
    const response = await fetch(`${this.baseUrl}/vouchers/usuario/${encodeURIComponent(cpf)}`);

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.mensagem || 'Erro ao listar vouchers');
    }

    return response.json();
  }
}

export const apiService = new ApiService();