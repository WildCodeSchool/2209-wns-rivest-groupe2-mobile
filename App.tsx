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
import * as SecureStore from "expo-secure-store";
import { BASE_URL_API } from "@env";

async function getValueFor(key: string): Promise<string | null> {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default function App() {
  const uri = BASE_URL_API;
  const httpLink = createHttpLink({ uri: uri });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getValueFor("token");
    return {
      headers: {
        ...headers,
        authorization: token !== null ? `${token}` : "",
      },
    };
  });

  /*   const resetClient = async () => {
    await client.clearStore();
  }; */

  const client = new ApolloClient({
    uri: BASE_URL_API,
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <RootSiblingParent>
        <RecoilRoot>
          <PaperProvider>
            <Navigator />
          </PaperProvider>
        </RecoilRoot>
      </RootSiblingParent>
    </ApolloProvider>
  );
}
