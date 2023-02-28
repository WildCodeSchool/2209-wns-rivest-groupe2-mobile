import React, { Children } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  children: string;
  type?: "primary";
  onPress: () => void;
}

const Button: React.FC<ButtonProps>= ({
  type = "primary",
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <LinearGradient
          colors={["#34D399", "#3B82F6"]}
          style={styles.button}
        >
          <Text style={styles.buttonInner}>{children}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 50,
    margin: 12,
    marginLeft: 25,
    marginRight: 25,
    padding: 10,
    borderRadius: 10,
  },
  buttonInner: {
    color: "white",
  },
});
