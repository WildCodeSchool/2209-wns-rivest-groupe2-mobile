import React from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputGroupProps {
  label?: string;
  placeholder?: string;
  value: string;
  password?: boolean;
  type?: KeyboardTypeOptions;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  errorDetails?: string;
  className?: string;
}

const InputGroup: React.FunctionComponent<InputGroupProps> = ({
  placeholder,
  value,
  password,
  type = "default",
  onChangeText,
  onBlur,
  error = false,
  errorDetails,
  className,
}) => {
  return (
    <View style={styles.main}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={password}
        keyboardType={type}
        className={className}
      />
      {!!errorDetails && (
        <Text style={styles.errorDetails}>{errorDetails}</Text>
      )}
    </View>
  );
};

export default InputGroup;

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    height: 50,
    margin: 12,
    marginLeft: 25,
    marginRight: 25,
    padding: 10,
    borderRadius: 10,
  },
  errorDetails: {
    color: "#EF4444",
    marginLeft: 25,
    marginRight: 25,
    padding: 5,
  },
});
