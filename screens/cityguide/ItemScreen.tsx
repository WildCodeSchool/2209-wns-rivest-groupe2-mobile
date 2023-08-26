import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Pressable,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Toast from "react-native-root-toast";
import { useRecoilValue } from "recoil";
import { userState } from "../../atom/userAtom";
import { GET_POI_BY_ID_QUERY } from "../../services/queries/Poi";
import { IPOIData, OpeningHoursData } from "../../types/IPoiData";
import Constants from "expo-constants";
import CustomButton from "../../components/Button";
import { GET_USER_FAVORITE_POI_QUERY } from "../../services/queries/FavoriteQueries";
import { TOGGLE_FAVORITE_MUTATION } from "../../services/mutations/FavoriteMutation";
import { unknownHours } from "../../services/helpers/POIDefaultDays";

interface ItemScreenProps {
  route: {
    key: string;
    name: string;
    params: {
      param: number;
    };
  };
  navigation: any;
}

const ItemScreen: React.FC<ItemScreenProps> = ({ route, navigation }) => {
  const poiId = route?.params.param;
  const user = useRecoilValue(userState);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [openingHours, setOpeningHours] = useState<OpeningHoursData[]>([]);

  const { manifest } = Constants;
  const image_url =
    manifest?.debuggerHost &&
    `http://${manifest.debuggerHost.split(":").shift()}:18000/images`;

  const [getPOIbyId, { data: queryData, loading: poiLoading, refetch }] =
    useLazyQuery(GET_POI_BY_ID_QUERY);

  const { data: favoriteData } = useQuery(GET_USER_FAVORITE_POI_QUERY, {
    variables: { userId: user?.userFromDB.id },
  });

  const [toggleFavoriteMutation] = useMutation(TOGGLE_FAVORITE_MUTATION, {
    variables: { userId: user.userFromDB.id, poiId },
    context: {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    },
    onCompleted: () => {
      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    },
    refetchQueries: [
      { query: GET_POI_BY_ID_QUERY, variables: { getPoIbyIdId: poiId } },
      {
        query: GET_USER_FAVORITE_POI_QUERY,
        variables: { userId: user?.userFromDB.id },
      },
    ],
  });

  const poi: IPOIData = queryData?.getPOIbyId;

  const websiteUrl = poi?.websiteURL;

  useEffect(() => {
    if (poiId) {
      getPOIbyId({ variables: { getPoIbyIdId: poiId } });
    }
    if (favoriteData) {
      const userFavorites = favoriteData.getUserFavorites.map(
        (favorite) => favorite.pointOfInterest.id
      );
      setIsFavorite(userFavorites.includes(poiId));
    }
  }, [poiId, favoriteData]);

  useEffect(() => {
    if (poi) {
      if (poi.openingHours && poi.openingHours.length > 0)
        setOpeningHours(poi.openingHours.slice().sort((a, b) => a.id - b.id));
      else setOpeningHours(unknownHours.slice().sort((a, b) => a.id - b.id));
    }
  }, [poi]);

  const handlePressLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(websiteUrl);

    if (supported) {
      await Linking.openURL(websiteUrl);
    } else {
      Alert.alert(`Impossible d'ouvrir l'url: ${websiteUrl}`);
    }
  }, [websiteUrl]);

  const handlePressFavorite = async () => {
    if (isFavorite !== true) {
      await toggleFavoriteMutation();
      Toast.show("Ajouté aux vos favoris !", {
        duration: Toast.durations.SHORT,
        backgroundColor: "rgb(1, 162, 1)",
        shadow: false,
        position: 90,
      });
    } else {
      await toggleFavoriteMutation();
      Toast.show("Retiré des favoris !", {
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
      <ScrollView
        className="flex-1 px-4 py-6"
        refreshControl={
          <RefreshControl refreshing={poiLoading} onRefresh={refetch} />
        }
      >
        <View className="relative bg-white shadow-lg">
          <Image
            source={{
              uri:
                poi?.pictureUrl && poi.pictureUrl.length > 0
                  ? `${image_url}${poi.pictureUrl[0]}`
                  : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg",
            }}
            className="w-full h-72 object-cover rounded-2xl"
          />

          <View className="absolute top-5 right-5">
            {user !== null && (
              <TouchableOpacity
                onPress={handlePressFavorite}
                className="w-10 h-10 rounded-md items-center justify-center bg-[#06B2BE]"
              >
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color={isFavorite ? "#D58574" : "#ffffff"}
                />
              </TouchableOpacity>
            )}
          </View>

          <View className="absolute flex-row inset-x-0 bottom-5 justify-end px-4">
            <Text className="text-[20px] font-bold color-[#06B2BE]">
              {poi?.type.toUpperCase().charAt(0) + poi?.type.slice(1)}
            </Text>
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
              {poi?.address}, {poi?.postal} {poi?.city.name}
            </Text>
          </View>
          <View className="flex-row items-center space-x-2 mt-2">
            <Text className="text-[#8C9EA6] text-[13px] px-3 py-2 font-bold">
              {poi?.description}
            </Text>
          </View>
          <View>
            <View>
              {openingHours.map((day) => (
                <View key={day.id} style={styles.openingHours}>
                  <Text className="text-[#8C9EA6] text-[13px] py-1 font-bold">
                    {day.name}
                  </Text>
                  <Text className="text-[#8C9EA6] text-[13px]">
                    {day.hoursOpen[0]}
                    {day.hoursClose.length === 0
                      ? ""
                      : ` - ${day.hoursClose[0]}`}
                    {day.hoursOpen.length === 2 &&
                      day.hoursClose.length === 2 &&
                      `, ${day.hoursOpen[1]} - ${day.hoursClose[1]}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="space-y-2 mt-4 mb-12 bg-gray-100 rounded-2xl px-4 py-4">
          {poi?.websiteURL && (
            <View className="items-center flex-row space-x-4">
              <Ionicons name="link-outline" size={24} color="#D58574" />
              <Pressable onPress={handlePressLink}>
                <Text className="text-[#D58574] text-[13px] font-bold">
                  {poi?.websiteURL}
                </Text>
              </Pressable>
            </View>
          )}
          <View className="items-center flex-row space-x-4 mb-4">
            <Ionicons name="star-outline" size={24} color="#D58574" />
            <Text className="text-[#D58574] text-[13px] font-bold">
              {poi?.averageRate
                ? `${poi.averageRate}`
                : "Pas de notes disponibles"}
            </Text>
          </View>
          {user !== null && (
            <CustomButton
              onPress={() =>
                navigation.navigate("CommentScreen", { poiId: poiId })
              }
            >
              Commentaires
            </CustomButton>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;

const styles = StyleSheet.create({
  openingHours: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginLeft: "5%",
  },
});
