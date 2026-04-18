import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';

type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;

type JobCategory = 'Thiết kế' | 'Văn phòng' | 'Gia sư/Giáo dục' | 'Nhà hàng' | 'Sức khỏe' | 'Lập trình';
type JobType = 'Full time' | 'Part time' | 'Từ xa';
type Experience = 'Không có kinh nghiệm' | 'Ít hơn 1 năm' | '1-3 năm' | '3-5 năm' | '5-10 năm' | 'Nhiều hơn 10 năm';

type JobItem = {
  id: string;
  title: string;
  company: string;
  city: 'Đà Nẵng' | 'Hồ Chí Minh' | 'Hà Nội' | 'Cần Thơ';
  category: JobCategory;
  type: JobType;
  salaryPerHour: number;
  experience: Experience;
};

type CategoryItem = {
  id: JobCategory;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  jobs: number;
};

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'Thiết kế', icon: 'fountain-pen-tip', jobs: 140 },
  { id: 'Văn phòng', icon: 'office-building-outline', jobs: 250 },
  { id: 'Gia sư/Giáo dục', icon: 'school-outline', jobs: 120 },
  { id: 'Nhà hàng', icon: 'silverware-fork-knife', jobs: 85 },
  { id: 'Sức khỏe', icon: 'heart-plus-outline', jobs: 235 },
  { id: 'Lập trình', icon: 'laptop', jobs: 412 },
];

const JOBS: JobItem[] = [
  {
    id: '1',
    title: 'UI/UX Designer Intern',
    company: 'Apex Studio',
    city: 'Đà Nẵng',
    category: 'Thiết kế',
    type: 'Part time',
    salaryPerHour: 28,
    experience: 'Ít hơn 1 năm',
  },
  {
    id: '2',
    title: 'Nhân viên văn phòng ca chiều',
    company: 'MT Office',
    city: 'Đà Nẵng',
    category: 'Văn phòng',
    type: 'Full time',
    salaryPerHour: 24,
    experience: '1-3 năm',
  },
  {
    id: '3',
    title: 'Gia sư Toán cấp 2',
    company: 'TutorLink',
    city: 'Hồ Chí Minh',
    category: 'Gia sư/Giáo dục',
    type: 'Part time',
    salaryPerHour: 35,
    experience: 'Không có kinh nghiệm',
  },
  {
    id: '4',
    title: 'Phục vụ nhà hàng cuối tuần',
    company: 'Saji Kitchen',
    city: 'Đà Nẵng',
    category: 'Nhà hàng',
    type: 'Part time',
    salaryPerHour: 22,
    experience: 'Ít hơn 1 năm',
  },
  {
    id: '5',
    title: 'Điều dưỡng phòng khám',
    company: 'An Nhi Medical',
    city: 'Hà Nội',
    category: 'Sức khỏe',
    type: 'Full time',
    salaryPerHour: 40,
    experience: '3-5 năm',
  },
  {
    id: '6',
    title: 'Lập trình React Native',
    company: 'NexTech',
    city: 'Đà Nẵng',
    category: 'Lập trình',
    type: 'Từ xa',
    salaryPerHour: 95,
    experience: '1-3 năm',
  },
  {
    id: '7',
    title: 'Việc làm part time cho sinh viên',
    company: 'Student Work Hub',
    city: 'Đà Nẵng',
    category: 'Văn phòng',
    type: 'Part time',
    salaryPerHour: 20,
    experience: 'Không có kinh nghiệm',
  },
];

const QUICK_SUGGESTIONS = [
  'việc làm part-time cho sinh viên...',
  'việc làm part time 24/7',
  'việc làm part time chạy bàn',
  'việc làm part time cho mẹ bỉm',
  'việc làm part time cho học sinh',
  'việc làm part time cho người yêu',
];

function includesText(value: string, query: string) {
  return value.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(
    query.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  );
}

function SalaryRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (nextMin: number, nextMax: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(1);

  const minPct = ((min - 20) / 80) * 100;
  const maxPct = ((max - 20) / 80) * 100;

  const onTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(Math.max(event.nativeEvent.layout.width, 1));
  };

  const onTrackPress = (locationX: number) => {
    const raw = 20 + (locationX / trackWidth) * 80;
    const rounded = Math.round(raw / 5) * 5;
    const clamped = Math.max(20, Math.min(100, rounded));

    if (Math.abs(clamped - min) <= Math.abs(clamped - max)) {
      onChange(Math.min(clamped, max - 5), max);
      return;
    }

    onChange(min, Math.max(clamped, min + 5));
  };

  return (
    <View>
      <View style={styles.salaryHeaderRow}>
        <Text style={styles.sectionLabel}>Mức lương tối thiểu</Text>
        <Text style={styles.sectionLabel}>Mức lương tối đa</Text>
      </View>

      <Text style={styles.sectionTitle}>Mức lương</Text>

      <Pressable
        style={styles.rangeTrackWrap}
        onLayout={onTrackLayout}
        onPress={(event) => onTrackPress(event.nativeEvent.locationX)}
      >
        <View style={[styles.rangeSelected, { left: `${minPct}%`, width: `${Math.max(maxPct - minPct, 2)}%` }]} />
        <View style={[styles.thumb, { left: `${minPct}%` }]} />
        <View style={[styles.thumb, { left: `${maxPct}%` }]} />
      </Pressable>

      <View style={styles.salaryValueRow}>
        <Text style={styles.salaryValue}>{min}K/giờ</Text>
        <Text style={styles.salaryValue}>{max}K/giờ</Text>
      </View>
    </View>
  );
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>(['Full time']);
  const [selectedCities, setSelectedCities] = useState<JobItem['city'][]>(['Đà Nẵng']);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [minSalary, setMinSalary] = useState(20);
  const [maxSalary, setMaxSalary] = useState(100);
  const [showFilter, setShowFilter] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const suggestedItems = useMemo(() => {
    if (!query.trim()) {
      return QUICK_SUGGESTIONS;
    }

    const byTemplate = QUICK_SUGGESTIONS.filter((item) => includesText(item, query));
    const byData = JOBS.map((job) => job.title).filter((title) => includesText(title, query));

    return [...new Set([...byData, ...byTemplate])].slice(0, 7);
  }, [query]);

  const filteredJobs = useMemo(() => {
    return JOBS.filter((job) => {
      const matchesQuery =
        !query.trim() ||
        includesText(job.title, query) ||
        includesText(job.company, query) ||
        includesText(job.category, query);
      const matchesCategory = !selectedCategory || job.category === selectedCategory;
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type);
      const matchesCity = selectedCities.length === 0 || selectedCities.includes(job.city);
      const matchesSalary = job.salaryPerHour >= minSalary && job.salaryPerHour <= maxSalary;
      const matchesExperience = !experience || job.experience === experience;

      return matchesQuery && matchesCategory && matchesType && matchesCity && matchesSalary && matchesExperience;
    });
  }, [query, selectedCategory, selectedTypes, selectedCities, minSalary, maxSalary, experience]);

  const toggleType = (value: JobType) => {
    setSelectedTypes((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const toggleCity = (city: JobItem['city']) => {
    setSelectedCities((prev) => (prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]));
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedTypes([]);
    setSelectedCities([]);
    setExperience(null);
    setMinSalary(20);
    setMaxSalary(100);
  };

  const shouldShowSuggestions = isFocused && suggestedItems.length > 0;
  const shouldShowEmpty = query.trim().length > 0 && filteredJobs.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topIconButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Ionicons name="arrow-back" size={18} color="#484C73" />
        </TouchableOpacity>

        <View style={styles.searchBoxWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#BCC0D0" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search"
              placeholderTextColor="#C3C7D6"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.85} onPress={() => setShowFilter(true)}>
              <Ionicons name="options-outline" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {shouldShowSuggestions ? (
            <View style={styles.suggestionCard}>
              {suggestedItems.map((item) => (
                <TouchableOpacity key={item} style={styles.suggestionRow} onPress={() => setQuery(item)} activeOpacity={0.85}>
                  <Ionicons name="search-outline" size={14} color="#A3A8BB" />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {!query.trim() ? (
        <ScrollView contentContainerStyle={styles.specializationList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeader}>Danh mục công việc</Text>

          <View style={styles.categoryGrid}>
            {CATEGORY_ITEMS.map((category) => {
              const selected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, selected ? styles.categoryCardActive : null]}
                  onPress={() => setSelectedCategory(selected ? null : category.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.categoryIconCircle, selected ? styles.categoryIconCircleActive : null]}>
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={18}
                      color={selected ? '#FFFFFF' : '#F2A142'}
                    />
                  </View>
                  <Text style={[styles.categoryName, selected ? styles.categoryNameActive : null]}>{category.id}</Text>
                  <Text style={[styles.categoryCount, selected ? styles.categoryCountActive : null]}>{category.jobs} Jobs</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : shouldShowEmpty ? (
        <View style={styles.emptyWrap}>
          <MaterialCommunityIcons name="umbrella" size={96} color="#4A3B88" />
          <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptyText}>Không tìm thấy kết quả tìm kiếm, vui lòng kiểm tra lại chính tả hoặc nhập từ khóa khác.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultList} showsVerticalScrollIndicator={false}>
          {filteredJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={styles.resultCard}
              activeOpacity={0.87}
              onPress={() =>
                navigation.navigate('JobDetail', {
                  jobTitle: job.title,
                  company: job.company,
                  location: `${job.city}, VietNam`,
                  logoText: 'S',
                })
              }
            >
              <Text style={styles.resultTitle}>{job.title}</Text>
              <Text style={styles.resultMeta}>{job.company} · {job.city}</Text>
              <View style={styles.resultTagRow}>
                <Text style={styles.resultTag}>{job.category}</Text>
                <Text style={styles.resultTag}>{job.type}</Text>
                <Text style={styles.resultSalary}>{job.salaryPerHour}K/giờ</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal visible={showFilter} transparent animationType="slide" onRequestClose={() => setShowFilter(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowFilter(false)}>
          <Pressable style={styles.filterPanel}>
            {!showAdvanced ? (
              <>
                <View style={styles.filterTopRow}>
                  <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.topIconButton} activeOpacity={0.85}>
                    <Ionicons name="arrow-back" size={18} color="#484C73" />
                  </TouchableOpacity>
                  <Text style={styles.filterTitle}>Bộ lọc</Text>
                  <TouchableOpacity onPress={() => setShowAdvanced(true)} activeOpacity={0.85}>
                    <Text style={styles.advancedToggle}>Nâng cao</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.filterLabel}>Danh mục</Text>
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownText}>{selectedCategory ?? 'Thiết kế'}</Text>
                  <Ionicons name="chevron-up" size={13} color="#7A7F9B" />
                </View>

                <Text style={styles.filterLabel}>Danh mục phụ</Text>
                <View style={styles.dropdownRow}><Text style={styles.dropdownText}>UI/UX Design</Text></View>

                <Text style={styles.filterLabel}>Địa điểm</Text>
                <View style={styles.dropdownRow}><Text style={styles.dropdownText}>{selectedCities[0] ?? 'Đà Nẵng'}</Text></View>

                <SalaryRange
                  min={minSalary}
                  max={maxSalary}
                  onChange={(nextMin, nextMax) => {
                    setMinSalary(nextMin);
                    setMaxSalary(nextMax);
                  }}
                />

                <Text style={styles.filterLabel}>Loại hình công việc</Text>
                <View style={styles.chipRow}>
                  {(['Full time', 'Part time', 'Từ xa'] as JobType[]).map((type) => {
                    const selected = selectedTypes.includes(type);
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.chip, selected ? styles.chipActive : null]}
                        onPress={() => toggleType(type)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.chipText, selected ? styles.chipTextActive : null]}>{type}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity style={styles.findButton} onPress={() => setShowFilter(false)} activeOpacity={0.88}>
                  <Text style={styles.findButtonText}>TÌM NGAY</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.filterTopRow}>
                  <TouchableOpacity onPress={() => setShowAdvanced(false)} style={styles.topIconButton} activeOpacity={0.85}>
                    <Ionicons name="arrow-back" size={18} color="#484C73" />
                  </TouchableOpacity>
                  <Text style={styles.filterTitle}>Bộ lọc</Text>
                  <View style={{ width: 56 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.advancedContent}>
                  <Text style={styles.filterLabel}>Cập nhật gần đây</Text>
                  {['Mới nhất', 'Tuần trước', 'Tháng trước', 'Tất cả thời gian'].map((item) => (
                    <TouchableOpacity key={item} style={styles.optionRow} activeOpacity={0.85}>
                      <Ionicons name="radio-button-off" size={15} color="#8085A2" />
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.filterLabel}>Hình thức làm việc</Text>
                  {['Tại văn phòng/Cửa hàng', 'Linh hoạt (Xử lý việc)', 'Làm việc từ xa'].map((item, idx) => (
                    <TouchableOpacity key={item} style={styles.optionRow} activeOpacity={0.85}>
                      <Ionicons name={idx === 0 ? 'radio-button-on' : 'radio-button-off'} size={15} color={idx === 0 ? '#F4A345' : '#8085A2'} />
                      <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}

                  <Text style={styles.filterLabel}>Loại hình công việc</Text>
                  <View style={styles.chipRow}>
                    {(['Thực tập sinh', 'Part time', 'Full time'] as const).map((item) => (
                      <TouchableOpacity key={item} style={[styles.chip, item === 'Full time' ? styles.chipActive : null]} activeOpacity={0.85}>
                        <Text style={[styles.chipText, item === 'Full time' ? styles.chipTextActive : null]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.filterLabel}>Cấp bậc</Text>
                  <View style={styles.chipRow}>
                    {['Junior', 'Senior', 'Leader', 'Manager'].map((item) => (
                      <TouchableOpacity key={item} style={[styles.chip, item === 'Senior' ? styles.chipActive : null]} activeOpacity={0.85}>
                        <Text style={[styles.chipText, item === 'Senior' ? styles.chipTextActive : null]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.filterLabel}>Thành phố</Text>
                  {(['Đà Nẵng', 'Hồ Chí Minh', 'Hà Nội', 'Cần Thơ'] as JobItem['city'][]).map((city) => {
                    const selected = selectedCities.includes(city);
                    return (
                      <TouchableOpacity key={city} style={styles.optionRow} onPress={() => toggleCity(city)} activeOpacity={0.85}>
                        <Ionicons name={selected ? 'checkbox' : 'square-outline'} size={15} color={selected ? '#F4A345' : '#8085A2'} />
                        <Text style={styles.optionText}>{city}, VIETNAM</Text>
                      </TouchableOpacity>
                    );
                  })}

                  <SalaryRange
                    min={minSalary}
                    max={maxSalary}
                    onChange={(nextMin, nextMax) => {
                      setMinSalary(nextMin);
                      setMaxSalary(nextMax);
                    }}
                  />

                  <Text style={styles.filterLabel}>Kinh nghiệm</Text>
                  {([
                    'Không có kinh nghiệm',
                    'Ít hơn 1 năm',
                    '1-3 năm',
                    '3-5 năm',
                    '5-10 năm',
                    'Nhiều hơn 10 năm',
                  ] as Experience[]).map((item) => {
                    const selected = experience === item;
                    return (
                      <TouchableOpacity key={item} style={styles.optionRow} onPress={() => setExperience(selected ? null : item)} activeOpacity={0.85}>
                        <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={15} color={selected ? '#F4A345' : '#8085A2'} />
                        <Text style={styles.optionText}>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  <Text style={styles.filterLabel}>Công việc</Text>
                  {CATEGORY_ITEMS.map((item) => {
                    const selected = selectedCategory === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.optionRow}
                        onPress={() => setSelectedCategory(selected ? null : item.id)}
                        activeOpacity={0.85}
                      >
                        <Ionicons name={selected ? 'checkbox' : 'square-outline'} size={15} color={selected ? '#F4A345' : '#8085A2'} />
                        <Text style={styles.optionText}>{item.id}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.advancedBottomRow}>
                  <TouchableOpacity style={styles.resetButton} onPress={resetFilters} activeOpacity={0.85}>
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.findPrimaryButton}
                    onPress={() => {
                      setShowFilter(false);
                      setShowAdvanced(false);
                    }}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.findPrimaryText}>FIND NOW</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F7',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topBar: {
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  topIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxWrap: {
    flex: 1,
  },
  searchBox: {
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAECF2',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#C2C6D4',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    color: '#1E2242',
    fontSize: 13,
    paddingVertical: 8,
  },
  filterButton: {
    width: 23,
    height: 23,
    borderRadius: 6,
    backgroundColor: '#F2A142',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionCard: {
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9F0',
    shadowColor: '#BDC2D1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    overflow: 'hidden',
  },
  suggestionRow: {
    minHeight: 34,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  suggestionText: {
    flex: 1,
    fontSize: 11,
    color: '#7D829C',
  },
  specializationList: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 15,
    color: '#2A2E51',
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEEF4',
  },
  categoryCardActive: {
    backgroundColor: '#F2A142',
    borderColor: '#F2A142',
  },
  categoryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryIconCircleActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2C3052',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#FFFFFF',
  },
  categoryCount: {
    marginTop: 4,
    fontSize: 10,
    color: '#B2B6C8',
  },
  categoryCountActive: {
    color: '#FFE6CC',
  },
  resultList: {
    paddingBottom: 20,
    gap: 10,
  },
  resultCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEEF4',
    padding: 12,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#21254A',
  },
  resultMeta: {
    marginTop: 4,
    fontSize: 11,
    color: '#8A8FA8',
  },
  resultTagRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultTag: {
    backgroundColor: '#F5F6F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    color: '#6D7291',
  },
  resultSalary: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: '700',
    color: '#F2A142',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#252A4D',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 12,
    color: '#8E93AB',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(24,26,44,0.16)',
    justifyContent: 'flex-end',
  },
  filterPanel: {
    backgroundColor: '#F4F5F8',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    maxHeight: '92%',
  },
  filterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E2243',
  },
  advancedToggle: {
    fontSize: 12,
    color: '#F2A142',
    fontWeight: '700',
  },
  filterLabel: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2E51',
  },
  dropdownRow: {
    minHeight: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEEF4',
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 11,
    color: '#565B79',
  },
  salaryHeaderRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 10,
    color: '#5F6485',
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#2A2E51',
  },
  rangeTrackWrap: {
    marginTop: 8,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: '#F7F8FB',
  },
  rangeSelected: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#F2A142',
  },
  thumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2344',
    marginLeft: -7,
  },
  salaryValueRow: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salaryValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E2243',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 72,
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#F4EEE7',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#F2A142',
  },
  chipText: {
    fontSize: 10,
    color: '#9F8D7B',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  findButton: {
    marginTop: 16,
    minHeight: 40,
    borderRadius: 6,
    backgroundColor: '#2F9A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  advancedContent: {
    paddingBottom: 18,
  },
  optionRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    fontSize: 11,
    color: '#505574',
  },
  advancedBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  resetButton: {
    minHeight: 40,
    borderRadius: 6,
    backgroundColor: '#F2ECE6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  resetText: {
    color: '#F2A142',
    fontSize: 12,
    fontWeight: '700',
  },
  findPrimaryButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 6,
    backgroundColor: '#2F9A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
