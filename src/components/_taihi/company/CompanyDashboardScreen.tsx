import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  dashboardApplicants,
  dashboardJobs,
  dashboardMetrics,
  dashboardTasks,
  funnelData,
  type DashboardApplicant,
  type DashboardJob,
  type DashboardMetric,
  type DashboardTask,
  type FeatherName,
} from './data';
import {
  dashboardColors,
  companyDashboardStyles as styles,
} from './styles';

type Props = {
  companyCode: string;
};

type NavigationItem = {
  key: string;
  label: string;
  icon: FeatherName;
  badge?: number;
};

const navigationItems: NavigationItem[] = [
  { key: 'overview', label: 'ダッシュボード', icon: 'grid' },
  { key: 'jobs', label: '求人管理', icon: 'briefcase' },
  { key: 'applicants', label: '応募者管理', icon: 'users', badge: 14 },
  { key: 'messages', label: 'メッセージ', icon: 'message-square', badge: 5 },
  { key: 'analytics', label: 'アクセス分析', icon: 'bar-chart-2' },
];

const settingsItems: NavigationItem[] = [
  { key: 'company', label: '企業情報', icon: 'home' },
  { key: 'members', label: '担当者管理', icon: 'user-check' },
  { key: 'settings', label: '設定', icon: 'settings' },
];

