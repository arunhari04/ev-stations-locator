import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Heart,
  Zap,
  MapPin,
  Share2,
  CheckCircle,
  Wifi,
  ShoppingBag,
  Coffee,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "@/services/api";
import { calculateDistance } from "@/utils/distance";
import { useAuth } from "@/context/AuthContext";

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { location } = useAuth();

  const [station, setStation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetails(Number(id));
    }
  }, [id]);

  const fetchDetails = async (stationId: number) => {
    try {
      const data = await api.getStationDetails(stationId);
      setStation(data);
      setFavorite(data.is_favorite);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await api.removeFavorite(station.id);
        setFavorite(false);
      } else {
        await api.addFavorite(station.id);
        setFavorite(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openNavigation = () => {
    if (station?.navigation_url) {
      Linking.openURL(station.navigation_url);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!station)
    return (
      <View style={styles.container}>
        <Text>Station not found</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              station.images && station.images.length > 0
                ? station.images[0]
                : "https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=1200",
          }}
          style={styles.image}
        />
        <TouchableOpacity
          style={[styles.backButton, { top: 16 + insets.top }]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#111" strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.favoriteButton, { top: 16 + insets.top }]}
          onPress={toggleFavorite}
        >
          <Heart
            size={24}
            color={favorite ? "#ef4444" : "#111"}
            fill={favorite ? "#ef4444" : "none"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.stationOperator}>{station.operator}</Text>
          <Text style={styles.stationAddress}>{station.address}</Text>
          <Text style={styles.price}>{station.price}</Text>
        </View>

        <View style={styles.badges}>
          <View style={styles.availableBadge}>
            <Text style={styles.availableBadgeText}>{station.status}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{station.opening_hours}</Text>
          </View>
          {station.is_fast_charging && (
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeBlueText}>Fast Charging</Text>
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {station.distance
                ? station.distance.toFixed(1)
                : location
                ? calculateDistance(
                    location.latitude,
                    location.longitude,
                    station.latitude,
                    station.longitude
                  ).toFixed(1)
                : "-"}
            </Text>
            <Text style={styles.statLabel}>km away</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {station.charger_types?.length || 0}
            </Text>
            <Text style={styles.statLabel}>types</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{station.power_kw}</Text>
            <Text style={styles.statLabel}>kW max</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charger Types</Text>
          <View style={styles.chargerList}>
            {station.charger_types?.map((type: string, idx: number) => (
              <View key={idx} style={styles.chargerItem}>
                <View style={styles.chargerIcon}>
                  <Zap size={20} color="#10b981" strokeWidth={2} />
                </View>
                <View style={styles.chargerInfo}>
                  <Text style={styles.chargerName}>{type}</Text>
                  <Text style={styles.chargerPower}>{station.power_kw} kW</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>
          <View style={styles.hoursCard}>
            <View style={styles.openNow}>
              <CheckCircle size={20} color="#10b981" strokeWidth={2} />
              <Text style={styles.openNowText}>Info</Text>
            </View>
            <Text style={styles.hoursText}>{station.opening_hours}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {station.amenities?.map((am: string, idx: number) => (
              <View key={idx} style={styles.amenityItem}>
                <Coffee size={20} color="#6b7280" strokeWidth={2} />
                <Text style={styles.amenityText}>{am}</Text>
              </View>
            ))}
            {(!station.amenities || station.amenities.length === 0) && (
              <Text>No amenities listed.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color="#9ca3af" strokeWidth={2} />
          </View>
          <Text style={styles.locationAddress}>{station.address}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.navigateButton}
            onPress={openNavigation}
          >
            <MapPin size={20} color="#fff" strokeWidth={2} />
            <Text style={styles.navigateButtonText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color="#374151" strokeWidth={2} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 256,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  stationOperator: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 16,
    color: "#6b7280",
  },
  price: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "bold",
    color: "#10b981",
  },

  priceUnit: {
    fontSize: 14,
    color: "#6b7280",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  availableBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
  },
  badge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  badgeBlue: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeBlueText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b82f6",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
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
  chargerList: {
    gap: 8,
  },
  chargerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  chargerIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chargerIconBlue: {
    width: 40,
    height: 40,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chargerInfo: {
    flex: 1,
  },
  chargerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginBottom: 2,
  },
  chargerPower: {
    fontSize: 14,
    color: "#6b7280",
  },
  chargerAvailable: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  chargerOccupied: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  hoursCard: {
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  openNow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  openNowText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  hoursText: {
    fontSize: 14,
    color: "#6b7280",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "48%",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 14,
    color: "#374151",
  },
  mapPlaceholder: {
    height: 192,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  navigateButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
