import { gql } from "@apollo/client";

export const GET_ALL_CITIES = gql`
  query GetAllCities {
    getAllCities {
      id
      name
      coordinates
    }
  }
`;
