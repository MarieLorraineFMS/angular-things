export interface User {
  id: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  password: string;
  avatar: string;
  userRoles: USER_ROLES[];
}

export enum USER_ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
