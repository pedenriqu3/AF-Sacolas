export interface User {
  id?: number | string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export default User;
