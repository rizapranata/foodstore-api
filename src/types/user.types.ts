export interface UserTypes {
  _id: string;
  full_name: string;
  email: string;
  role: "guest" | "user" | "admin";
  password: string;
  user_id: number;
}