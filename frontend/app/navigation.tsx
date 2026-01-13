import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { X, MapPin, Navigation } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NavigationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Navigation size={64} color="#9ca3af" strokeWidth={2} />
          <Text style={styles.mapPlaceholderText}>Navigation Map</Text>
        </View>

        <View style={[styles.routeCard, { top: 16 + insets.top }]}>
          <View style={styles.routeHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color="#6b7280" strokeWidth={2} />
            </TouchableOpacity>
            <View style={styles.routeInfo}>
              <Text style={styles.stationName}>Tesla Supercharger</Text>
              <Text style={styles.stationAddress}>123 Main Street</Text>
            </View>
          </View>

          <View style={styles.routeStats}>
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>0.3 mi</Text>
              <Text style={styles.routeStatLabel}>Distance</Text>
            </View>
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>2 min</Text>
              <Text style={styles.routeStatLabel}>ETA</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.startButton}>
          <Navigation size={24} color="#fff" strokeWidth={2} />
          <Text style={styles.startButtonText}>Start Navigation</Text>
        </TouchableOpacity>

        <View style={styles.appButtons}>
          <TouchableOpacity style={styles.appButton}>
            <MapPin size={24} color="#374151" strokeWidth={2} />
            <Text style={styles.appButtonText}>Google Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appButton}>
            <MapPin size={24} color="#374151" strokeWidth={2} />
            <Text style={styles.appButtonText}>Apple Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appButton}>
            <MapPin size={24} color="#374151" strokeWidth={2} />
            <Text style={styles.appButtonText}>Waze</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  routeCard: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  routeStats: {
    flexDirection: 'row',
    gap: 16,
    padding: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
  },
  routeStat: {
    flex: 1,
  },
  routeStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 2,
  },
  routeStatLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  actions: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 24,
    gap: 12,
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  appButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  appButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
  },
  appButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
});
