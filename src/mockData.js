export const MAJOR_HEADS = ['Personal', 'Professional'];
export const PERSONAL_NAMES = ['John', 'Tom', 'Jeevan', 'Priya', 'Dev', 'Sana'];
export const PROFESSIONAL_DEPARTMENTS = ['Accounts', 'HR', 'IT', 'Finance', 'Operations', 'Legal'];

export const minorHeadOptions = (majorHead) =>
  majorHead === 'Personal' ? PERSONAL_NAMES : majorHead === 'Professional' ? PROFESSIONAL_DEPARTMENTS : [];