import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLazyQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_POI_QUERY_BY_CITY } from "../../services/queries/Poi";
import { GET_ALL_CITIES } from "../../services/queries/CityQueries";
import Dropdown from "../../components/Dropdown";
import { CityContext } from "../../context/CityContext";

const MapScreen = ({ navigation }) => {
  const [pois, setPois] = useState([]);
  const [cities, setCities] = useState([]);
  const { city, setCity } = useContext(CityContext);

  const [getAllPoiInCity, { loading: poiLoading, error: poiError }] =
    useLazyQuery(GET_POI_QUERY_BY_CITY, { variables: { cityId: city.id } });
  const [getCitiesData, { loading: cityLoading, error: cityError }] =
    useLazyQuery(GET_ALL_CITIES);

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

  if (poiLoading || cityLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (poiError) {
    return (
      <View style={styles.errorContainer}>
        <Text>{poiError.message}</Text>
      </View>
    );
  }

  if (cityError) {
    return (
      <View style={styles.errorContainer}>
        <Text>{cityError.message}</Text>
      </View>
    );
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
          <Dropdown label={city.name} data={cities} onSelect={setCity} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "relative",
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
