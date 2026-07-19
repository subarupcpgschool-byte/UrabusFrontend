import { Feather } from '@expo/vector-icons';
import { Link, router, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authColors, authStyles as styles } from './styles';

type AuthMode = 'sign-in' | 'sign-up';

type Props = {
  mode: AuthMode;
};

type FormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type FormErrors = Partial<Record<keyof FormState | 'terms', string>>;

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export default function AuthScreen({ mode }: Props) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isSignUp = mode === 'sign-up';
  const horizontalPadding = Math.max(20, Math.min(width * 0.055, 72));

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copy = useMemo(
    () =>
      isSignUp
        ? {
            eyebrow: 'GLOBALWORKERS — 新規登録',
            title: '働く選択肢を、もっと自由に。',
            description:
              'アカウントを作成して、求人の保存・応募管理・企業とのメッセージを始めましょう。',
            submitLabel: '無料でアカウントを作成',
            switchLabel: 'すでにアカウントをお持ちですか？',
            switchAction: 'サインイン',
            switchHref: '/sign-in',
          }
        : {
            eyebrow: 'GLOBALWORKERS — サインイン',
            title: 'おかえりなさい。',
            description:
              '保存した求人や応募状況を確認し、あなたに合った仕事探しを続けましょう。',
            submitLabel: 'サインイン',
            switchLabel: 'アカウントをお持ちでないですか？',
            switchAction: '無料で登録',
            switchHref: '/sign-up',
          },
    [isSignUp],
  );

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (isSignUp && form.name.trim().length < 2) {
      nextErrors.name = 'お名前を2文字以上で入力してください。';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = '正しいメールアドレスを入力してください。';
    }

    if (form.password.length < 8) {
      nextErrors.password = 'パスワードは8文字以上で入力してください。';
    }

    if (isSignUp && form.password !== form.passwordConfirmation) {
      nextErrors.passwordConfirmation = 'パスワードが一致していません。';
    }

    if (isSignUp && !acceptedTerms) {
      nextErrors.terms = '利用規約とプライバシーポリシーへの同意が必要です。';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // TODO: Spring Bootなどの認証APIへ置き換えてください。
      console.log(isSignUp ? 'sign-up' : 'sign-in', {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        rememberMe,
      });

      router.replace('/jobs' as Href);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader horizontalPadding={horizontalPadding} />

          <View
            style={StyleSheet.flatten([
              styles.page,
              { paddingHorizontal: horizontalPadding },
              isDesktop && styles.pageDesktop,
            ])}
          >
            {isDesktop ? <BrandPanel mode={mode} /> : null}

            <View style={StyleSheet.flatten([styles.formColumn, isDesktop && styles.formColumnDesktop])}>
              <View style={styles.formCard}>
                <View style={styles.eyebrow}>
                  <View style={styles.eyebrowDot} />
                  <Text style={styles.eyebrowText}>{copy.eyebrow}</Text>
                </View>

                <Text style={StyleSheet.flatten([styles.title, !isDesktop && styles.titleMobile])}>
                  {copy.title}
                </Text>
                <Text style={styles.description}>{copy.description}</Text>

                <View style={styles.formFields}>
                  {isSignUp ? (
                    <AuthField
                      label="お名前"
                      icon="user"
                      value={form.name}
                      placeholder="山田 太郎"
                      error={errors.name}
                      autoComplete="name"
                      textContentType="name"
                      onChangeText={(value) => updateField('name', value)}
                    />
                  ) : null}

                  <AuthField
                    label="メールアドレス"
                    icon="mail"
                    value={form.email}
                    placeholder="name@example.com"
                    error={errors.email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    onChangeText={(value) => updateField('email', value)}
                  />

                  <AuthField
                    label="パスワード"
                    icon="lock"
                    value={form.password}
                    placeholder={isSignUp ? '8文字以上で入力' : 'パスワードを入力'}
                    error={errors.password}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    textContentType={isSignUp ? 'newPassword' : 'password'}
                    rightElement={
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                        hitSlop={10}
                        onPress={() => setShowPassword((current) => !current)}
                      >
                        <Feather
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={18}
                          color={authColors.muted}
                        />
                      </Pressable>
                    }
                    onChangeText={(value) => updateField('password', value)}
                  />

                  {isSignUp ? (
                    <AuthField
                      label="パスワード（確認）"
                      icon="shield"
                      value={form.passwordConfirmation}
                      placeholder="同じパスワードを再入力"
                      error={errors.passwordConfirmation}
                      secureTextEntry={!showPasswordConfirmation}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="new-password"
                      textContentType="newPassword"
                      rightElement={
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={
                            showPasswordConfirmation ? 'パスワードを隠す' : 'パスワードを表示'
                          }
                          hitSlop={10}
                          onPress={() =>
                            setShowPasswordConfirmation((current) => !current)
                          }
                        >
                          <Feather
                            name={showPasswordConfirmation ? 'eye-off' : 'eye'}
                            size={18}
                            color={authColors.muted}
                          />
                        </Pressable>
                      }
                      onChangeText={(value) => updateField('passwordConfirmation', value)}
                    />
                  ) : null}
                </View>

                {isSignUp ? (
                  <View style={styles.termsBlock}>
                    <CheckRow checked={acceptedTerms} onPress={() => setAcceptedTerms((value) => !value)}>
                      <Text style={styles.checkText}>
                        <Text style={styles.inlineLink}>利用規約</Text>と
                        <Text style={styles.inlineLink}>プライバシーポリシー</Text>に同意します
                      </Text>
                    </CheckRow>
                    {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}
                  </View>
                ) : (
                  <View style={styles.formOptions}>
                    <CheckRow checked={rememberMe} onPress={() => setRememberMe((value) => !value)}>
                      <Text style={styles.checkText}>ログイン状態を保持する</Text>
                    </CheckRow>

                    <Pressable
                      style={styles.textLinkButton}
                      onPress={() => console.log('forgot password')}
                    >
                      <Text style={styles.textLink}>パスワードを忘れた方</Text>
                    </Pressable>
                  </View>
                )}

                <Pressable
                  accessibilityRole="button"
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                  style={({ pressed }) =>
                    StyleSheet.flatten([
                      styles.submitButton,
                      pressed && styles.submitButtonPressed,
                      isSubmitting && styles.submitButtonDisabled,
                    ])
                  }
                >
                  <LinearGradient
                    colors={['#4a8fe0', '#14284d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submitGradient}
                  >
                    <Text style={styles.submitText}>
                      {isSubmitting ? '送信中…' : copy.submitLabel}
                    </Text>
                    <Feather name="arrow-right" size={18} color="#ffffff" />
                  </LinearGradient>
                </Pressable>

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>または</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  accessibilityRole="button"
                  style={({ pressed }) =>
                    StyleSheet.flatten([styles.googleButton, pressed && styles.secondaryPressed])
                  }
                  onPress={() => console.log('Google authentication')}
                >
                  <View style={styles.googleMark}>
                    <Text style={styles.googleMarkText}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Googleで続ける</Text>
                </Pressable>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{copy.switchLabel}</Text>
                  <Link href={copy.switchHref as Href} asChild>
                    <Pressable style={styles.switchButton}>
                      <Text style={styles.switchAction}>{copy.switchAction}</Text>
                    </Pressable>
                  </Link>
                </View>

                <View style={styles.accountTypeDivider} />

                <Link href={'/company/sign-in' as Href} asChild>
                  <Pressable style={styles.businessEntryButton}>
                    <View style={styles.businessEntryIcon}>
                      <Feather name="briefcase" size={16} color={authColors.blue} />
                    </View>
                    <View style={styles.businessEntryTextGroup}>
                      <Text style={styles.businessEntryTitle}>企業の採用担当者はこちら</Text>
                      <Text style={styles.businessEntryDescription}>企業サインイン・企業登録へ進む</Text>
                    </View>
                    <Feather name="chevron-right" size={17} color={authColors.muted} />
                  </Pressable>
                </Link>
              </View>

              <Text style={styles.securityNote}>
                <Feather name="lock" size={12} color={authColors.muted} />{' '}
                通信は暗号化され、安全に送信されます。
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AuthHeader({ horizontalPadding }: { horizontalPadding: number }) {
  return (
    <View style={styles.headerBorder}>
      <View style={[styles.headerInner, { paddingHorizontal: horizontalPadding }]}>
        <Link href={'/' as Href} asChild>
          <Pressable style={styles.logoLink}>
            <LinearGradient
              colors={['#6fc0f0', '#14284d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoMark}
            >
              <Feather name="globe" size={18} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.logoText}>GlobalWorkers</Text>
          </Pressable>
        </Link>

        <Link href={'/jobs' as Href} asChild>
          <Pressable style={styles.backToJobsButton}>
            <Feather name="search" size={15} color={authColors.blueDeep} />
            <Text style={styles.backToJobsText}>求人を探す</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function BrandPanel({ mode }: { mode: AuthMode }) {
  const isSignUp = mode === 'sign-up';

  return (
    <LinearGradient
      colors={['#f5f9fe', '#e7f1fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.brandPanel}
    >
      <View style={styles.brandGlowTop} />
      <View style={styles.brandGlowBottom} />

      <View style={styles.brandContent}>
        <View style={styles.brandIconShell}>
          <LinearGradient
            colors={['#6fc0f0', '#2f6fcb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.brandIcon}
          >
            <Feather name={isSignUp ? 'user-plus' : 'briefcase'} size={28} color="#ffffff" />
          </LinearGradient>
        </View>

        <Text style={styles.brandTitle}>
          {isSignUp ? '仕事探しを、ひとつの場所で。' : '次のキャリアへ、すぐ戻れます。'}
        </Text>
        <Text style={styles.brandDescription}>
          正社員・副業・アルバイト・ボランティアまで、あなたの生活に合う働き方を見つけられます。
        </Text>

        <View style={styles.benefitList}>
          <Benefit icon="bookmark" title="気になる求人を保存" text="あとで比較しやすく整理できます。" />
          <Benefit icon="message-circle" title="企業と直接メッセージ" text="応募後のやり取りを一元管理します。" />
          <Benefit icon="check-circle" title="応募状況を見える化" text="選考の進捗をすぐ確認できます。" />
        </View>
      </View>

      <View style={styles.miniCard}>
        <View style={styles.miniCardIcon}>
          <Feather name="shield" size={18} color={authColors.blue} />
        </View>
        <View style={styles.miniCardText}>
          <Text style={styles.miniCardTitle}>安心して使える求人サービス</Text>
          <Text style={styles.miniCardDescription}>企業情報と応募情報を安全に管理します。</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.benefitIcon}>
        <Feather name={icon} size={16} color={authColors.blue} />
      </View>
      <View style={styles.benefitTextGroup}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitText}>{text}</Text>
      </View>
    </View>
  );
}

function CheckRow({
  checked,
  onPress,
  children,
}: {
  checked: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={styles.checkRow}
    >
      <View style={StyleSheet.flatten([styles.checkbox, checked && styles.checkboxChecked])}>
        {checked ? <Feather name="check" size={14} color="#ffffff" /> : null}
      </View>
      {children}
    </Pressable>
  );
}

type AuthFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
  rightElement?: ReactNode;
};

function AuthField({ label, icon, error, rightElement, ...inputProps }: AuthFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={StyleSheet.flatten([
          styles.inputShell,
          focused && styles.inputShellFocused,
          Boolean(error) && styles.inputShellError,
        ])}
      >
        <Feather name={icon} size={18} color={focused ? authColors.blue : authColors.muted} />
        <TextInput
          {...inputProps}
          placeholderTextColor="#94a2b6"
          style={styles.input}
          onFocus={(event) => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
        />
        {rightElement}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
