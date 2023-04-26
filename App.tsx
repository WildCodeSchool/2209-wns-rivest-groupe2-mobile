import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import Constants from "expo-constants";
import Navigator from "./navigation/Navigator";
import { RecoilRoot } from "recoil";
import { Provider as PaperProvider } from "react-native-paper";
import { WINDOWS } from "nativewind/dist/utils/selector";
import { withExpoSnack } from "nativewind";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  const { manifest } = Constants;

  const uri =
    manifest?.debuggerHost &&
    `http://${manifest.debuggerHost.split(":").shift()}:5000`;

  const httpLink = createHttpLink({
    uri: uri,
  });

  const client = new ApolloClient({
    link: httpLink,
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
