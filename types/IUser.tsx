export interface IUserForm {
  token: any;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserFromDb {
  __typename: string;
  email: string;
  firstname?: string;
  id: number;
  lastname?: string;
  profilePicture?: string;
  username?: string;
  role:  IRole;
}

export interface IRole {
  id: number;
  name: string;
}
export interface IUser {
  __typename: string;
  token: string;
  userFromDB: UserFromDb;
}
