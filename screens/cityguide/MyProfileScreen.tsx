import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Button,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AvatarImagePicker from "../../components/AvatarImagePicker";
import * as SecureStore from "expo-secure-store";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { GET_POI_QUERY } from "../../services/queries/Poi";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import ItemCardContainer from "../../components/ItemCardContainer";
import { ScrollView } from "react-native-gesture-handler";
import { GET_USER_FAVORITE_POI_QUERY } from "../../services/queries/FavoriteQueries";

const MyProfileScreen: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useRecoilState(userState);
  const resetUserState = useResetRecoilState(userState);
  const [pois, setPois] = useState([]);
  const [userFavoritePois, setUserFavoritePois] = useState([]);
  const [userFavoritePoisCount, setUserFavoritePoisCount] = useState(0);

  const [getAllPois, { loading: poiLoading, error: poiError, refetch }] =
    useLazyQuery(GET_POI_QUERY);
  const {
    loading: favoriteLoading,
    error: favoriteError,
    data: favoriteData,
  } = useQuery(GET_USER_FAVORITE_POI_QUERY, {
    variables: { userId: user?.userFromDB.id },
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchPois() {
        try {
          const data = await getAllPois();
          const dataPois = [...data.data.getAllPoi];

          setPois(dataPois.sort((a, b) => a.type.localeCompare(b.type)));
        } catch (error) {
          console.log(error);
          setPois([]);
        }
      }
      fetchPois();
    }, [])
  );

  useEffect(() => {
    if (pois) {
      if (favoriteData?.getUserFavorites) {
        const userFavoritePois = favoriteData.getUserFavorites.map(
          (favorite) => favorite.pointOfInterest.id
        );
        setUserFavoritePois(
          pois.filter((poi) => userFavoritePois.includes(poi.id))
        );
        setUserFavoritePoisCount(favoriteData.getUserFavorites.length);
      }
    }
  }, [pois, favoriteData]);

  // LOGOUT
  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
    resetUserState();
  };

  useEffect(() => {
    if (!user) navigation.navigate("LoginScreen");
  }, [user]);

  // DISABLE TOP NAVIGATION
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  if (poiLoading || favoriteLoading) {
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

  if (favoriteError) {
    return (
      <View style={styles.errorContainer}>
        <Text>{favoriteError.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={poiLoading} onRefresh={refetch} />
        }
      >
        <View className="flex-row items-center justify-between mx-auto my-5 px-5 py-5 bg-white w-[85%] border rounded-xl border-slate-100 shadow-lg shadow-black">
          <View className="flex items-center">
            <AvatarImagePicker />
            <Text className="pt-5 text-xl font-bold">
              {user?.userFromDB.firstname && user?.userFromDB.lastname
                ? `${user.userFromDB.firstname} ${user.userFromDB.lastname}`
                : user?.userFromDB.username}
            </Text>
            <Text className="text-sm">
              {user?.userFromDB?.role?.name === "free_user"
                ? "Free user"
                : user?.userFromDB?.role?.name === "super_user"
                ? "Super user"
                : user?.userFromDB?.role?.name === "city_admin"
                ? "City admin"
                : user?.userFromDB?.role?.name === "admin"
                ? "Admin"
                : ""}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-2xl px-3">{userFavoritePoisCount}</Text>
            <Ionicons name="heart" color="black" size={30} />
          </View>
        </View>
        <View style={styles.subContainer}>
          <ScrollView>
            <View className="p-5">
              <Text className="text-[30px] text-[#0B646B] font-semibold">
                Bonjour {user?.userFromDB.firstname}
              </Text>
              <Text className="text-[15px] text-[#527873]">
                Vos points d'intérêts favoris !
              </Text>
            </View>
            <View className="px-4 flex-row items-center justify-evenly flex-wrap">
              {userFavoritePois?.length > 0 ? (
                userFavoritePois.map((poi, i) => (
                  <ItemCardContainer
                    key={i}
                    id={poi.id}
                    pictureUrl={
                      poi?.pictureUrl
                        ? poi?.pictureUrl
                        : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                    }
                    name={poi.name}
                    address={poi.address}
                    postal={poi.postal}
                    isFavorite={true}
                  />
                ))
              ) : (
                <>
                  <View className="w-full h-[400px] bg-gray-200 placeholder:items-center space-y-8 justify-center">
                    <Text className="text-2xl text-[#428288] font-semibold">
                      Vous n'avez pas de favoris enregistrés
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View className="my-4">
              <View className="w-[60%] mx-auto">
                <Button
                  title="SE DECONNECTER"
                  color="#44bdbe"
                  onPress={logout}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 2,
  },
  modalContent: {
    flex: 1,
  },
  modalToggle: {
    flex: 1,
  },
  modalClose: {
    flex: 1,
  },
});

export default MyProfileScreen;
