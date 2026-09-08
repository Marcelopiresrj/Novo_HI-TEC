import { AdminAccount, AdminSession, StoreSettings } from '../types';
import { supabase } from '../lib/supabase';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'Hi-Tech Eletrônicos',
  storeHandle: '@hitecheletronicos',
  specialtyTitle: 'Montagem e Manutenção de Celulares e Tablets • Venda de Games e Acessórios',
  servicesDescription: 'Troca de Telas, Touch, Conectores, Microfone, Baterias, Câmeras e Alto-falantes',
  whatsappNumber: '5522998706841',
  whatsappDisplay: '(22) 99870-6841',
  whatsappDefaultMsg: 'Olá! Gostaria de um orçamento para montagem/manutenção de celular/tablet.',
  instagramUrl: 'https://www.instagram.com/hitecheletronicos/',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJpQHbaLq0lwARw4-9Eg-uzbY',
  address: 'Av. Jane Maria Martins Figueira, 12 - Jardim Marileia, Rio das Ostras - RJ, 28896-052',
  hoursWeekday: 'Segunda a Sexta: 09:00 às 18:30',
  hoursSaturday: 'Sábado: 09:00 às 14:30',
  hoursSunday: 'Domingo: Fechado',
  holidayNote: 'Em feriados os horários podem sofrer alterações',
  pixKey: '22998706841',
  pixReceiver: 'Hi-Tech Eletrônicos',
};

export const MASTER_SECURITY_PIN = "123456";

export async function registerAdmin(params: {
  name: string;
  email: string;
  password: string;
  pin: string;
}): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    if (params.pin.trim() !== MASTER_SECURITY_PIN) {
      return { success: false, error: 'O PIN de segurança está incorreto.' };
    }

    const role = 'master'; 
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          name: params.name,
          role: role,
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error("Erro desconhecido ao criar usuário");
    if (!data.session) throw new Error("Por favor, desative a opção 'Confirm email' nas configurações do Supabase (Authentication -> Providers -> Email) para permitir o login automático, ou confirme o seu email.");

    return { 
       success: true, 
       session: {
        user: { id: data.user.id, name: params.name, email: params.email, role },
        loginTime: new Date().toISOString()
      } 
     };
  } catch (error: any) {
    console.error("Registration error:", error);
    let errorMessage = error.message || error;
    if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('already registered')) {
      errorMessage = 'Este e-mail já está cadastrado! Vá na aba "Entrar" e tente fazer o login.';
    }
    return { success: false, error: errorMessage };
  }
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    const role = data.user?.user_metadata?.role || 'admin';
    const name = data.user?.user_metadata?.name || 'Admin';

    return { 
       success: true, 
       session: {
        user: { id: data.user.id, name, email, role },
        loginTime: new Date().toISOString()
      } 
     };
  } catch (error: any) {
    return { success: false, error: 'Credenciais inválidas.' };
  }
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function recoverPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export function subscribeToAuthChanges(callback: (session: AdminSession | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
        const role = session.user.user_metadata?.role || 'admin';
        const name = session.user.user_metadata?.name || 'Admin';
        
        callback({
          user: { id: session.user.id, name, email: session.user.email || '', role },
          loginTime: new Date().toISOString()
        });
    } else {
        callback(null);
    }
  });
  
  // Return an unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}
