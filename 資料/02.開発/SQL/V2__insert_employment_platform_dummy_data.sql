-- 求人・雇用掲載管理サイト ダミーデータ作成SQL
-- V1__create_employment_platform_tables.sql 実行後に使用すること
-- 本番環境では実行しないこと

BEGIN;
SET search_path TO urabus_schema, public;

-- 登録ユーザー（1:一般、2:企業オーナー、3:企業社員、4:運営）
INSERT INTO m_user(user_id,user_type,email,status,email_verified_at,last_login_at) VALUES
 (1,'USER','general.user@example.test','ACTIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
 (2,'COMPANY','owner@example.test','ACTIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
 (3,'COMPANY','employee@example.test','ACTIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
 (4,'OPERATOR','operator@example.test','ACTIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Spring Security PasswordEncoderで生成したテスト用ハッシュへ置換して使用すること。
-- 平文パスワードはSQL内に保存しない。
INSERT INTO t_user_authentication(user_id,password_hash,password_changed_at) VALUES
 (1,'!DUMMY_PASSWORD_DISABLED',CURRENT_TIMESTAMP),
 (2,'!DUMMY_PASSWORD_DISABLED',CURRENT_TIMESTAMP),
 (3,'!DUMMY_PASSWORD_DISABLED',CURRENT_TIMESTAMP),
 (4,'!DUMMY_PASSWORD_DISABLED',CURRENT_TIMESTAMP);
INSERT INTO t_refresh_token(refresh_token_id,user_id,token_hash,device_name,expires_at) VALUES
 (1,1,'dummy-refresh-token-hash-not-usable','iPhone テスト端末',CURRENT_TIMESTAMP + INTERVAL '30 days');
INSERT INTO t_user_profile(user_id,display_name,family_name,given_name,birth_date,prefecture_code,city,profile_summary) VALUES
 (1,'山田 太郎','山田','太郎','1995-04-15','27','大阪市','Java・Spring Bootを中心に開発しています。');
INSERT INTO t_user_privacy_setting(user_id,searchable_by_company,accepts_scout,show_real_name,show_work_history) VALUES
 (1,TRUE,TRUE,FALSE,TRUE);

-- 経歴
INSERT INTO m_skill(skill_id,skill_name,category_name,display_order) VALUES
 (1,'Java','プログラミング言語',1),(2,'Spring Boot','フレームワーク',2),(3,'PostgreSQL','データベース',3);
INSERT INTO t_resume(resume_id,user_id,resume_name,summary,is_public) VALUES
 (1,1,'公開用職務経歴書','バックエンド開発経験5年',TRUE);
INSERT INTO t_resume_work_history(work_history_id,resume_id,company_name,position_name,started_on,ended_on,is_current,description,display_order) VALUES
 (1,1,'サンプルシステム株式会社','システムエンジニア','2021-04-01',NULL,TRUE,'業務システムの設計・開発',1);
INSERT INTO t_resume_education(education_id,resume_id,school_name,faculty_name,started_on,ended_on,status,display_order) VALUES
 (1,1,'サンプル情報大学','情報学部','2014-04-01','2018-03-31','GRADUATED',1);
INSERT INTO t_resume_skill(resume_skill_id,resume_id,skill_id,experience_years,proficiency_level,note) VALUES
 (1,1,1,5.0,4,'Java 17以降の開発経験'),(2,1,2,4.0,4,'REST API・JPA'),(3,1,3,4.0,3,'設計・チューニング');

-- 企業・所属・権限
INSERT INTO m_company(company_id,company_name,corporate_number,owner_user_id,description,website_url,prefecture_code,address,verification_status,status) VALUES
 (1,'グローバルワーカーズ株式会社','1234567890123',2,'多様な働き方を支援するサンプル企業','https://example.test','27','大阪府大阪市北区1-1-1','APPROVED','ACTIVE');
INSERT INTO t_company_membership(membership_id,company_id,user_id,membership_type,status,joined_at) VALUES
 (1,1,2,'OWNER','ACTIVE',CURRENT_TIMESTAMP),(2,1,3,'EMPLOYEE','ACTIVE',CURRENT_TIMESTAMP);
INSERT INTO m_company_permission(permission_id,permission_code,permission_name) VALUES
 (1,'COMPANY_OWNER','企業オーナー'),(2,'JOB_VIEW','求人閲覧'),(3,'JOB_CREATE','求人作成'),(4,'JOB_EDIT','求人編集'),
 (5,'JOB_DELETE','求人削除'),(6,'JOB_PUBLISH','求人公開・停止'),(7,'JOB_COMPARE','求人比較'),(8,'APPLICATION_VIEW','応募閲覧'),
 (9,'APPLICATION_DECIDE','雇用決定'),(10,'SCOUT_SEARCH_USER','スカウト候補検索'),(11,'SCOUT_CREATE','スカウト送信'),
 (12,'CHAT_JOB','求人チャット'),(13,'CHAT_SCOUT','スカウトチャット'),(14,'USER_REVIEW_CREATE','一般ユーザー評価'),
 (15,'COMPANY_MEMBER_MANAGE','社員管理'),(16,'COMPANY_ROLE_MANAGE','ロール管理');
INSERT INTO t_company_role(company_role_id,company_id,role_code,role_name,is_system_role) VALUES
 (1,1,'OWNER','オーナー',TRUE),(2,1,'RECRUITER','採用担当者',TRUE);
INSERT INTO t_company_role_permission(company_role_id,permission_id)
 SELECT 1,permission_id FROM m_company_permission;
INSERT INTO t_company_role_permission(company_role_id,permission_id) VALUES
 (2,2),(2,3),(2,4),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14);
INSERT INTO t_company_member_role(membership_id,company_role_id) VALUES (1,1),(2,2);

-- 求人
INSERT INTO m_job_feature(feature_id,feature_name,feature_group_name,display_order) VALUES
 (1,'週3日リモート','働き方',1),(2,'副業可','募集条件',2),(3,'年間休日120日以上','休日',3);
INSERT INTO t_job_posting(job_posting_id,company_id,created_by_membership_id,title,description,employment_type_code,salary_min,salary_max,salary_period,status,published_at,application_deadline) VALUES
 (1,1,2,'Spring Boot バックエンドエンジニア','求人・雇用管理サービスのAPI開発を担当します。','FULL_TIME',4000000,6500000,'YEARLY','PUBLISHED',CURRENT_TIMESTAMP - INTERVAL '7 days',CURRENT_TIMESTAMP + INTERVAL '30 days'),
 (2,1,2,'Webサービス開発支援（副業）','週2日から参加可能な開発案件です。','CONTRACT',3000,5000,'HOURLY','PUBLISHED',CURRENT_TIMESTAMP - INTERVAL '3 days',CURRENT_TIMESTAMP + INTERVAL '45 days');
INSERT INTO t_job_requirement(job_posting_id,required_experience,required_education,required_qualification,preferred_condition) VALUES
 (1,'Javaによる開発経験2年以上','不問','不問','Spring Boot・PostgreSQL経験者歓迎'),
 (2,'Web開発経験1年以上','不問','不問','夜間・土日対応可');
INSERT INTO t_job_work_location(job_work_location_id,job_posting_id,prefecture_code,city,address,remote_type,latitude,longitude,display_order) VALUES
 (1,1,'27','大阪市北区','大阪府大阪市北区1-1-1','HYBRID',34.702485,135.495951,1),
 (2,2,NULL,NULL,NULL,'FULL_REMOTE',NULL,NULL,1);
INSERT INTO t_job_feature(job_posting_id,feature_id) VALUES (1,1),(1,3),(2,1),(2,2);
INSERT INTO t_job_favorite(user_id,job_posting_id) VALUES (1,1);
INSERT INTO t_job_comparison(user_id,job_posting_id,display_order) VALUES (1,1,1),(1,2,2);

-- 応募・採用・スカウト
INSERT INTO t_job_application(application_id,job_posting_id,applicant_user_id,resume_id,motivation,status,applied_at,decided_by_membership_id) VALUES
 (1,1,1,1,'これまでの経験を活かしてサービス開発に貢献したいです。','HIRED',CURRENT_TIMESTAMP - INTERVAL '5 days',2);
INSERT INTO t_application_status_history(history_id,application_id,from_status,to_status,changed_by_user_id,reason,changed_at) VALUES
 (1,1,NULL,'APPLIED',1,'応募',CURRENT_TIMESTAMP - INTERVAL '5 days'),
 (2,1,'APPLIED','SCREENING',3,'書類選考開始',CURRENT_TIMESTAMP - INTERVAL '4 days'),
 (3,1,'SCREENING','HIRED',3,'採用決定',CURRENT_TIMESTAMP - INTERVAL '1 day');
INSERT INTO t_employment(employment_id,application_id,company_id,user_id,status,started_on) VALUES
 (1,1,1,1,'EMPLOYED',CURRENT_DATE);
INSERT INTO t_scout(scout_id,company_id,target_user_id,job_posting_id,sent_by_membership_id,subject,message,status,expires_at) VALUES
 (1,1,1,2,2,'副業案件のご案内','プロフィールを拝見し、ぜひ一度お話ししたいと思いました。','SENT',CURRENT_TIMESTAMP + INTERVAL '14 days');
INSERT INTO t_scout_status_history(history_id,scout_id,from_status,to_status,changed_by_user_id,reason) VALUES
 (1,1,'DRAFT','SENT',3,'候補者へ送信');

-- チャット
INSERT INTO t_chat_room(chat_room_id,room_type,application_id,scout_id,employment_id,status) VALUES
 (1,'APPLICATION',1,NULL,NULL,'OPEN'),(2,'SCOUT',NULL,1,NULL,'OPEN'),(3,'COMPANY_CONTACT',NULL,NULL,1,'OPEN');
INSERT INTO t_chat_participant(chat_room_id,user_id,joined_at) VALUES
 (1,1,CURRENT_TIMESTAMP),(1,3,CURRENT_TIMESTAMP),(2,1,CURRENT_TIMESTAMP),(2,3,CURRENT_TIMESTAMP),(3,1,CURRENT_TIMESTAMP),(3,2,CURRENT_TIMESTAMP),(3,3,CURRENT_TIMESTAMP);
INSERT INTO t_chat_message(message_id,chat_room_id,sender_user_id,message_type,body,sent_at) VALUES
 (1,1,1,'TEXT','応募いたしました。よろしくお願いいたします。',CURRENT_TIMESTAMP - INTERVAL '5 days'),
 (2,1,3,'TEXT','ご応募ありがとうございます。',CURRENT_TIMESTAMP - INTERVAL '4 days'),
 (3,2,3,'TEXT','スカウト内容についてご質問があればお知らせください。',CURRENT_TIMESTAMP - INTERVAL '1 day'),
 (4,3,2,'SYSTEM','雇用後の企業連絡ルームを作成しました。',CURRENT_TIMESTAMP);
UPDATE t_chat_participant SET last_read_message_id=2 WHERE chat_room_id=1;
INSERT INTO t_chat_attachment(attachment_id,message_id,storage_key,original_file_name,content_type,file_size) VALUES
 (1,1,'dummy/chat/1/resume.pdf','職務経歴書.pdf','application/pdf',12345);

-- 評価
INSERT INTO t_company_review(company_review_id,company_id,reviewer_user_id,employment_id,rating,title,comment,status) VALUES
 (1,1,1,1,5,'柔軟な働き方','説明が丁寧で安心して働けます。','VISIBLE');
INSERT INTO t_user_review(user_review_id,target_user_id,company_id,reviewer_membership_id,employment_id,rating,comment,status) VALUES
 (1,1,1,2,1,5,'連絡が早く、技術力も高い方です。','VISIBLE');
INSERT INTO t_review_report(report_id,reporter_user_id,review_type,company_review_id,user_review_id,reason_code,detail,status,handled_by_user_id) VALUES
 (1,2,'COMPANY',1,NULL,'OTHER','ダミー通報データ','RESOLVED',4);

-- 運営・監視・収益・監査
INSERT INTO m_operator_role(operator_role_id,role_code,role_name,description) VALUES
 (1,'SUPER_ADMIN','最高管理者','全運営機能'),(2,'MONITOR','監視担当','モニター・アラーム対応');
INSERT INTO t_operator_user_role(user_id,operator_role_id) VALUES (4,1),(4,2);
INSERT INTO t_monitor_metric(metric_id,metric_type,bucket_start,bucket_minutes,metric_value,dimension_data) VALUES
 (1,'ACCESS_COUNT',date_trunc('hour',CURRENT_TIMESTAMP),60,128,'{"channel":"web"}'),
 (2,'REVENUE',date_trunc('month',CURRENT_TIMESTAMP),43200,10000,'{"currency":"JPY"}');
INSERT INTO t_error_event(error_event_id,occurred_at,severity,service_name,error_code,summary,correlation_id,resolved_at) VALUES
 (1,CURRENT_TIMESTAMP - INTERVAL '30 minutes','CRITICAL','recruitment-api','DB_TIMEOUT','求人検索APIでDBタイムアウトが発生','11111111-1111-1111-1111-111111111111',CURRENT_TIMESTAMP - INTERVAL '20 minutes');
INSERT INTO t_alarm_rule(alarm_rule_id,rule_name,metric_type,comparison_operator,threshold_value,window_minutes,severity,enabled,created_by_user_id) VALUES
 (1,'重大エラー検知','ERROR_COUNT','GTE',1,5,'CRITICAL',TRUE,4);
INSERT INTO t_alarm_notification_target(target_id,alarm_rule_id,target_type,target_value,enabled) VALUES
 (1,1,'EMAIL','operator@example.test',TRUE);
INSERT INTO t_alarm_history(alarm_history_id,alarm_rule_id,error_event_id,status,measured_value,fired_at,acknowledged_by_user_id,acknowledged_at,resolved_at,note) VALUES
 (1,1,1,'RESOLVED',1,CURRENT_TIMESTAMP - INTERVAL '30 minutes',4,CURRENT_TIMESTAMP - INTERVAL '28 minutes',CURRENT_TIMESTAMP - INTERVAL '20 minutes','DB接続を確認し復旧');
INSERT INTO t_billing_transaction(billing_transaction_id,company_id,provider,provider_transaction_id,transaction_type,amount,currency,status,occurred_at) VALUES
 (1,1,'DUMMY_PAY','dummy_tx_0001','CHARGE',10000,'JPY','SUCCEEDED',CURRENT_TIMESTAMP);
INSERT INTO t_audit_log(audit_log_id,actor_user_id,action_code,target_type,target_id,before_data,after_data,ip_address,user_agent,correlation_id) VALUES
 (1,3,'APPLICATION_HIRED','JOB_APPLICATION','1','{"status":"SCREENING"}','{"status":"HIRED"}','127.0.0.1','Dummy Seed','22222222-2222-2222-2222-222222222222');
INSERT INTO t_outbox_event(outbox_event_id,aggregate_type,aggregate_id,event_type,payload,status,available_at,published_at) VALUES
 (1,'JOB_APPLICATION','1','APPLICATION_HIRED','{"applicationId":1,"userId":1,"companyId":1}','PUBLISHED',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- 明示ID投入後、全IDENTITYシーケンスを各テーブルの最大値へ同期
DO $seed_sequence_sync$
DECLARE
    target RECORD;
    max_id BIGINT;
BEGIN
    FOR target IN
        SELECT table_name, column_name
          FROM information_schema.columns
         WHERE table_schema = 'urabus_schema'
           AND is_identity = 'YES'
    LOOP
        EXECUTE format('SELECT max(%I) FROM urabus_schema.%I', target.column_name, target.table_name)
           INTO max_id;
        IF max_id IS NOT NULL THEN
            PERFORM setval(
                pg_get_serial_sequence(format('urabus_schema.%I', target.table_name), target.column_name),
                max_id,
                TRUE
            );
        END IF;
    END LOOP;
END
$seed_sequence_sync$;

COMMIT;
