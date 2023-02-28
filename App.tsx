import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import Constants from "expo-constants";
import Navigator from "./navigation/Navigator";
import { RecoilRoot } from "recoil";

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
      <RecoilRoot>
        <Navigator />
      </RecoilRoot>
    </ApolloProvider>
  );
}
