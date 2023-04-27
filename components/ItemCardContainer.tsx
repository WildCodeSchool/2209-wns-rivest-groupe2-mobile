import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";

interface ItemCardContainerProps {
  id: string;
  name: string;
  pictureUrl: string;
  address: string;
  postal: number;
}

const ItemCardContainer: React.FC<ItemCardContainerProps> = ({
  id,
  name,
  pictureUrl,
  address,
  postal,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ItemScreen", { param: id })}
      className="rounded-md border border-gray-300 space-y-2 px-3 py-2 shadow-md bg-white w-[162px] my-2"
    >
      <Image
        source={{ uri: pictureUrl }}
        className="w-full h-36 rounded-md object-cover"
      />
      <Text className="text-[#44bdbe] text-[16px] font-bold">
        {name?.length > 14 ? `${name.slice(0, 14)}..` : name}
      </Text>
      <View className="flex-row items-center space-x-1 flex-wrap">
        <Ionicons name="pin" size={18} color="#44bdbe" />
        <Text className="text-[#428288] text-[10px] font-bold">
          {address?.length > 18 ? `${address.slice(0, 18)}..` : address}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemCardContainer;
