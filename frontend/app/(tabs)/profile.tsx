import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings,
  Heart,
  Clock,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

const MENU_ITEMS = [
  { icon: Heart, label: 'Favorite Stations', subtitle: 'View saved locations', color: '#ef4444' },
  { icon: Clock, label: 'Charging History', subtitle: 'View past sessions', color: '#3b82f6' },
  { icon: CreditCard, label: 'Payment Methods', subtitle: 'Manage cards', color: '#8b5cf6' },
  { icon: Bell, label: 'Notifications', subtitle: 'Manage preferences', color: '#f97316' },
  { icon: HelpCircle, label: 'Help & Support', subtitle: 'Get assistance', color: '#6b7280' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}>
      <LinearGradient
        colors={['#10b981', '#14b8a6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity>
              <Settings size={24} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
               {user?.profile_image ? (
                   <Image source={{ uri: user.profile_image }} style={{ width: 80, height: 80, borderRadius: 40 }} />
               ) : (
                   <Text style={styles.avatarText}>{user?.first_name ? user.first_name[0] : 'U'}</Text>
               )}
            </View>
            <View>
              <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Charging Stats</Text>
          <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>kWh Used</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
          </View>
        </View>

        <View style={styles.menuList}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <item.icon size={20} color={item.color} strokeWidth={2} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}>
            <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
              <LogOut size={20} color="#ef4444" strokeWidth={2} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: '#ef4444' }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 96,
    paddingHorizontal: 24,
  },
  headerContent: {
    gap: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    paddingHorizontal: 24,
    marginTop: -64,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
