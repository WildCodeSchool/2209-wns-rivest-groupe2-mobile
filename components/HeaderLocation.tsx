import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import InputGroup from "../components/InputGroup";

const HeaderLocation: React.FC = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Device.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handlePress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let locationData = await Location.getCurrentPositionAsync({});
    setLocationData(locationData);
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View className="flex-row justify-between z-50 bg-gray-100 rounded-md w-[350px] p-4">
      <Text className="text-[35px] text-[#44bdbe] font-semibold">
        My location
      </Text>
      <TouchableOpacity onPress={handlePress}>
        <View className="w-10 h-10 bg-[#44bdbe] rounded-md items-center justify-center shadow-lg">
          <Ionicons name="navigate-outline" size={24} color={"#ffffff"} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLocation;
