import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { Dispatch, SetStateAction } from "react";

interface MenuContainerProps {
  title: string;
  imageSrc: string;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  setIsFiltered: Dispatch<SetStateAction<boolean>>;
  isFiltered: boolean;
}

const MenuContainer: React.FC<MenuContainerProps> = ({ title, imageSrc, type, setType, setIsFiltered, isFiltered }) => {
  const handlePress = () => {
    if (type === title.toLowerCase()) {
      setIsFiltered(!isFiltered);
    } else {
      setType(title.toLowerCase());
      setIsFiltered(true);
    }
  };

  return (
    <TouchableOpacity
      className="items-center justify-center space-y-2 "
      onPress={handlePress}
    >
      <View
        className={`w-20 h-20 p-2 shadow-sm rounded-full items-center justify-center ${
          type === title.toLowerCase() && isFiltered === true ? "bg-gray-200" : ""
        }`}
      >
        <Image source={ imageSrc } className="w-full h-full object-contain" />
      </View>
      <Text className="text-[#00BBC9] font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default MenuContainer;
