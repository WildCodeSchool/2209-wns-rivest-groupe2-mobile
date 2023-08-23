import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import MenuContainer from "../../components/MenuContainer";
import {
  Bars,
  Hotels,
  Restaurants,
  Musee,
  Church,
  Fastfood,
} from "../../assets/images";
import { useLazyQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import ItemCardContainer from "../../components/ItemCardContainer";
import { IPOIData } from "../../types/IPoiData";
import { GET_POI_QUERY_BY_CITY } from "../../services/queries/Poi";
import { CityContext } from "../../context/CityContext";
import { GET_ALL_CITIES } from "../../services/queries/CityQueries";
import Dropdown from "../../components/Dropdown";

const DiscoverScreen = ({ navigation }) => {
  const [pois, setPois] = useState<IPOIData[] | []>([]);
  const [cities, setCities] = useState([]);
  const [type, setType] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const { city, setCity } = useContext(CityContext);

  //DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  //FETCH DATA
  const [getAllPoiInCity, { loading, error }] = useLazyQuery(
    GET_POI_QUERY_BY_CITY,
    { variables: { cityId: city.id } }
  );
  const [getCitiesData] = useLazyQuery(GET_ALL_CITIES);

  useFocusEffect(
    useCallback(() => {
      async function fetchPois() {
        try {
          const data = await getAllPoiInCity();
          const citiesData = await getCitiesData();

          const dataPois = [...data.data.getAllPoiInCity] as IPOIData[];
          const dataCities = [...citiesData.data.getAllCities];

          setPois(dataPois);
          setCities(dataCities);
        } catch (error) {
          console.log(error);
          setPois([]);
        }
      }
      fetchPois();
    }, [city])
  );

  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-between mt-10 px-5">
        <View className="w-12 h-12 bg-gray-200 rounded-3xl items-center justify-center shadow-lg">
          <Dropdown
            label={city.name.charAt(0)}
            data={cities}
            onSelect={setCity}
            isDiscoverScreen={true}
          />
        </View>
        <View>
          <Text className="text-[35px] text-[#44bdbe] font-semibold">
            Décrouvrez
          </Text>
          <Text className="text-[25px] text-[#527873]">
            nos adresses exclusives
          </Text>
        </View>
      </View>
      <ScrollView>
        <View className="flex-row flex-wrap items-center justify-center px-8 mt-8">
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
          <MenuContainer
            key={"bar"}
            title="Bar"
            imageSrc={Bars}
            type={type}
            setType={setType}
            setIsFiltered={setIsFiltered}
            isFiltered={isFiltered}
          />
          <MenuContainer
            key={"fastfood"}
            title="Fast-food"
            imageSrc={Fastfood}
            type={type}
            setType={setType}
            setIsFiltered={setIsFiltered}
            isFiltered={isFiltered}
          />
          <MenuContainer
            key={"church"}
            title="Lieu de culte"
            imageSrc={Church}
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
              {isFiltered
                ? pois
                    ?.filter((poi: any, i) => poi.type == type)
                    .map((poi, i) => (
                      <ItemCardContainer
                        key={i}
                        id={poi?.id}
                        pictureUrl={
                          poi?.pictureUrl
                            ? poi?.pictureUrl[0]
                            : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                        }
                        name={poi?.name}
                        address={poi?.address}
                        postal={poi?.postal}
                      />
                    ))
                : pois?.map((poi, i) => (
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
