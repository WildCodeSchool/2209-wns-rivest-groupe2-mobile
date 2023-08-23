import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Button,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Toast from "react-native-root-toast";
import { useRecoilValue } from "recoil";
import { userState } from "../../atom/userAtom";
import { GET_POI_BY_ID_QUERY } from "../../services/queries/Poi";
import { IPOIData } from "../../types/IPoiData";
import Constants from "expo-constants";

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
  const data = route?.params.param;
  const user = useRecoilValue(userState);
  const [isRed, setIsRed] = useState(false);

  const { manifest } = Constants;
  const image_url =
    manifest?.debuggerHost &&
    `http://${manifest.debuggerHost.split(":").shift()}:18000/images`;

  const [getPOIbyId, { data: queryData }] = useLazyQuery(GET_POI_BY_ID_QUERY);

  useEffect(() => {
    if (data) {
      getPOIbyId({ variables: { getPoIbyIdId: data } });
    }
  }, [data]);

  const poi: IPOIData = queryData?.getPOIbyId;
  console.log("poi", poi);

  const websiteUrl = poi?.websiteURL;

  const handlePressLink = useCallback(async () => {
    const supported = await Linking.canOpenURL(websiteUrl);

    if (supported) {
      await Linking.openURL(websiteUrl);
    } else {
      Alert.alert(`Impossible d'ouvrir l'url: ${websiteUrl}`);
    }
  }, [websiteUrl]);

  const handlePress = () => {
    setIsRed(!isRed);
    if (isRed !== true) {
      Toast.show("Ajouté aux vos favoris !", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#D58574",
        shadow: false,
        position: 90,
      });
    } else {
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
      <ScrollView className="flex-1 px-4 py-6">
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
                onPress={handlePress}
                className="w-10 h-10 rounded-md items-center justify-center bg-[#06B2BE]"
              >
                <Ionicons
                  name="heart-outline"
                  size={24}
                  color={isRed ? "#D58574" : "#ffffff"}
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
        </View>

        <View className=" space-y-2 mt-4 bg-gray-100 rounded-2xl px-4 py-4">
          {poi?.websiteURL && (
            <View className="items-center flex-row space-x-4">
              <Ionicons name="link-outline" size={24} color="#D58574" />
              <Button
                title={poi?.websiteURL}
                onPress={handlePressLink}
                /* className="text-[#D58574] text-[13px] font-bold" */
              />
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

          {/* <View className="py-2 rounded-lg bg-[#06B2BE] items-center justify-center">
            <Text className="text-xl font-semibold uppercase tracking-wider text-gray-100">
              Réserver
            </Text>
          </View> */}
          {user && (
            <Button
              title="Commentaires"
              onPress={() =>
                navigation.navigate("CommentScreen", { poiId: data })
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemScreen;
