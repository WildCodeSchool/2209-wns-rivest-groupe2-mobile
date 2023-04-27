import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import MenuContainer from "../../components/MenuContainer";
import { Hotels, Restaurants, Bars } from "../../assets/images";
import { GET_POI_QUERY } from "../../services/queries/Poi";
import { useLazyQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import ItemCardContainer from "../../components/ItemCardContainer";

const DiscoverScreen = ({ navigation }) => {
  //DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [getAllPois, { loading, error }] = useLazyQuery(GET_POI_QUERY);
  const [pois, setPois] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchPois() {
        try {
          const data = await getAllPois();
          const dataPois = [...data.data.getAllPoi];

          setPois(dataPois);
        } catch (error) {
          console.log(error);
          setPois([]);
        }
      }
      fetchPois();
    }, [])
  );

  const [type, setType] = useState("restaurants");

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
            key={"hotels"}
            title="Hotels"
            imageSrc={Hotels}
            type={type}
            setType={setType}
          />
          <MenuContainer
            key={"bars"}
            title="Bars"
            imageSrc={Bars}
            type={type}
            setType={setType}
          />
          <MenuContainer
            key={"restaurants"}
            title="Restaurants"
            imageSrc={Restaurants}
            type={type}
            setType={setType}
          />
        </View>

        {/* Cards container */}
        <View className="px-4 flex-row items-center justify-evenly flex-wrap mt-4">
          {pois?.length > 0 ? (
            <>
              {pois?.map((poi, i) => (
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
              ))}
            </>
          ) : (
            <>
              <View className="w-full h-[400px] bg-gray-200 placeholder:items-center space-y-8 justify-center">
                {/* <Image
                      source={NotFound}
                      className="w-28 h-28 object-cover"
                    /> */}
                <Text className="text-2xl text-[#428288] font-semibold">
                  Ooops... No Data Found
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
