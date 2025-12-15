export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  college: string;
  skills?: string[];
  interests?: string[];
  year?: string;
}
