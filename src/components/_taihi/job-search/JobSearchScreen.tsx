import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import AreaMap from './AreaMap';
import {
  DEFAULT_CENTER,
  DEFAULT_RADIUS_KM,
  EMPLOYMENT_FILTERS,
  INDUSTRIES,
  JOBS,
  PREFECTURES,
} from './data';
import { colors, styles } from './styles';
import TopBar from './TopBar';
import type { AreaSelection, Coordinate, Job } from './types';

function PrimaryButton({
  label,
  icon,
  onPress,
  fullWidth = false,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.buttonMobile,
        pressed && styles.buttonPressed,
      ]}
    >
      <LinearGradient
        colors={[colors.sky, colors.blueDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <Text style={styles.buttonTextPrimary}>{label}</Text>
      {icon ? <Feather name={icon} size={15} color={colors.white} /> : null}
    </Pressable>
  );
}

function GhostButton({
  label,
  onPress,
  icon,
  fullWidth = false,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.ghostButton,
        fullWidth && styles.ghostButtonMobile,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.ghostButtonText}>{label}</Text>
      {icon ? <Feather name={icon} size={15} color={colors.ink} /> : null}
    </Pressable>
  );
}

function JobCard({ job, mobile }: { job: Job; mobile: boolean }) {
  const router = useRouter();

  const openDetails = () => {
    router.push(`/jobs/${job.id}` as Href);
  };

  return (
    <View style={[styles.jobCard, mobile && styles.jobCardMobile]}>
      <LinearGradient
        colors={[colors.sky, colors.blueDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoGradient}
      >
        <Text style={styles.jobLogoText}>{job.logoText}</Text>
      </LinearGradient>

      <View style={styles.jobBody}>
        <Pressable onPress={openDetails} accessibilityRole="link">
          <Text style={styles.jobTitle}>{job.title}</Text>
        </Pressable>
        <Text style={styles.jobCompany}>{job.company}</Text>

        <View style={styles.jobMeta}>
          <View style={styles.jobMetaItem}>
            <Feather name="map-pin" size={14} color={colors.muted} />
            <Text style={styles.jobMetaText}>{job.location}</Text>
          </View>
          <View style={styles.jobMetaItem}>
            <Feather name="briefcase" size={14} color={colors.muted} />
            <Text style={styles.jobMetaText}>{job.employmentType}</Text>
          </View>
          <View style={styles.jobMetaItem}>
            <Feather name="credit-card" size={14} color={colors.muted} />
            <Text style={styles.jobMetaText}>{job.salary}</Text>
          </View>
        </View>

        <View style={styles.jobTags}>
          {job.tags.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <GhostButton
        label="詳細を見る"
        icon="arrow-right"
        onPress={openDetails}
        fullWidth={mobile}
      />
    </View>
  );
}

export default function JobSearchScreen() {
  const { width } = useWindowDimensions();
  const mobile = width <= 720;
  const horizontalPadding = Math.max(20, Math.min(width * 0.06, 72));

  const [keyword, setKeyword] = useState('');
  const [prefecture, setPrefecture] = useState('osaka');
  const [industry, setIndustry] = useState('it');
  const [employmentFilter, setEmploymentFilter] = useState('すべて');
  const [sort, setSort] = useState('new');

  const [mapOpen, setMapOpen] = useState(false);
  const [draftCenter, setDraftCenter] = useState<Coordinate>(DEFAULT_CENTER);
  const [draftRadiusKm, setDraftRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [area, setArea] = useState<AreaSelection | null>(null);

  const jobLocations = useMemo(
    () =>
      JOBS.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        latitude: job.coordinate.latitude,
        longitude: job.coordinate.longitude,
      })),
    [],
  );

  const openMap = () => {
    setDraftCenter(area?.center ?? DEFAULT_CENTER);
    setDraftRadiusKm(area?.radiusKm ?? DEFAULT_RADIUS_KM);
    setMapOpen(true);
  };

  const applyArea = () => {
    setArea({ center: draftCenter, radiusKm: draftRadiusKm });
    setMapOpen(false);
  };

  const executeSearch = () => {
    const request = {
      keyword,
      prefecture,
      industry,
      employmentType:
        employmentFilter === 'すべて' ? undefined : employmentFilter,
      sort,
      areaLat: area?.center.latitude,
      areaLng: area?.center.longitude,
      areaRadiusKm: area?.radiusKm,
    };

    // API接続時は、このrequestをfetch/axiosのクエリまたはbodyに渡してください。
    console.log('job-search request', request);
  };

  return (
    <View style={styles.screen}>
      <TopBar />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#ffffff', '#f3f8fd', '#e9f2fb']}
          locations={[0, 0.6, 1]}
          style={styles.hero}
        >
          <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>GLOBALWORKERS — 求人検索</Text>
            </View>

            <Text style={[styles.heading, mobile && styles.headingMobile]}>
              あなたに合う<Text style={styles.headingAccent}>一社</Text>を、見つけよう。
            </Text>

            <View style={[styles.searchForm, mobile && styles.searchFormMobile]}>
              <View
                style={[
                  styles.field,
                  styles.fieldKeyword,
                  mobile && styles.fieldMobile,
                ]}
              >
                <Text style={styles.label}>キーワード</Text>
                <TextInput
                  value={keyword}
                  onChangeText={setKeyword}
                  onSubmitEditing={executeSearch}
                  returnKeyType="search"
                  placeholder="職種・会社名・スキルで検索"
                  placeholderTextColor="#8794a8"
                  style={styles.input}
                />
              </View>

              <View style={[styles.field, mobile && styles.fieldMobile]}>
                <Text style={styles.label}>勤務地</Text>
                <View style={styles.pickerShell}>
                  <Picker
                    selectedValue={prefecture}
                    onValueChange={(value) => setPrefecture(String(value))}
                    style={styles.picker}
                  >
                    {PREFECTURES.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={[styles.field, mobile && styles.fieldMobile]}>
                <Text style={styles.label}>業種</Text>
                <View style={styles.pickerShell}>
                  <Picker
                    selectedValue={industry}
                    onValueChange={(value) => setIndustry(String(value))}
                    style={styles.picker}
                  >
                    {INDUSTRIES.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <PrimaryButton
                label="検索する"
                icon="search"
                onPress={executeSearch}
                fullWidth={mobile}
              />

              <Pressable
                accessibilityRole="button"
                onPress={openMap}
                style={({ pressed }) => [
                  styles.mapSelectButton,
                  mobile && styles.buttonMobile,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Feather name="map-pin" size={15} color={colors.blueDeep} />
                <Text style={styles.mapSelectText}>地図で範囲を選択</Text>
              </Pressable>
            </View>

            {area ? (
              <View style={styles.areaSummary}>
                <View style={styles.areaMapFrame}>
                  <AreaMap
                    compact
                    interactive={false}
                    center={area.center}
                    radiusKm={area.radiusKm}
                  />
                </View>
                <View style={styles.areaSummaryText}>
                  <Text style={styles.areaSummaryTitle}>
                    半径{area.radiusKm}km
                  </Text>
                  <Text style={styles.areaSummarySub}>
                    緯度{area.center.latitude.toFixed(3)} / 経度
                    {area.center.longitude.toFixed(3)}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="範囲選択を解除"
                  onPress={() => setArea(null)}
                  style={styles.clearButton}
                >
                  <Feather name="x" size={15} color={colors.blueDeep} />
                </Pressable>
              </View>
            ) : null}

            <View style={styles.quickFilters}>
              {EMPLOYMENT_FILTERS.map((filter) => {
                const active = employmentFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setEmploymentFilter(filter)}
                    style={({ pressed }) => [
                      styles.quickFilter,
                      pressed && styles.quickFilterPressed,
                      active && styles.quickFilterActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickFilterText,
                        active && styles.quickFilterTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.results}>
          <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>
            <View style={styles.resultsMeta}>
              <Text style={styles.resultsCount}>
                <Text style={styles.resultsCountStrong}>128</Text> 件の求人が見つかりました
              </Text>

              <View style={styles.sortRow}>
                <Text style={styles.sortLabel}>並び替え</Text>
                <View style={styles.sortPickerShell}>
                  <Picker
                    selectedValue={sort}
                    onValueChange={(value) => setSort(String(value))}
                    style={styles.sortPicker}
                  >
                    <Picker.Item label="新着順" value="new" />
                    <Picker.Item label="給与が高い順" value="salary" />
                  </Picker>
                </View>
              </View>
            </View>

            {JOBS.length > 0 ? (
              <View style={styles.jobList}>
                {JOBS.map((job) => (
                  <JobCard key={job.id} job={job} mobile={mobile} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Feather name="search" size={44} color={colors.skyLight} />
                <Text style={styles.emptyTitle}>
                  条件に一致する求人が見つかりませんでした。
                </Text>
                <Text style={styles.emptySub}>
                  キーワードや条件を変えて、もう一度検索してみてください。
                </Text>
              </View>
            )}

            <View style={styles.pagination}>
              <Pressable onPress={() => console.log('previous page')}>
                <Text style={styles.pageLink}>← 前へ</Text>
              </Pressable>
              <Text style={styles.pageStatus}>1 / 10</Text>
              <Pressable onPress={() => console.log('next page')}>
                <Text style={styles.pageLink}>次へ →</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={mapOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMapOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel="地図モーダルを閉じる"
            onPress={() => setMapOpen(false)}
            style={styles.modalBackdrop}
          />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>地図で範囲を選択</Text>
              <Pressable
                accessibilityLabel="閉じる"
                onPress={() => setMapOpen(false)}
                style={styles.modalClose}
              >
                <Feather name="x" size={21} color={colors.muted} />
              </Pressable>
            </View>

            <Text style={styles.modalHint}>
              地図をタップすると、その場所を中心に検索範囲を指定できます。
            </Text>

            <View style={styles.mapContainer}>
              <AreaMap
                center={draftCenter}
                radiusKm={draftRadiusKm}
                jobLocations={jobLocations}
                onCenterChange={setDraftCenter}
              />
            </View>

            <View style={styles.modalControls}>
              <View style={styles.radiusRow}>
                <Text style={styles.radiusLabel}>半径</Text>
                <Slider
                  minimumValue={1}
                  maximumValue={30}
                  step={1}
                  value={draftRadiusKm}
                  onValueChange={setDraftRadiusKm}
                  minimumTrackTintColor={colors.blue}
                  maximumTrackTintColor="#cbd7e6"
                  thumbTintColor={colors.blueDeep}
                  style={styles.slider}
                />
                <Text style={styles.radiusValue}>{draftRadiusKm} km</Text>
              </View>

              <View style={styles.modalActions}>
                <View style={mobile ? styles.modalActionMobile : undefined}>
                  <GhostButton
                    label="キャンセル"
                    onPress={() => setMapOpen(false)}
                    fullWidth={mobile}
                  />
                </View>
                <View style={mobile ? styles.modalActionMobile : undefined}>
                  <PrimaryButton
                    label="この範囲で検索"
                    onPress={applyArea}
                    fullWidth={mobile}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
