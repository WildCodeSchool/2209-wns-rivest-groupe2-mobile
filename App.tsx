import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Navigator from "./navigation/Navigator";
import { RecoilRoot } from "recoil";
import { Provider as PaperProvider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";

export default function App() {
  const postUrl = process.env.BASE_URL;

  const client = new ApolloClient({
    uri: "https://rivest2.wns.wilders.dev/graphql",
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
