import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';
import { companyAuthStyles as styles } from './company-styles';

type CompanyAuthScreenProps = {
  mode: 'sign-in' | 'sign-up';
  companyCode?: string;
};

type CompanyAuthForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof CompanyAuthForm, string>>;

export function CompanyAuthScreen({
  mode,
  companyCode,
}: CompanyAuthScreenProps) {
  const router = useRouter();
  const isSignUp = mode === 'sign-up';

  const [form, setForm] = useState<CompanyAuthForm>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateForm = (
    field: keyof CompanyAuthForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError('');
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const normalizedEmail = form.email.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!form.password) {
      nextErrors.password = 'パスワードを入力してください';
    } else if (form.password.length < 8) {
      nextErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (isSignUp) {
      if (!form.confirmPassword) {
        nextErrors.confirmPassword =
          '確認用パスワードを入力してください';
      } else if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword =
          '入力したパスワードが一致しません';
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !validate()) {
      return;
    }

    if (!companyCode) {
      setSubmitError('企業コードがURLに含まれていません');
      return;
    }

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    if (!apiUrl) {
      setSubmitError(
        '環境変数 EXPO_PUBLIC_API_URL が設定されていません',
      );
      return;
    }

    const endpoint = isSignUp
      ? '/api/company/auth/sign-up'
      : '/api/company/auth/sign-in';

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyCode,
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const responseBody = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const message =
          responseBody?.message ??
          responseBody?.error ??
          (isSignUp
            ? '企業アカウントの登録に失敗しました'
            : 'メールアドレスまたはパスワードが正しくありません');

        throw new Error(message);
      }

      if (isSignUp) {
        router.replace({
          pathname: '/company/[companyCode]/sign-in',
          params: {
            companyCode,
            registered: 'true',
          },
        });

        return;
      }

      router.replace({
        pathname: '/company/[companyCode]/dashboard',
        params: {
          companyCode,
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : '通信中にエラーが発生しました',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveToOtherMode = () => {
    if (!companyCode) {
      setSubmitError('企業コードがURLに含まれていません');
      return;
    }

    router.push({
      pathname: isSignUp
        ? '/company/[companyCode]/sign-in'
        : '/company/[companyCode]/sign-up',
      params: {
        companyCode,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.introduction}>
              <View style={styles.brandRow}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>G</Text>
                </View>

                <View>
                  <Text style={styles.brandName}>GLOBALWORKERS</Text>
                  <Text style={styles.brandSub}>
                    FOR BUSINESS
                  </Text>
                </View>
              </View>

              <View style={styles.eyebrow}>
                <View style={styles.eyebrowDot} />
                <Text style={styles.eyebrowText}>
                  企業管理アカウント
                </Text>
              </View>

              <Text style={styles.introductionTitle}>
                採用活動を、もっとシンプルに。
              </Text>

              <Text style={styles.introductionDescription}>
                求人の掲載から応募者管理、候補者との連絡まで、
                ひとつの画面で効率よく管理できます。
              </Text>

              <View style={styles.featureList}>
                <FeatureItem text="求人情報の作成・公開管理" />
                <FeatureItem text="応募者と選考状況の一元管理" />
                <FeatureItem text="候補者とのメッセージ管理" />
              </View>

              {companyCode ? (
                <View style={styles.companyCodeBox}>
                  <Text style={styles.companyCodeLabel}>
                    企業識別番号
                  </Text>
                  <Text style={styles.companyCode}>
                    {companyCode}
                  </Text>
                </View>
              ) : (
                <View style={styles.companyCodeError}>
                  <Text style={styles.companyCodeErrorText}>
                    企業識別番号がURLに含まれていません
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>
                  {isSignUp
                    ? '企業アカウントを作成'
                    : '企業アカウントでサインイン'}
                </Text>

                <Text style={styles.formDescription}>
                  {isSignUp
                    ? '採用担当者として使用するメールアドレスを登録してください。'
                    : '登録済みの業務用メールアドレスでサインインしてください。'}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  業務用メールアドレス
                </Text>

                <TextInput
                  value={form.email}
                  onChangeText={(value) =>
                    updateForm('email', value)
                  }
                  placeholder="recruit@example.co.jp"
                  placeholderTextColor="#98A5B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  style={[
                    styles.input,
                    errors.email && styles.inputError,
                  ]}
                />

                {errors.email ? (
                  <Text style={styles.errorText}>
                    {errors.email}
                  </Text>
                ) : null}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>パスワード</Text>

                <View
                  style={[
                    styles.passwordContainer,
                    errors.password &&
                    styles.passwordContainerError,
                  ]}
                >
                  <TextInput
                    value={form.password}
                    onChangeText={(value) =>
                      updateForm('password', value)
                    }
                    placeholder="8文字以上で入力"
                    placeholderTextColor="#98A5B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSubmitting}
                    style={styles.passwordInput}
                  />

                  <Pressable
                    onPress={() =>
                      setShowPassword((current) => !current)
                    }
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword
                        ? 'パスワードを非表示にする'
                        : 'パスワードを表示する'
                    }
                  >
                    <Text style={styles.passwordToggle}>
                      {showPassword ? '隠す' : '表示'}
                    </Text>
                  </Pressable>
                </View>

                {errors.password ? (
                  <Text style={styles.errorText}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              {isSignUp ? (
                <View style={styles.field}>
                  <Text style={styles.label}>
                    パスワード確認
                  </Text>

                  <TextInput
                    value={form.confirmPassword}
                    onChangeText={(value) =>
                      updateForm('confirmPassword', value)
                    }
                    placeholder="もう一度入力してください"
                    placeholderTextColor="#98A5B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSubmitting}
                    style={[
                      styles.input,
                      errors.confirmPassword &&
                      styles.inputError,
                    ]}
                  />

                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              {submitError ? (
                <View style={styles.submitErrorBox}>
                  <Text style={styles.submitErrorText}>
                    {submitError}
                  </Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting || !companyCode}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed &&
                  !isSubmitting &&
                  companyCode &&
                  styles.submitButtonPressed,
                  (isSubmitting || !companyCode) &&
                  styles.submitButtonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isSignUp
                      ? '企業アカウントを作成'
                      : 'サインイン'}
                  </Text>
                )}
              </Pressable>

              {!isSignUp ? (
                <Pressable
                  onPress={() => {
                    // パスワード再設定画面を実装したら遷移処理を追加
                  }}
                  style={styles.forgotPasswordButton}
                >
                  <Text style={styles.forgotPasswordText}>
                    パスワードを忘れた方
                  </Text>
                </Pressable>
              ) : (
                <Text style={styles.termsText}>
                  アカウントを作成することで、企業向け利用規約と
                  プライバシーポリシーに同意したものとみなされます。
                </Text>
              )}

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>または</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.switchMode}>
                <Text style={styles.switchModeText}>
                  {isSignUp
                    ? 'すでに企業アカウントをお持ちですか？'
                    : '企業アカウントをお持ちでないですか？'}
                </Text>

                <Pressable
                  onPress={moveToOtherMode}
                  disabled={!companyCode}
                >
                  <Text style={styles.switchModeLink}>
                    {isSignUp
                      ? 'サインインする'
                      : '企業アカウントを作成'}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => router.replace('/sign-in')}
                style={styles.personalAccountButton}
              >
                <Text style={styles.personalAccountText}>
                  個人ユーザーのサインインはこちら
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FeatureItemProps = {
  text: string;
};

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureIconText}>✓</Text>
      </View>

      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}
