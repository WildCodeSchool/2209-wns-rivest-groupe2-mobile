import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { MapScreen } from "../screens/index";
import CustomDrawer from "../components/CustomDrawer";

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = ({ navigation }: any) => {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      initialRouteName="Maps"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: "#0fa6a6",
        drawerActiveTintColor: "#d01414",
        drawerLabelStyle: {
          marginLeft: -20,
        },
      }}
    >
      <Drawer.Screen
        name={"Map"}
        component={MapScreen}
        options={{
          title: "Home",
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons iconName="map" size={18} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
