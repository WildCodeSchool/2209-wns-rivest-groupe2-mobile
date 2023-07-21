import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      email
      username
      type
      firstname
      lastname
      hashedPassword
      profilePicture
    }
  }
`;

export const CREATE_USER = gql`
  mutation Mutation($email: String!, $username: String!, $password: String!) {
    createUser(email: $email, username: $username, password: $password) {
      token
      userFromDB {
        id
        email
        username
        firstname
        lastname
        profilePicture
        role {
          id
          name
        }
      }
    }
  }
`;

