import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from "../utils/database";
import Filters from "../components/Filters";
import { useUpdateEffect } from "../utils/helpers";
import Header from "../components/Header";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, image, description }) => (
  <View style={styles.item}>
    <View style={{ flex: 1 }}>
      <Text style={{ marginTop: 10, fontWeight: "900" }}>{name}</Text>
      <Text style={{ marginTop: 10 }}>{description}</Text>
      <Text style={{ marginTop: 10, fontWeight: "600", color: "#4b3e52" }}>
        ${price}
      </Text>
    </View>
    <View>
      <Image
        style={{ height: 50, width: 50, borderRadius: 3 }}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
        }}
      />
    </View>
  </View>
);

export default function Home({ navigation }) {
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      const items = json.menu.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      return items;
    } catch (error) {
      console.log("Error getting menu: ", error);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        setData(menuItems);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        setData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <View
        style={{
          backgroundColor: "#4b3e52",
          paddingBottom: 24,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <View style={{}}>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 40,
                color: "yellow",
              }}
            >
              Litte Lemon
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
              gap: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", textAlign: "auto" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                vitae eros vitae tortor efficitur placerat at et orci. Maecenas
                iaculis dignissim sem, non fringilla mi.
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Image
                style={{
                  height: 100,
                  width: 100,
                  resizeMode: "contain",
                  flex: 1,
                }}
                source={require("../assets/little-lemon-logo.png")}
              />
            </View>
          </View>
          <Searchbar
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={handleSearchChange}
            value={searchBarText}
            style={styles.searchBar}
            iconColor="white"
            inputStyle={{ color: "white" }}
            elevation={0}
          />
        </View>
      </View>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />

      <FlatList
        style={styles.sectionList}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item {...item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#ffffff",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    backgroundColor: "#495E57",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#B1A898",
    borderTopWidth: 1,
    gap: 5,
  },
  header: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#FBDABB",
    backgroundColor: "#495E57",
  },
  title: {
    fontSize: 20,
    color: "white",
  },
});
