export interface ItemScreenProps {
  route: {
    key: string;
    name: string;
    params: {
      param: {
        pictureUrl: string;
        rating: string;
        price_level: string;
        description: string;
        averageRate: string;
        websiteurl: string;
      };
    };
  };
}
