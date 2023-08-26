import { gql } from "@apollo/client";

export const GET_USER_FAVORITE_POI_QUERY = gql`
  query GetUserFavoritePOI($userId: Float!) {
    getUserFavorites(userId: $userId) {
      pointOfInterest {
        id
      }
    }
  }
`;
