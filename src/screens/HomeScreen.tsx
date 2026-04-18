import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { COLORS } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const sampleJobs = [
  {
    id: '1',
    initials: '',
    title: 'Product Designer',
    company: 'Google inc.',
    location: 'HCMC, VietNam',
    salary: '25TR VNĐ',
    rate: 'Month',
    tags: ['Senior designer', 'Full time'],
  },
  {
    id: '2',
    initials: 'F',
    title: 'Backend Developer',
    company: 'FPT Corporation.',
    location: 'Da Nang, VietNam',
    salary: '20TR VNĐ',
    rate: 'Month',
    tags: ['Senior Developer', 'Full time'],
  },
  {
    id: '3',
    initials: 'H',
    title: 'Receptionist',
    company: 'The Herriott Hotel & Suite.',
    location: 'Da Nang, VietNam',
    salary: '13TR VNĐ',
    rate: 'Month',
    tags: ['Good English', 'Full time'],
  },
  {
    id: '4',
    initials: 'P',
    title: 'Pizza Staff',
    company: 'Cardi Pizzeria',
    location: 'Da Nang, VietNam',
    salary: '20k VNĐ',
    rate: 'Hour',
    tags: ['20+', 'Part time'],
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const renderJobCard = ({ item }: { item: (typeof sampleJobs)[0] }) => (
    <TouchableOpacity
      style={styles.jobCard}
      activeOpacity={0.88}
      onPress={() =>
        navigation.navigate('JobDetail', {
          jobTitle: item.title,
          company: item.company,
          location: item.location,
          logoText: item.title === 'Backend Developer' ? 'FPT' : item.initials,
        })
      }
    >
      <View style={styles.jobHeader}>
        <View style={styles.companyBadge}>
          <Text style={styles.companyBadgeText}>{item.initials}</Text>
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.company}>{item.company} · {item.location}</Text>
        </View>
        <Text style={styles.bookmark}>🔖</Text>
      </View>
      <View style={styles.jobDetails}>
        <Text style={styles.salary}>{item.salary}<Text style={styles.salaryUnit}>/{item.rate}</Text></Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{item.tags[0]}</Text>
          <Text style={styles.tag}>{item.tags[1]}</Text>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() =>
              navigation.navigate('JobDetail', {
                jobTitle: item.title,
                company: item.company,
                location: item.location,
                logoText: item.title === 'Backend Developer' ? 'FPT' : item.initials,
              })
            }
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AT</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.userName}>Ngo Anh Tu</Text>
        </View>

        <TouchableOpacity style={styles.searchContainer} activeOpacity={0.9} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchIcon}>⌕</Text>
          <Text style={styles.searchPlaceholder}>Search</Text>
          <Text style={styles.searchFilter}>⟲</Text>
        </TouchableOpacity>

        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerSmall}>OVER</Text>
            <Text style={styles.bannerCount}>1000 Jobs</Text>
            <TouchableOpacity style={styles.findButton}>
              <Text style={styles.findButtonText}>Find Now!</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerPaper} />
          <Text style={styles.bannerText}>FIND A NEW JOB</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statGreen]}>
            <Text style={styles.statIcon}>🧾</Text>
            <Text style={styles.statValue}>44.5k</Text>
            <Text style={styles.statLabel}>Remote Job</Text>
          </View>
          <View style={[styles.statCard, styles.statBlue]}>
            <Text style={styles.statValue}>66.8k</Text>
            <Text style={styles.statLabel}>Full Time</Text>
          </View>
          <View style={[styles.statCard, styles.statOrange]}>
            <Text style={styles.statValue}>38.9k</Text>
            <Text style={styles.statLabel}>Part Time</Text>
          </View>
          <View style={[styles.statCard, styles.statEmpty]} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Job List</Text>
        </View>

        <FlatList
          data={sampleJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomItemActive}>
          <Ionicons name="home" size={18} color="#D58A11" />
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('SavedJobs')}>
          <Ionicons name="bookmark-outline" size={18} color="#26264A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingChat} onPress={() => navigation.navigate('Message')}>
          <Ionicons name="chatbubble-outline" size={26} color="#1D1E3A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem} onPress={() => navigation.navigate('Post')}>
          <MaterialCommunityIcons name="account-group-outline" size={18} color="#26264A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomItem}>
          <Ionicons name="person-outline" size={18} color="#26264A" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDF4FF',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 108,
  },
  topCard: {
    backgroundColor: '#D7F2FB',
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 20,
    minHeight: 146,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  notificationButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 12,
  },
  greeting: {
    fontSize: 12,
    color: COLORS.darkText,
    opacity: 0.7,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.darkText,
    marginTop: 2,
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#A8BFD0',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: 8,
  },
  searchIcon: {
    fontSize: 15,
    color: COLORS.darkText,
  },
  searchFilter: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  banner: {
    backgroundColor: '#E6D2BF',
    borderRadius: 24,
    minHeight: 112,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  bannerLeft: {
    zIndex: 2,
  },
  bannerSmall: {
    fontSize: 11,
    color: '#C18A5D',
    letterSpacing: 1,
    fontWeight: '700',
  },
  bannerCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D2420',
    marginTop: 1,
  },
  bannerText: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    fontSize: 12,
    fontWeight: '700',
    color: '#2D2420',
    letterSpacing: 0.8,
  },
  bannerPaper: {
    position: 'absolute',
    right: 0,
    top: -2,
    width: 150,
    height: 122,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.44)',
    transform: [{ rotate: '-16deg' }],
  },
  findButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3A04D',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  findButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  statCard: {
    width: '48%',
    minHeight: 86,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statGreen: {
    backgroundColor: '#3FA73E',
  },
  statBlue: {
    backgroundColor: '#6E83AF',
  },
  statOrange: {
    backgroundColor: '#E29B18',
  },
  statEmpty: {
    backgroundColor: 'transparent',
    minHeight: 0,
    padding: 0,
  },
  statIcon: {
    fontSize: 17,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.darkText,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  listContent: {
    paddingBottom: 6,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#D5DBE9',
    shadowOpacity: 0.26,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  companyBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D1E3A',
  },
  jobInfo: {
    flex: 1,
  },
  bookmark: {
    fontSize: 16,
    color: '#737699',
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.darkText,
  },
  company: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  jobDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  salary: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  salaryUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    fontSize: 9,
    color: '#8486A2',
    backgroundColor: '#F5F5F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  applyButton: {
    marginLeft: 'auto',
    backgroundColor: '#F8DCCF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  applyButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D58C67',
  },
  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
    height: 66,
    borderRadius: 26,
    backgroundColor: '#D9F3FB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    shadowColor: '#A7BDD0',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bottomItem: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomItemActive: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#D58A11',
  },
  floatingChat: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#CE850C',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -36,
    borderWidth: 8,
    borderColor: '#DDF4FF',
  },
});
