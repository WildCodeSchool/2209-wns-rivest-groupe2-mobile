import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

export const GET_POI_BY_ID_QUERY = gql`
  query getPOIbyId($getPoIbyIdId: Float!) {
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
      priceRange
      city
      daysOpen
      hoursOpen
      hoursClose
      getRates {
        id
        rate
        createDate
        updateDate
      }
    }
  }
`;

interface ItemScreenProps {
    route: {
        "key": string,
        "name": string,
        "params": {
          "param": {
            "pictureUrl": string,
            "rating": string,
            "price_level": string,
            "description": string,
            "averageRate": string,
            "websiteurl": string,
          }
        },
    };
  }

const ItemScreen: React.FC<ItemScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params.param;

  console.log("ROUTE", route)

  const [getPOIbyId, { loading, error, data: queryData }] =
    useLazyQuery(GET_POI_BY_ID_QUERY);

  React.useEffect(() => {
    if (data) {
      getPOIbyId({ variables: { getPoIbyIdId: data } });
    }
  }, [data]);

  const poi = queryData?.getPOIbyId;

  const [isRed, setIsRed] = useState(false);

  const handlePress = () => {
    setIsRed(!isRed);
    if (isRed !== true) {
        let toast = Toast.show('Ajouté aux vos favoris !', {
            duration: Toast.durations.SHORT,
            backgroundColor: "#D58574",
            shadow: false,
            position: 90,
          });
    } else {
        let toast = Toast.show('Retiré des favoris !', {
            duration: Toast.durations.SHORT,
            backgroundColor: "#D58574",
            shadow: false,
            position: 90,
          });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Image Section */}
      <ScrollView className="flex-1 px-4 py-6">
        <View className="relative bg-white shadow-lg">
          <Image
            source={{
              uri: data?.pictureUrl
                ? data?.pictureUrl
                : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg",
            }}
            className="w-full h-72 object-cover rounded-2xl"
          />

          <View className="absolute flex-row inset-x-0 top-5 justify-between px-4">
            <TouchableOpacity
              onPress={() => navigation.navigate("Découvrir" as never)}
              className="w-10 h-10 rounded-md items-center justify-center bg-white"
            >
              <Ionicons name="chevron-back-outline" size={24} color="#44bdbe" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePress}
              className="w-10 h-10 rounded-md items-center justify-center bg-[#06B2BE]"
            >
              <Ionicons
                name="heart-outline"
                size={24}
                color={isRed ? "#D58574" : "#ffffff"}
              />
            </TouchableOpacity>
          </View>

          <View className="absolute flex-row inset-x-0 bottom-5 justify-between px-4">
            <Text className="text-[20px] font-bold color-[#06B2BE]">
              {poi?.type.toUpperCase().charAt(0) + poi?.type.slice(1)}
            </Text>
            <View className="space-x-2">
              <View className="px-2 py-1 rounded-md bg-[#06B2BE] items-center">
                <Text className="text-[15px] font-bold color-[#fff]">
                  {poi?.priceRange ? `${poi.priceRange}` : "$$$"}
                </Text>
              </View>
            </View>
            <View className="px-2 py-1 rounded-md bg-teal-100">
              <Text className="text-[#8C9EA6] font-bold">
                {poi?.hoursOpen}-{poi?.hoursClose}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View className="mt-6">
          <Text className="text-[#428288] text-[24px] font-bold px-2">
            {poi?.name}
          </Text>
          <View className="flex-row items-center space-x-2 py-2 mt-2">
            <Ionicons name="pin" size={24} color="#44bdbe" />
            <Text className="text-[#8C9EA6] text-[16px] font-bold">
              {poi?.address}, {poi?.postal} {poi?.city}
            </Text>
          </View>
          <View className="flex-row items-center space-x-2 mt-2">
            <Text className="text-[#8C9EA6] text-[13px] px-3 py-2 font-bold">
              {poi?.description}
            </Text>
          </View>
        </View>

        <View className="mt-4 space-x-2 flex-row items-center justify-between">
          {data?.rating && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-12 h-12 rounded-2xl bg-red-100 items-center justify-center shadow-md">
                <Ionicons name="star-outline" size={24} color="#D58574" />
              </View>
              <View>
                <Text className="text-[#515151]">{data?.rating}</Text>
                <Text className="text-[#515151]">Ratings</Text>
              </View>
            </View>
          )}

          {data?.price_level && (
            <View className=" flex-row items-center space-x-2">
              <View className="w-12 h-12 rounded-2xl bg-red-100 items-center justify-center shadow-md">
                <Ionicons name="pin" size={18} color="#44bdbe" />
                <Ionicons name="pin" size={18} color="#44bdbe" />
              </View>
              <View>
                <Text className="text-[#515151]">{poi?.address}</Text>
                <Text className="text-[#515151]">Price Level</Text>
              </View>
            </View>
          )}

        </View>

        {data?.description && (
          <Text className="mt-4 tracking-wide text-[16px] font-semibold text-[#97A6AF]">
            {data?.description}
          </Text>
        )}

        <View className=" space-y-2 mt-4 bg-gray-100 rounded-2xl px-4 py-4">
          {poi?.websiteURL && (
            <View className="items-center flex-row space-x-4">
              <Ionicons name="link-outline" size={24} color="#D58574" />
              <Text className="text-[#D58574] text-[13px] font-bold">
                {poi?.websiteURL}
              </Text>
            </View>
          )}
          {/* {poi?.averageRate && ( */}
          <View className="items-center flex-row space-x-4 mb-4">
            <Ionicons name="star-outline" size={24} color="#D58574" />
            <Text className="text-[#D58574] text-[13px] font-bold">
              {poi?.averageRate
                ? `${poi.averageRate}`
                : "Pas de notes disponibles"}
            </Text>
          </View>
          {/* )} */}

          <View className="py-2 rounded-lg bg-[#06B2BE] items-center justify-center">
            <Text className="text-xl font-semibold uppercase tracking-wider text-gray-100">
              Réserver
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;
