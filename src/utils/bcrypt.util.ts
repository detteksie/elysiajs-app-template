export const hashPassword = async (password: string) => {
  const hash = await Bun.password.hash(password, {
    algorithm: 'bcrypt',
    cost: 12, // number between 4-31
  });
  return hash;
};

export const comparePassword = async (password: string, hash: string) => {
  const isMatch = Bun.password.verify(password, hash, 'bcrypt');
  return isMatch;
};
