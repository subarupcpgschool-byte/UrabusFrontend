const messages = {
  hrLoginLinkNote: "従業員ログイン用URL（初期パスワードはメール送信しません）",
  hrEmployment: "入社・雇用管理",
  hrPersonalDocuments: "提出書類・共有設定",
  hrMailTemplates: "メールテンプレート",
  hrSettings: "所属・入社時の設定",
  hrDone: "保存しました。",
  hrSearch: "氏名・案件名で検索",
  hrPending: "入社前",
  hrJoined: "入社済み",
  hrCancelled: "登録取り消し",
  hrNoCandidates: "対象のユーザーはいません。",
  hrUnregistered: "未登録",
  hrSelectCandidate: "左の一覧から入社登録するユーザーを選択してください。",
  hrJoinDate: "入社日",
  hrDepartment: "配属先",
  hrNone: "なし",
  hrPosition: "役職",
  hrDefaultPosition: "一般社員（初期値）",
  hrRole: "役割・権限",
  hrDefaultRole: "入社時の初期役割",
  hrRoleTiming:
    "入社日以降に「入社を確定」を行うと、選択した役割を従業員アカウントへ反映します。",
  hrEmployeeAccount: "紐付ける従業員アカウント",
  hrCreateEmployee: "従業員アカウントを新規作成",
  hrSeparateEmail:
    "新規作成には、一般ユーザーとは別の未登録メールアドレスを使用してください。本人の一般アカウントは維持されます。",
  hrEmployeeEmail: "従業員ログイン用メールアドレス",
  hrPassword: "初期パスワード（8文字以上）",
  hrSave: "保存",
  hrRegister: "入社予定を登録",
  hrRegisterConfirm:
    "{{name}}さんの入社予定と従業員アカウントの紐付けを登録します。よろしいですか？",
  hrConfirmJoin: "入社を確定",
  hrJoinConfirm:
    "{{name}}さんの入社を確定し、設定した権限を反映します。よろしいですか？",
  hrCancelRegistration: "入社登録を取り消す",
  hrCancelConfirm:
    "入社予定の登録を取り消します。作成済みの従業員アカウントは自動削除されません。",
  hrDocuments: "必要書類・契約書",
  hrResume: "履歴書（必須）",
  hrCareer: "経歴書（任意）",
  hrTax: "源泉徴収票",
  hrContract: "契約書",
  hrLatestDocumentNote:
    "入社登録時点で共有されている最新版を受領して保存します。契約書は複数登録できます。",
  hrLatestCareer: "登録済みの最新経歴書",
  hrResumeRequired:
    "最新の履歴書の共有が必要です。本人の「提出書類・共有設定」から、この応募への共有を依頼してください。",
  hrDownload: "ダウンロード",
  hrDelete: "削除",
  hrDeleteConfirm: "削除します。よろしいですか？",
  hrAddContract: "契約書を追加（PDF）",
  hrPdfLimit: "PDF形式・1ファイル10MB以内です。",
  hrDownloadFailed:
    "書類を取得できませんでした。共有状態と権限を確認してください。",
  hrDefaultRoleNote:
    "初期値は権限なしの一般社員用役割です。「役割一覧」で権限を設定した役割を選択できます。OWNERは選択できません。",
  hrDepartments: "所属一覧",
  hrDepartmentNote:
    "配属先の所属を作成・編集できます。配属中の社員がいる所属は削除できません。",
  hrEdit: "編集",
  hrEditDepartment: "所属名を編集",
  hrAddDepartment: "所属名を追加",
  hrAll: "すべて",
  hrEnabled: "有効",
  hrDisabled: "無効",
  hrCreate: "作成＋",
  hrNoTemplates:
    "テンプレートがない場合は、結果別の固定テンプレートを使用します。",
  hrTemplateName: "テンプレート名",
  hrResult: "通知する結果",
  hrTargetJob: "求人案件の直接指定",
  hrNoJobScope: "求人の直接指定なし",
  hrRecruitmentKind: "募集区分",
  hrEmploymentType: "雇用形態",
  hrJob: "求人募集",
  hrCompanyRecruitment: "企業募集",
  hrSubject: "件名",
  hrBody: "本文",
  hrTemplatePriority:
    "適用順：求人案件指定 ＞ 募集区分・雇用形態 ＞ 雇用形態 ＞ 募集区分 ＞ すべて ＞ 固定テンプレート。同じ結果・条件の有効なテンプレートは1件です。",
  hrTemplateFormat:
    "利用可能な変数を本文・件名に挿入できます。本文はテキスト形式です。プレビューでは送信しません。",
  hrPreview: "リアルタイムプレビュー",
  hrPreviewApplicant: "プレビューに使う応募情報",
  hrSample: "サンプルデータ",
  hrForwardNote:
    "結果を確定すると応募者へ通知し、企業オーナーへ同じ本文を件名「[転送]」付きで送信します。",
  hrMailHistory: "結果通知メール・送信履歴",
  hrNoMail: "この応募の送信履歴はありません。",
  hrToApplicant: "応募者宛",
  hrToCompany: "企業オーナー宛",
  hrMailPENDING: "送信待ち",
  hrMailPROCESSING: "送信処理中",
  hrMailSENT: "送信済み",
  hrMailFAILED: "送信失敗",
  hrMailUNCERTAIN: "送信結果の確認が必要",
  hrRetry: "再送",
  hrRetryNote:
    "受信状況を確認してください。すでに届いている場合、再送で重複する可能性があります。再送しますか？",
  hrGeneralOnly: "一般ユーザー用の書類管理です。",
  hrDocumentKind: "書類の種類",
  hrTaxYear: "年分",
  hrUploadPdf: "PDFをアップロード",
  hrShareNote:
    "書類は登録だけでは企業へ公開されません。書類ごと・応募ごとに共有先を指定します。",
  hrShareCompanies: "共有する企業・応募",
  hrLatestShareNote:
    "新しい書類を登録した場合は、その書類にも共有許可が必要です。古い許可は新しい書類へ引き継ぎません。",
  hrRetentionNote:
    "共有解除後は最新版の閲覧を停止します。入社登録ですでに受領・保存された書類は、企業側の受領記録として残ります。",
  hrSelectDocument: "書類を選択すると共有先を設定できます。",
  hrGrant: "この応募へ共有する",
  hrRevoke: "共有を解除",
  hrGrantConfirm:
    "選択した書類を、この企業の権限を持つ担当者へ共有します。よろしいですか？",
  hrRevokeConfirm:
    "この応募への共有を解除します。受領済みのコピーは削除されません。",
  hrNoShareTargets: "共有可能な連絡中・内定中の応募はありません。",
  hrDeleteDocumentNote:
    "書類を削除し、共有を解除します。企業が受領済みのコピーは削除されません。",
  hrResultMailNotice:
    "内定・不採用・見送り・内定取り消し・内定辞退の結果変更時に、通知メールを送信予約します。",
  hrSharedDocuments: "本人が共有した最新書類",
  hrNoSharedDocuments:
    "共有された最新書類はありません。本人に共有を依頼してください。",
} as const;
export default messages;
