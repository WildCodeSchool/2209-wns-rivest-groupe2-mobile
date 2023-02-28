import React from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";

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
      />
      {!!errorDetails && <Text style={styles.errorDetails}>{errorDetails}</Text>}
    </View>
  );
};

export default InputGroup;

const styles = StyleSheet.create({
  main: {
    // paddingTop: "0.5rem",
    // paddingBottom: "0.5rem",
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
    //marginTop: "0.25rem",
    color: "#EF4444",
    //fontSize: "0.875rem",
    //lineHeight: "1.25rem",
  },
});
