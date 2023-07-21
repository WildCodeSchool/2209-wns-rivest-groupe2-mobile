import React, { useCallback, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLazyQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { GET_POI_QUERY } from "../../services/queries/Poi";

const MapScreen = ({ navigation }) => {
  const [getAllPois, { loading, error }] = useLazyQuery(GET_POI_QUERY);
  const [pois, setPois] = useState([]);

  const parisPosition = {
    latitude: 48.860161,
    longitude: 2.350041,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
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

  if (loading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <SafeAreaView className="flex items-center" style={styles.container}>
      <MapView style={styles.map} initialRegion={parisPosition}>
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
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
