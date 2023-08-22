import React, { useCallback, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLazyQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_POI_QUERY_BY_CITY } from "../../services/queries/Poi";
import { GET_ALL_CITIES } from "../../services/queries/CityQueries";
import Dropdown from "../../components/Dropdown";

const MapScreen = ({ navigation }) => {
  const [pois, setPois] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState<{
    name: string;
    id: number;
    coordinates: number[];
  }>({
    name: "Paris",
    id: 1,
    coordinates: [48.860161, 2.350041],
  });
  const [getAllPoiInCity, { loading, error }] = useLazyQuery(
    GET_POI_QUERY_BY_CITY,
    { variables: { cityId: city.id } }
  );
  const [getCitiesData] = useLazyQuery(GET_ALL_CITIES);

  const position = {
    latitude: city.coordinates[0],
    longitude: city.coordinates[1],
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  // DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchPois() {
        try {
          const data = await getAllPoiInCity();
          const citiesData = await getCitiesData();

          const dataPois = [...data.data.getAllPoiInCity];
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

  if (loading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <SafeAreaView className="flex items-center" style={styles.container}>
      <MapView style={styles.map} region={position}>
        {pois
          ? pois.map((poi) => (
              <Marker
                coordinate={{
                  latitude: poi.coordinates[0],
                  longitude: poi.coordinates[1],
                }}
                title={poi.name}
                description={poi.description}
                key={poi.id}
              />
            ))
          : null}
      </MapView>
      {cities && (
        <View style={{ width: "100%", position: "absolute", top: 50 }}>
          <Dropdown label="Villes" data={cities} onSelect={setCity} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
