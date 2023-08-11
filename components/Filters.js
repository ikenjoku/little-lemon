import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <ScrollView horizontal style={{ height: 170 }}>
      <View>
        <View style={{ paddingHorizontal: 10, backgroundColor: "#ffffff" }}>
          <Text
            style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 15,
              color: "#000000",
              marginTop: 10,
            }}
          >
            ORDER FOR DELIVERY!
          </Text>
        </View>
        <View style={styles.filtersContainer}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={`${index}=${section}`}
              onPress={() => {
                onChange(index);
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: selections[index] ? "#EE9972" : "#495E57",
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 16,
              }}
            >
              <View>
                <Text style={{ color: selections[index] ? "black" : "white" }}>
                  {section[0].toUpperCase() + section.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
    padding: 10,
  },
});

export default Filters;
