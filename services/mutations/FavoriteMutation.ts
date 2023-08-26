import { gql } from "@apollo/client";

export const TOGGLE_FAVORITE_MUTATION = gql`
  mutation ToggleFavorite($userId: Float!, $poiId: Float!) {
    toggleFavorite(userId: $userId, poiId: $poiId)
  }
`;
