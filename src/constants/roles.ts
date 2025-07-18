export const roles = {
  guest: "guest",
  user: "user",
  admin: "admin",
};
export type Role = keyof typeof roles;