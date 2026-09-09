const fs = require('fs');

let content = fs.readFileSync('src/utils/adminAuthentication.ts', 'utf-8');

// If we haven't mocked auth yet
if (!content.includes('import.meta.env.VITE_SUPABASE_URL')) {
  // Add the mock logic to registerAdmin
  content = content.replace(
    `export async function registerAdmin(params: {
  name: string;
  email: string;
  password: string;
  pin: string;
}): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    if (params.pin.trim() !== MASTER_SECURITY_PIN) {
      return { success: false, error: 'O PIN de segurança está incorreto.' };
    }`,
    `export async function registerAdmin(params: {
  name: string;
  email: string;
  password: string;
  pin: string;
}): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    if (params.pin.trim() !== MASTER_SECURITY_PIN) {
      return { success: false, error: 'O PIN de segurança está incorreto.' };
    }
    
    // Simulate delay and return mock session if Supabase is not configured
    if (!import.meta.env.VITE_SUPABASE_URL) {
      await new Promise(r => setTimeout(r, 500));
      return {
        success: true,
        session: {
          user: { id: 'mock-id-' + Date.now(), name: params.name, email: params.email, role: 'master' },
          loginTime: new Date().toISOString()
        }
      };
    }`
  );

  // Add the mock logic to loginAdmin
  content = content.replace(
    `export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });`,
    `export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  try {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      await new Promise(r => setTimeout(r, 500));
      return {
        success: true,
        session: {
          user: { id: 'mock-id-1', name: 'Admin', email, role: 'master' },
          loginTime: new Date().toISOString()
        }
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });`
  );

  fs.writeFileSync('src/utils/adminAuthentication.ts', content);
}
