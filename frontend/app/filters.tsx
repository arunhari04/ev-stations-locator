import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export default function FiltersScreen() {
  const router = useRouter();
  const { location } = useAuth();

  // Dynamic Options from Backend
  const [availableChargerTypes, setAvailableChargerTypes] = useState<string[]>(
    [],
  );
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);

  // Selections
  const [selectedChargerTypes, setSelectedChargerTypes] = useState<string[]>(
    [],
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [availability, setAvailability] = useState("all");
  const [distance, setDistance] = useState(5);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const data = await api.getPlaceOptions();
      setAvailableChargerTypes(data.charger_types || []);
      setAvailableAmenities(data.amenities || []);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleChargerType = (type: string) => {
    if (selectedChargerTypes.includes(type)) {
      setSelectedChargerTypes(selectedChargerTypes.filter((t) => t !== type));
    } else {
      setSelectedChargerTypes([...selectedChargerTypes, type]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const applyFilters = () => {
    const params: any = {};

    // 1. Charger Type
    if (selectedChargerTypes.length > 0) {
      params.charger_type = selectedChargerTypes.join(",");
    }

    // 2. Availability (Removed 24/7)
    if (availability !== "all") {
      params.availability = availability;
    }

    // 3. Distance
    params.distance = distance.toString();

    // 4. Price
    if (minPrice) params.price_min = minPrice;
    if (maxPrice) params.price_max = maxPrice;

    // 5. Amenities
    if (selectedAmenities.length > 0) {
      params.amenities = selectedAmenities.join(",");
    }

    // Pass location
    if (location) {
      params.lat = location.latitude.toString();
      params.lng = location.longitude.toString();
    }

    try {
      const queryString = new URLSearchParams(params).toString();
      router.push(`/listing?${queryString}`);
    } catch (e) {
      console.error(e);
    }
  };

  const resetFilters = () => {
    setSelectedChargerTypes([]);
    setSelectedAmenities([]);
    setAvailability("all");
    setDistance(5);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#6b7280" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.resetButton}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Charger Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charger Type</Text>
          <View style={styles.optionsList}>
            {availableChargerTypes.map((type, idx) => {
              const checked = selectedChargerTypes.includes(type);
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.checkboxOption}
                  onPress={() => toggleChargerType(type)}
                >
                  <View
                    style={[styles.checkbox, checked && styles.checkboxChecked]}
                  />
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{type}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {availableChargerTypes.length === 0 && (
              <Text style={{ color: "#9ca3af" }}>Loading types...</Text>
            )}
          </View>
        </View>

        {/* Availability (Removed 24/7) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.optionsList}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAvailability("all")}
            >
              <View
                style={[
                  styles.radio,
                  availability === "all" && styles.radioSelected,
                ]}
              />
              <Text style={styles.optionLabel}>All Stations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setAvailability("available")}
            >
              <View
                style={[
                  styles.radio,
                  availability === "available" && styles.radioSelected,
                ]}
              />
              <Text style={styles.optionLabel}>Available Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <Text style={styles.distanceValue}>{distance} miles</Text>
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1 mi</Text>
            <Text style={styles.sliderLabel}>50 mi</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <Text style={styles.priceValue}>$0.20 - $0.40/kWh</Text>
          </View>
          <View style={styles.priceInputs}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {availableAmenities.map((amenity, idx) => {
              const selected = selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.amenityChip,
                    selected && styles.amenityChipSelected,
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <View
                    style={[
                      styles.amenityCheckbox,
                      selected && styles.amenityCheckboxChecked,
                    ]}
                  />
                  <Text
                    style={[
                      styles.amenityLabel,
                      selected && styles.amenityLabelSelected,
                    ]}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {availableAmenities.length === 0 && (
              <Text style={{ color: "#9ca3af" }}>Loading amenities...</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  resetButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 10,
  },
  radioSelected: {
    borderColor: "#10b981",
    borderWidth: 6,
  },
  distanceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
  },
  priceInputs: {
    flexDirection: "row",
    gap: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    width: "48%",
  },
  amenityChipSelected: {
    borderColor: "#10b981",
    backgroundColor: "#ecfdf5",
  },
  amenityCheckbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
  },
  amenityCheckboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  amenityLabel: {
    fontSize: 14,
    color: "#374151",
  },
  amenityLabelSelected: {
    color: "#10b981",
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  applyButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
