export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email es requerido';
  if (!emailRegex.test(email)) return 'Email inválido';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Contraseña es requerida';
  if (password.length < 6) return 'Contraseña debe tener al menos 6 caracteres';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'Nombre es requerido';
  if (name.trim().length < 2) return 'Nombre debe tener al menos 2 caracteres';
  return null;
};

export const validateExperience = (years: number): string | null => {
  if (years < 0) return 'Años de experiencia no puede ser negativo';
  if (years > 50) return 'Años de experiencia no puede ser mayor a 50';
  return null;
};
export const validateAge = (age: number): string | null => {
  if (age < 10) return 'Edad mínima es 10 años';
  if (age > 80) return 'Edad máxima es 80 años';
  return null;
};

export const validateNationality = (nationality: string): string | null => {
  if (!nationality) return 'Nacionalidad es requerida';
  if (nationality.trim().length < 2) return 'Nacionalidad debe tener al menos 2 caracteres';
  return null;
};