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
  type: string;
  username?: string;
}
export interface IUser {
  __typename: string;
  token: string;
  userFromDB: UserFromDb;
}
