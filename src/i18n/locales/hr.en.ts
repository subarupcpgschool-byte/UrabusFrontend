const messages = {
  hrLoginLinkNote: "Employee login URL (the initial password is not emailed)",
  hrEmployment: "Onboarding & employment",
  hrPersonalDocuments: "Documents & sharing",
  hrMailTemplates: "Email templates",
  hrSettings: "Departments & onboarding settings",
  hrDone: "Saved.",
  hrSearch: "Search name or job",
  hrPending: "Before joining",
  hrJoined: "Joined",
  hrCancelled: "Registration cancelled",
  hrNoCandidates: "No matching users.",
  hrUnregistered: "Not registered",
  hrSelectCandidate: "Select a person from the list.",
  hrJoinDate: "Joining date",
  hrDepartment: "Department",
  hrNone: "None",
  hrPosition: "Position",
  hrDefaultPosition: "Staff member (default)",
  hrRole: "Role & permissions",
  hrDefaultRole: "Default role on joining",
  hrRoleTiming:
    "The selected role is applied when joining is confirmed on or after the joining date.",
  hrEmployeeAccount: "Employee account to link",
  hrCreateEmployee: "Create an employee account",
  hrSeparateEmail:
    "Use a different, unused email address for the employee account. The personal account is retained.",
  hrEmployeeEmail: "Employee login email",
  hrPassword: "Initial password (8+ characters)",
  hrSave: "Save",
  hrRegister: "Register joining plan",
  hrRegisterConfirm:
    "Register the joining plan and employee account link for {{name}}?",
  hrConfirmJoin: "Confirm joining",
  hrJoinConfirm:
    "Confirm that {{name}} has joined and apply the selected permissions?",
  hrCancelRegistration: "Cancel registration",
  hrCancelConfirm:
    "Cancel the joining plan? The employee account will not be deleted automatically.",
  hrDocuments: "Documents & contracts",
  hrResume: "Resume (required)",
  hrCareer: "Career history (optional)",
  hrTax: "Withholding tax certificate",
  hrContract: "Contract",
  hrLatestDocumentNote:
    "The latest shared documents are received and saved at registration. Multiple contracts can be added.",
  hrLatestCareer: "Latest career history",
  hrResumeRequired:
    "The latest resume must be shared. Ask the applicant to share it with this interaction from Documents & sharing.",
  hrDownload: "Download",
  hrDelete: "Delete",
  hrDeleteConfirm: "Delete this item?",
  hrAddContract: "Add contract (PDF)",
  hrPdfLimit: "PDF files, up to 10 MB each.",
  hrDownloadFailed:
    "Unable to download. Check the sharing status and permissions.",
  hrDefaultRoleNote:
    "The initial role has no permissions. Choose a role configured in the role list. OWNER cannot be selected.",
  hrDepartments: "Departments",
  hrDepartmentNote:
    "Create and edit departments. Departments with assigned employees cannot be deleted.",
  hrEdit: "Edit",
  hrEditDepartment: "Edit department name",
  hrAddDepartment: "Add department name",
  hrAll: "All",
  hrEnabled: "Enabled",
  hrDisabled: "Disabled",
  hrCreate: "Create +",
  hrNoTemplates:
    "When no template matches, a built-in template for the result is used.",
  hrTemplateName: "Template name",
  hrResult: "Result to notify",
  hrTargetJob: "Specific job",
  hrNoJobScope: "No specific job",
  hrRecruitmentKind: "Recruitment category",
  hrEmploymentType: "Employment type",
  hrJob: "Job recruitment",
  hrCompanyRecruitment: "Company recruitment",
  hrSubject: "Subject",
  hrBody: "Body",
  hrTemplatePriority:
    "Priority: specific job > category and employment type > employment type > category > all > built-in. One enabled template per result and scope.",
  hrTemplateFormat:
    "Insert the available variables into the subject or body. Messages use plain text. Preview does not send email.",
  hrPreview: "Live preview",
  hrPreviewApplicant: "Applicant for preview",
  hrSample: "Sample data",
  hrForwardNote:
    "Confirming a result notifies the applicant and sends the same body to the company owner with a forwarded subject prefix.",
  hrMailHistory: "Result emails & delivery history",
  hrNoMail: "No delivery history for this interaction.",
  hrToApplicant: "To applicant",
  hrToCompany: "To company owner",
  hrMailPENDING: "Queued",
  hrMailPROCESSING: "Sending",
  hrMailSENT: "Sent",
  hrMailFAILED: "Failed",
  hrMailUNCERTAIN: "Delivery status uncertain",
  hrRetry: "Resend",
  hrRetryNote:
    "Check whether the message was received. Resending may create duplicates if it was already delivered. Resend?",
  hrGeneralOnly: "This document area is for personal accounts.",
  hrDocumentKind: "Document type",
  hrTaxYear: "Tax year",
  hrUploadPdf: "Upload PDF",
  hrShareNote:
    "Uploading alone does not share a document. Grant access separately for each document and interaction.",
  hrShareCompanies: "Companies & interactions to share with",
  hrLatestShareNote:
    "New document versions require their own sharing permission. Previous grants do not carry over.",
  hrRetentionNote:
    "Revoking access stops live access. Copies already received during onboarding remain in the company’s records.",
  hrSelectDocument: "Select a document to manage sharing.",
  hrGrant: "Share with this interaction",
  hrRevoke: "Revoke access",
  hrGrantConfirm:
    "Share this document with authorized staff for this company and interaction?",
  hrRevokeConfirm:
    "Revoke sharing with this interaction? Previously received copies will remain.",
  hrNoShareTargets:
    "No active or accepted interactions are available for sharing.",
  hrDeleteDocumentNote:
    "Delete this document and revoke sharing? Copies already received by a company will remain.",
  hrResultMailNotice:
    "A notification email is queued when an offer, rejection, withdrawal or revocation is confirmed.",
  hrSharedDocuments: "Latest documents shared by applicant",
  hrNoSharedDocuments:
    "No latest documents have been shared. Ask the applicant to grant access.",
} as const;
export default messages;
