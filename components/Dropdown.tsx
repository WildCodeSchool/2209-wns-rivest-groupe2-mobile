import React, { FC } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";

interface Props {
  label: string;
  data: Array<{ name: string; id: number; coordinates: number[] }>;
  onSelect: React.Dispatch<
    React.SetStateAction<{
      name: string;
      id: number;
      coordinates: number[];
    }>
  >;
  isDiscoverScreen?: boolean;
}

const { width } = Dimensions.get("window");

const Dropdown: FC<Props> = ({ label, data, onSelect, isDiscoverScreen }) => {
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View
      style={isDiscoverScreen ? styles.discoverContainer : styles.viewContainer}
    >
      <SelectDropdown
        data={sortedData}
        onSelect={onSelect}
        defaultButtonText={label}
        buttonTextAfterSelection={(selectedItem) =>
          !isDiscoverScreen ? selectedItem.name : selectedItem.name.charAt(0)
        }
        rowTextForSelection={(item) => item.name}
        buttonStyle={
          !isDiscoverScreen
            ? styles.dropdownBtnStyle
            : styles.dropdownBtnDiscoverStyle
        }
        buttonTextStyle={
          !isDiscoverScreen
            ? styles.dropdownBtnTxtStyle
            : styles.dropdownBtnTxtDiscoverStyle
        }
        renderDropdownIcon={(isOpened) => {
          if (!isDiscoverScreen)
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
        dropdownStyle={
          !isDiscoverScreen
            ? styles.dropdownDropdownStyle
            : styles.dropdownDropdownDiscoverStyle
        }
        rowStyle={styles.dropdownRowStyle}
        rowTextStyle={styles.dropdownRowTxtStyle}
        selectedRowStyle={styles.selectedRowStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  discoverContainer: {
    width: 50,
    height: 50,
    flex: 1,
    border: "3px solid grey",
    borderRadius: 300,
  },
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
  dropdownBtnDiscoverStyle: {
    width: 50,
    height: 50,
    flex: 1,
    border: "1px solid",
    borderRadius: 300,
    backgroundColor: "#C5C5C5",
  },
  dropdownBtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdownBtnTxtDiscoverStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdownDropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdownDropdownDiscoverStyle: {
    backgroundColor: "#EFEFEF",
    width: "70%",
    position: "absolute",
    right: 10,
    top: 0,
  },
  dropdownRowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdownRowTxtStyle: { color: "#444", textAlign: "left" },
  selectedRowStyle: { backgroundColor: "#dcdada" },
});

export default Dropdown;
