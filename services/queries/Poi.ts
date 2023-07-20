import { gql } from "@apollo/client";

export const GET_POI_QUERY = gql`
  query GetAllPoi {
    getAllPoi {
      id
      name
      address
      postal
      type
      coordinates
      creationDate
      averageRate
      pictureUrl
      websiteURL
      description
      city {
        id
        name
      }
      openingHours {
        id
        value
        name
        hoursOpen
        hoursClose
      }
      comments {
        id
        createDate
        updateDate
        text
        rate
        user {
          id
          email
          username
        }
      }
    }
  }
`;

export const GET_POI_BY_ID = gql`
query GetPOIbyId($getPoIbyIdId: Float!) {
  getPOIbyId(id: $getPoIbyIdId) {
    id
    name
    address
    postal
    type
    coordinates
    creationDate
    averageRate
    pictureUrl
    websiteURL
    description
    city
    comments {
      id
      createDate
      updateDate
      text
      rate
      user {
        id
        username
        profilePicture
      }
    }
  }
}`

export const GET_USER_COMMENT_POI_QUERY = gql`
  query Query($userId: Float!, $poiId: Float!) {
    getUserCommentForPOI(userId: $userId, poiId: $poiId) {
      id
      createDate
      updateDate
      text
    }
  }
`;

export const GET_COMMENTS_NUMBER_PER_POI = gql`
  query Query($poiId: Float!) {
    getNumberOfCommentsPerPOI(poiId: $poiId)
  }
`;