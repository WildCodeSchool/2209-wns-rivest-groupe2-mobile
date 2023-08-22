import { gql } from "@apollo/client";

export const GET_POI_QUERY_BY_CITY = gql`
  query GetAllPoiInCity($cityId: Float!) {
    getAllPoiInCity(cityId: $cityId) {
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

export const GET_POI_BY_ID_QUERY = gql`
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
      openingHours {
        id
        value
        name
        hoursOpen
        hoursClose
      }
      city {
        id
        name
        coordinates
      }
    }
  }
`;

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
