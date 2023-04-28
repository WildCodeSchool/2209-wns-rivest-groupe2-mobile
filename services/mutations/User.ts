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
