import React, { FC } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";

interface Props {
  label: string;
  data: Array<{ name: string; id: number }>;
  onSelect: React.Dispatch<
    React.SetStateAction<{
      name: string;
      id: number;
    }>
  >;
}

const { width } = Dimensions.get("window");

const Dropdown: FC<Props> = ({ data, onSelect }) => {
  return (
    <View style={styles.viewContainer}>
      <SelectDropdown
        data={data.sort((a, b) => a.name.localeCompare(b.name))}
        onSelect={onSelect}
        defaultButtonText={"Sélectionner une ville"}
        buttonTextAfterSelection={(selectedItem) => {
          return selectedItem.name;
        }}
        rowTextForSelection={(item) => {
          return item.name;
        }}
        buttonStyle={styles.dropdownBtnStyle}
        buttonTextStyle={styles.dropdownBtnTxtStyle}
        renderDropdownIcon={(isOpened) => {
          return (
            <Icon
              type="font-awesome"
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={"#444"}
              size={18}
            />
          );
        }}
        dropdownIconPosition={"right"}
        dropdownStyle={styles.dropdownDropdownStyle}
        rowStyle={styles.dropdownRowStyle}
        rowTextStyle={styles.dropdownRowTxtStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownBtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  dropdownBtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdownDropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdownRowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdownRowTxtStyle: { color: "#444", textAlign: "left" },
});

export default Dropdown;
