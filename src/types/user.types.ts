export interface UserTypes {
  _id: string;
  full_name: string;
  email: string;
  role: "guest" | "user" | "admin";
  user_id: number;
}