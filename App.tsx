import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navigator from "./navigation/Navigator";
import { RecoilRoot } from "recoil";
import { Provider as PaperProvider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import { CityContextProvider } from "./context/CityContext";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import React from "react";

async function getValueFor(key: string): Promise<string | null> {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default function App() {
  const { manifest } = Constants;
  const uri =
    manifest?.debuggerHost &&
    `http://${manifest.debuggerHost.split(":").shift()}:5000`;
  const httpLink = createHttpLink({ uri: uri });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getValueFor("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <CityContextProvider>
        <RootSiblingParent>
          <RecoilRoot>
            <PaperProvider>
              <Navigator />
            </PaperProvider>
          </RecoilRoot>
        </RootSiblingParent>
      </CityContextProvider>
    </ApolloProvider>
  );
}
