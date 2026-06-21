import bcryptjs from "bcryptjs";
export const bcryptPassword = (password) => {
  const hashed = bcryptjs.hash(password, 10);
  return hashed;
};

export const comparePassword = (password, DataPassword) => {
  const compared = bcryptjs.compare(password, DataPassword);
  return compared;
};
