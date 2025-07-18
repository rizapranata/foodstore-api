export default interface UserTypes {
  _id: string;
  full_name: string;
  email: string;
  role: "guest" | "user" | "admin";
  customer_id: number;
}