export default function CompanyDashboardScreen({ companyCode }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 680;
  const isCompact = width < 680;
  const [activeNavigation, setActiveNavigation] = useState('overview');

  const todayText = useMemo(
    () =>
      new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      }).format(new Date()),
    [],
  );

  const openPlaceholder = (label: string) => {
    console.log(`${label}画面へ遷移してください。`, { companyCode });
  };

  const signOut = () => {
    router.replace({
      pathname: '/company/[companyCode]/sign-in',
      params: { companyCode },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.shell}>
        {isDesktop ? (
          <DashboardSidebar
            companyCode={companyCode}
            activeKey={activeNavigation}
            onSelect={(item) => {
              setActiveNavigation(item.key);
              if (item.key !== 'overview') openPlaceholder(item.label);
            }}
            onSignOut={signOut}
          />
        ) : null}

        <View style={styles.main}>
          {!isDesktop ? (
            <>
              <MobileHeader onSignOut={signOut} />
              <MobileNavigation
                activeKey={activeNavigation}
                onSelect={(item) => {
                  setActiveNavigation(item.key);
                  if (item.key !== 'overview') openPlaceholder(item.label);
                }}
              />
            </>
          ) : null}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View
              style={StyleSheet.flatten([
                styles.content,
                !isDesktop && styles.contentMobile,
              ])}
            >
              <View
                style={StyleSheet.flatten([
                  styles.pageHeader,
                  isCompact && styles.pageHeaderMobile,
                ])}
              >
                <View>
                  <Text style={styles.eyebrow}>COMPANY DASHBOARD</Text>
                  <Text
                    style={StyleSheet.flatten([
                      styles.title,
                      isCompact && styles.titleMobile,
                    ])}
                  >
                    おかえりなさい、採用担当者さま
                  </Text>
                  <Text style={styles.subtitle}>
                    {todayText} · 採用活動の最新状況を確認できます。
                  </Text>
                </View>

                <View style={styles.headerActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openPlaceholder('求人作成')}
                    style={({ pressed }) =>
                      StyleSheet.flatten([
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                      ])
                    }
                  >
                    <LinearGradient
                      colors={['#4a8fe0', '#14284d']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.primaryButtonGradient}
                    >
                      <Feather name="plus" size={16} color="#ffffff" />
                      <Text style={styles.primaryButtonText}>新しい求人を作成</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>

              <View style={styles.metricsGrid}>
                {dashboardMetrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    metric={metric}
                    layout={
                      isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile'
                    }
                  />
                ))}
              </View>

              <View
                style={StyleSheet.flatten([
                  styles.twoColumn,
                  !isTablet && styles.twoColumnMobile,
                ])}
              >
                <FunnelCard />
                <TasksCard onOpenAll={() => openPlaceholder('対応タスク')} />
              </View>

              <View style={styles.fullSection}>
                <JobsCard
                  compact={isCompact}
                  onCreate={() => openPlaceholder('求人作成')}
                  onOpenAll={() => openPlaceholder('求人管理')}
                />
              </View>

              <View
                style={StyleSheet.flatten([
                  styles.bottomGrid,
                  !isTablet && styles.bottomGridMobile,
                ])}
              >
                <ApplicantsCard
                  onOpenAll={() => openPlaceholder('応募者管理')}
                />
                <MessagesPreviewCard
                  onOpen={() => openPlaceholder('メッセージ')}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DashboardSidebar({
  companyCode,
  activeKey,
  onSelect,
  onSignOut,
}: {
  companyCode: string;
  activeKey: string;
  onSelect: (item: NavigationItem) => void;
  onSignOut: () => void;
}) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarLogo}>
        <LinearGradient
          colors={['#6fc0f0', '#14284d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoMark}
        >
          <Feather name="globe" size={18} color="#ffffff" />
        </LinearGradient>
        <View style={styles.logoTextGroup}>
          <Text style={styles.logoText}>GlobalWorkers</Text>
          <Text style={styles.logoSubText}>FOR BUSINESS</Text>
        </View>
      </View>

      <View style={styles.companyPanel}>
        <View style={styles.companyPanelTop}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>GW</Text>
          </View>
          <View style={styles.companyPanelText}>
            <Text style={styles.companyName} numberOfLines={1}>
              株式会社サンプルテック
            </Text>
            <Text style={styles.companyCode} numberOfLines={1}>
              ID: {companyCode}
            </Text>
          </View>
        </View>
        <View style={styles.companyVerified}>
          <Feather name="check-circle" size={13} color={dashboardColors.success} />
          <Text style={styles.companyVerifiedText}>企業確認済み</Text>
        </View>
      </View>

      <Text style={styles.navSectionLabel}>採用管理</Text>
      <View style={styles.navList}>
        {navigationItems.map((item) => (
          <SidebarNavigationItem
            key={item.key}
            item={item}
            active={activeKey === item.key}
            onPress={() => onSelect(item)}
          />
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.navSectionLabel}>企業アカウント</Text>
        <View style={styles.navList}>
          {settingsItems.map((item) => (
            <SidebarNavigationItem
              key={item.key}
              item={item}
              active={activeKey === item.key}
              onPress={() => onSelect(item)}
            />
          ))}
        </View>
      </View>

      <View style={styles.sidebarBottom}>
        <SidebarNavigationItem
          item={{ key: 'help', label: 'ヘルプ', icon: 'help-circle' }}
          active={false}
          onPress={() => console.log('ヘルプ')}
        />
        <SidebarNavigationItem
          item={{ key: 'logout', label: 'サインアウト', icon: 'log-out' }}
          active={false}
          onPress={onSignOut}
        />
      </View>
    </View>
  );
}

function SidebarNavigationItem({
  item,
  active,
  onPress,
}: {
  item: NavigationItem;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.navItem,
          active && styles.navItemActive,
          pressed && styles.navItemPressed,
        ])
      }
    >
      <Feather
        name={item.icon}
        size={16}
        color={active ? dashboardColors.white : dashboardColors.muted}
      />
      <Text
        style={StyleSheet.flatten([
          styles.navItemText,
          active && styles.navItemTextActive,
        ])}
      >
        {item.label}
      </Text>
      {item.badge ? (
        <View
          style={StyleSheet.flatten([
            styles.navBadge,
            active && styles.navBadgeActive,
          ])}
        >
          <Text
            style={StyleSheet.flatten([
              styles.navBadgeText,
              active && styles.navBadgeTextActive,
            ])}
          >
            {item.badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function MobileHeader({ onSignOut }: { onSignOut: () => void }) {
  return (
    <View style={styles.mobileHeader}>
      <View style={styles.mobileLogo}>
        <LinearGradient
          colors={['#6fc0f0', '#14284d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoMark}
        >
          <Feather name="globe" size={17} color="#ffffff" />
        </LinearGradient>
        <Text style={styles.mobileLogoText}>GlobalWorkers</Text>
      </View>

      <View style={styles.mobileHeaderActions}>
        <Pressable style={styles.iconButton} onPress={() => console.log('通知')}>
          <Feather name="bell" size={17} color={dashboardColors.blueDeep} />
          <View style={styles.notificationDot} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onSignOut}>
          <Feather name="log-out" size={17} color={dashboardColors.blueDeep} />
        </Pressable>
      </View>
    </View>
  );
}

function MobileNavigation({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (item: NavigationItem) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.mobileNavScroll}
      contentContainerStyle={styles.mobileNavContent}
    >
      {navigationItems.map((item) => {
        const active = activeKey === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item)}
            style={StyleSheet.flatten([
              styles.mobileNavItem,
              active && styles.mobileNavItemActive,
            ])}
          >
            <Feather
              name={item.icon}
              size={14}
              color={active ? dashboardColors.white : dashboardColors.blueDeep}
            />
            <Text
              style={StyleSheet.flatten([
                styles.mobileNavText,
                active && styles.mobileNavTextActive,
              ])}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function MetricCard({
  metric,
  layout,
}: {
  metric: DashboardMetric;
  layout: 'desktop' | 'tablet' | 'mobile';
}) {
  const widthStyle =
    layout === 'desktop'
      ? styles.metricCardDesktop
      : layout === 'tablet'
        ? styles.metricCardTablet
        : styles.metricCardMobile;

  return (
    <View style={StyleSheet.flatten([styles.metricCard, widthStyle])}>
      <View style={styles.metricTop}>
        <View style={styles.metricIcon}>
          <Feather name={metric.icon} size={19} color={dashboardColors.blue} />
        </View>
        <Feather name="more-horizontal" size={17} color={dashboardColors.softMuted} />
      </View>
      <Text style={styles.metricValue}>{metric.value}</Text>
      <Text style={styles.metricLabel}>{metric.label}</Text>
      <View style={styles.metricComparison}>
        <Feather
          name={metric.trend === 'up' ? 'trending-up' : 'clock'}
          size={12}
          color={
            metric.trend === 'up'
              ? dashboardColors.success
              : dashboardColors.softMuted
          }
        />
        <Text
          style={StyleSheet.flatten([
            styles.metricComparisonText,
            metric.trend === 'up' && styles.metricComparisonUp,
          ])}
        >
          {metric.comparison}
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description ? (
          <Text style={styles.sectionDescription}>{description}</Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) =>
            StyleSheet.flatten([
              styles.textButton,
              pressed && styles.textButtonPressed,
            ])
          }
        >
          <Text style={styles.textButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FunnelCard() {
  return (
    <View style={styles.sectionCard}>
      <SectionHeader
        title="選考ファネル"
        description="直近30日間の応募者ステータス"
      />
      <View style={styles.funnelBody}>
        {funnelData.map((item) => (
          <View key={item.label} style={styles.funnelRow}>
            <View style={styles.funnelLabels}>
              <Text style={styles.funnelLabel}>{item.label}</Text>
              <Text style={styles.funnelValue}>{item.value}名</Text>
            </View>
            <View style={styles.funnelTrack}>
              <View
                style={StyleSheet.flatten([
                  styles.funnelFill,
                  { width: `${item.percent}%` as `${number}%` },
                ])}
              />
            </View>
          </View>
        ))}
        <View style={styles.funnelFooter}>
          <Feather name="info" size={14} color={dashboardColors.blue} />
          <Text style={styles.funnelFooterText}>
            応募から面接への移行率は24%。前月より3ポイント改善しています。
          </Text>
        </View>
      </View>
    </View>
  );
}

function TasksCard({ onOpenAll }: { onOpenAll: () => void }) {
  return (
    <View style={styles.sectionCard}>
      <SectionHeader
        title="対応が必要なタスク"
        description="期限が近い採用業務"
        actionLabel="すべて見る"
        onAction={onOpenAll}
      />
      <View style={styles.taskList}>
        {dashboardTasks.map((task, index) => (
          <TaskRow
            key={task.id}
            task={task}
            last={index === dashboardTasks.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function TaskRow({ task, last }: { task: DashboardTask; last: boolean }) {
  const high = task.priority === 'high';
  return (
    <Pressable
      onPress={() => console.log('task', task.id)}
      style={StyleSheet.flatten([
        styles.taskRow,
        last && styles.taskRowLast,
      ])}
    >
      <View
        style={StyleSheet.flatten([
          styles.taskIcon,
          high && styles.taskIconHigh,
        ])}
      >
        <Feather
          name={task.icon}
          size={16}
          color={high ? dashboardColors.danger : dashboardColors.blue}
        />
      </View>
      <View style={styles.taskText}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.taskDescription} numberOfLines={1}>
          {task.description}
        </Text>
      </View>
      <Text
        style={StyleSheet.flatten([
          styles.taskDue,
          high && styles.taskDueHigh,
        ])}
      >
        {task.dueLabel}
      </Text>
      <Feather name="chevron-right" size={15} color={dashboardColors.softMuted} />
    </Pressable>
  );
}

function JobsCard({
  compact,
  onCreate,
  onOpenAll,
}: {
  compact: boolean;
  onCreate: () => void;
  onOpenAll: () => void;
}) {
  return (
    <View style={styles.sectionCard}>
      <SectionHeader
        title="公開中の求人"
        description="応募数と閲覧状況を求人ごとに確認できます"
        actionLabel="求人管理を開く"
        onAction={onOpenAll}
      />

      {compact ? (
        <View style={styles.jobMobileList}>
          {dashboardJobs.map((job) => (
            <JobMobileCard key={job.id} job={job} />
          ))}
          <Pressable onPress={onCreate} style={styles.textButton}>
            <Text style={styles.textButtonText}>＋ 新しい求人を作成</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.jobList}>
          <View style={styles.jobHeaderRow}>
            <View style={styles.jobMainColumn}>
              <Text style={styles.jobHeaderText}>求人</Text>
            </View>
            <View style={styles.jobStatusColumn}>
              <Text style={styles.jobHeaderText}>状態</Text>
            </View>
            <View style={styles.jobNumberColumn}>
              <Text style={styles.jobHeaderText}>応募</Text>
            </View>
            <View style={styles.jobNumberColumn}>
              <Text style={styles.jobHeaderText}>閲覧</Text>
            </View>
            <View style={styles.jobDeadlineColumn}>
              <Text style={styles.jobHeaderText}>掲載期限</Text>
            </View>
            <View style={styles.jobActionColumn} />
          </View>
          {dashboardJobs.map((job, index) => (
            <JobTableRow
              key={job.id}
              job={job}
              last={index === dashboardJobs.length - 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function JobTableRow({ job, last }: { job: DashboardJob; last: boolean }) {
  return (
    <View
      style={StyleSheet.flatten([styles.jobRow, last && styles.jobRowLast])}
    >
      <View style={styles.jobMainColumn}>
        <Text style={styles.jobTitle} numberOfLines={1}>
          {job.title}
        </Text>
        <View style={styles.jobMeta}>
          <Text style={styles.jobMetaText}>{job.employmentType}</Text>
          <Text style={styles.jobMetaText}>更新: {job.updatedAt}</Text>
        </View>
      </View>
      <View style={styles.jobStatusColumn}>
        <StatusBadge status={job.status} />
      </View>
      <View style={styles.jobNumberColumn}>
        <Text style={styles.jobNumber}>{job.applicants}</Text>
        <Text style={styles.jobNumberLabel}>名</Text>
      </View>
      <View style={styles.jobNumberColumn}>
        <Text style={styles.jobNumber}>{job.views}</Text>
        <Text style={styles.jobNumberLabel}>回</Text>
      </View>
      <View style={styles.jobDeadlineColumn}>
        <Text style={styles.jobDeadline}>{job.deadline}</Text>
      </View>
      <View style={styles.jobActionColumn}>
        <Pressable
          onPress={() => console.log('job menu', job.id)}
          style={styles.moreButton}
        >
          <Feather name="more-horizontal" size={17} color={dashboardColors.muted} />
        </Pressable>
      </View>
    </View>
  );
}

function JobMobileCard({ job }: { job: DashboardJob }) {
  return (
    <Pressable
      onPress={() => console.log('job', job.id)}
      style={styles.jobMobileCard}
    >
      <View style={styles.jobMobileTop}>
        <View style={styles.jobMobileTitleWrap}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.jobMeta}>
            <Text style={styles.jobMetaText}>{job.employmentType}</Text>
            <Text style={styles.jobMetaText}>更新: {job.updatedAt}</Text>
          </View>
        </View>
        <StatusBadge status={job.status} />
      </View>
      <View style={styles.jobMobileStats}>
        <View style={styles.jobMobileStat}>
          <Text style={styles.jobNumber}>{job.applicants}名</Text>
          <Text style={styles.jobNumberLabel}>応募者</Text>
        </View>
        <View style={styles.jobMobileStat}>
          <Text style={styles.jobNumber}>{job.views}回</Text>
          <Text style={styles.jobNumberLabel}>閲覧数</Text>
        </View>
        <View style={styles.jobMobileStat}>
          <Text style={styles.jobDeadline}>{job.deadline}</Text>
          <Text style={styles.jobNumberLabel}>掲載期限</Text>
        </View>
      </View>
    </Pressable>
  );
}

function StatusBadge({ status }: { status: DashboardJob['status'] }) {
  const isDraft = status === '下書き';
  const isClosed = status === '募集終了';
  return (
    <View
      style={StyleSheet.flatten([
        styles.statusBadge,
        isDraft && styles.statusBadgeDraft,
        isClosed && styles.statusBadgeClosed,
      ])}
    >
      <Text
        style={StyleSheet.flatten([
          styles.statusText,
          isDraft && styles.statusTextDraft,
          isClosed && styles.statusTextClosed,
        ])}
      >
        {status}
      </Text>
    </View>
  );
}

function ApplicantsCard({ onOpenAll }: { onOpenAll: () => void }) {
  return (
    <View style={styles.sectionCard}>
      <SectionHeader
        title="最近の応募者"
        description="新しい応募と選考状況"
        actionLabel="応募者管理"
        onAction={onOpenAll}
      />
      <View style={styles.applicantList}>
        {dashboardApplicants.map((applicant, index) => (
          <ApplicantRow
            key={applicant.id}
            applicant={applicant}
            last={index === dashboardApplicants.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function ApplicantRow({
  applicant,
  last,
}: {
  applicant: DashboardApplicant;
  last: boolean;
}) {
  return (
    <Pressable
      onPress={() => console.log('applicant', applicant.id)}
      style={StyleSheet.flatten([
        styles.applicantRow,
        last && styles.applicantRowLast,
      ])}
    >
      <LinearGradient
        colors={['#4a8fe0', '#14284d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.applicantAvatar}
      >
        <Text style={styles.applicantAvatarText}>{applicant.initials}</Text>
      </LinearGradient>
      <View style={styles.applicantText}>
        <Text style={styles.applicantName}>{applicant.name}</Text>
        <Text style={styles.applicantJob} numberOfLines={1}>
          {applicant.jobTitle}
        </Text>
      </View>
      <View style={styles.applicantRight}>
        <ApplicantStageBadge stage={applicant.stage} />
        <Text style={styles.applicantTime}>{applicant.appliedAt}</Text>
      </View>
    </Pressable>
  );
}

function ApplicantStageBadge({
  stage,
}: {
  stage: DashboardApplicant['stage'];
}) {
  const isNew = stage === '新着';
  const isInterview = stage === '面接予定';
  const isOffer = stage === '内定';
  return (
    <View
      style={StyleSheet.flatten([
        styles.stageBadge,
        isNew && styles.stageBadgeNew,
        isInterview && styles.stageBadgeInterview,
        isOffer && styles.stageBadgeOffer,
      ])}
    >
      <Text
        style={StyleSheet.flatten([
          styles.stageText,
          isNew && styles.stageTextNew,
          isInterview && styles.stageTextInterview,
          isOffer && styles.stageTextOffer,
        ])}
      >
        {stage}
      </Text>
    </View>
  );
}

function MessagesPreviewCard({ onOpen }: { onOpen: () => void }) {
  return (
    <View style={styles.sectionCard}>
      <SectionHeader
        title="メッセージ"
        description="未読メッセージが5件あります"
        actionLabel="受信箱を開く"
        onAction={onOpen}
      />
      <View style={styles.funnelBody}>
        <View style={styles.companyPanel}>
          <View style={styles.companyPanelTop}>
            <View style={styles.taskIcon}>
              <Feather name="message-circle" size={17} color={dashboardColors.blue} />
            </View>
            <View style={styles.companyPanelText}>
              <Text style={styles.companyName}>佐藤 美咲さん</Text>
              <Text style={styles.companyCode} numberOfLines={2}>
                面接候補日のご連絡ありがとうございます。第2候補で参加可能です。
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.companyPanel}>
          <View style={styles.companyPanelTop}>
            <View style={styles.taskIcon}>
              <Feather name="message-circle" size={17} color={dashboardColors.blue} />
            </View>
            <View style={styles.companyPanelText}>
              <Text style={styles.companyName}>田中 悠斗さん</Text>
              <Text style={styles.companyCode} numberOfLines={2}>
                ポートフォリオのURLを追加でお送りします。ご確認をお願いいたします。
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={onOpen}
          style={({ pressed }) =>
            StyleSheet.flatten([
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ])
          }
        >
          <LinearGradient
            colors={['#4a8fe0', '#14284d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButtonGradient}
          >
            <Feather name="message-square" size={15} color="#ffffff" />
            <Text style={styles.primaryButtonText}>メッセージを確認</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
