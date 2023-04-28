import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import MenuContainer from "../../components/MenuContainer";
import { Hotels, Restaurants, Musee } from "../../assets/images";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import ItemCardContainer from "../../components/ItemCardContainer";
import { IPOIData } from "../../types/IPoiData";

export const GET_POI_QUERY = gql`
  query GetAllPois {
    getAllPoi {
      id
      name
      address
      postal
      type
      coordinates
      creationDate
      pictureUrl
      websiteURL
      description
      priceRange
      city
      daysOpen
      hoursOpen
      hoursClose
    }
  }
`;

const DiscoverScreen = ({ navigation }) => {

  //DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  //FETCH DATA
  const [getAllPois, { loading, error }] = useLazyQuery(GET_POI_QUERY);
  const [pois, setPois] = useState<IPOIData[] | []>([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchPois() {
        try {
          const data = await getAllPois();
          const dataPois = [...data.data.getAllPoi] as IPOIData[];
          setPois(dataPois);
        } catch (error) {
          console.log(error);
          setPois([]);
        }
      }
      fetchPois();
    }, [])
  );

  //FILTER DATA
  const [type, setType] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between mt-10 px-5">
        <View>
          <Text className="text-[35px] text-[#44bdbe] font-semibold">
            Décrouvrez
          </Text>
          <Text className="text-[25px] text-[#527873]">
            nos adresses exclusives
          </Text>
        </View>
        <View className="w-12 h-12 bg-gray-400 rounded-md items-center justify-center shadow-lg"></View>
      </View>
      <ScrollView>
        <View className="flex-row items-center justify-between px-8 mt-8">
            <MenuContainer
              key={"hotel"}
              title="Hotel"
              imageSrc={Hotels}
              type={type}
              setType={setType}
              setIsFiltered={setIsFiltered}
              isFiltered={isFiltered}
            />
            <MenuContainer
              key={"musee"}
              title="Musee"
              imageSrc={Musee}
              type={type}
              setType={setType}
              setIsFiltered={setIsFiltered}
              isFiltered={isFiltered}
            />
            <MenuContainer
              key={"restaurant"}
              title="Restaurant"
              imageSrc={Restaurants}
              type={type}
              setType={setType}
              setIsFiltered={setIsFiltered}
              isFiltered={isFiltered}
            />
        </View>

        {/* Cards container */}
        <View className="px-4 flex-row items-center justify-evenly flex-wrap mt-4 mb-36">
          {pois?.length > 0 ? (
            <>
              { isFiltered ?
              pois?.filter((poi, i) => (poi.type == type))
              .map((poi, i) => (
                <ItemCardContainer
                  key={i}
                  id={poi?.id}
                  pictureUrl={
                    poi?.pictureUrl
                      ? poi?.pictureUrl
                      : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                  }
                  name={poi?.name}
                  address={poi?.address}
                  postal={poi?.postal}
                />
              )) : (
                pois?.map((poi, i) => (
                  <ItemCardContainer
                    key={i}
                    id={poi?.id}
                    pictureUrl={
                      poi?.pictureUrl
                        ? poi?.pictureUrl
                        : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                    }
                    name={poi?.name}
                    address={poi?.address}
                    postal={poi?.postal}
                  />
                ))
              )
              }
            </>
          ) : (
            <>
              <View className="w-full h-[400px] bg-gray-200 placeholder:items-center space-y-8 justify-center">
                <Text className="text-2xl text-[#428288] font-semibold">
                  Ooops... Pas de points enregistrés !
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiscoverScreen;
