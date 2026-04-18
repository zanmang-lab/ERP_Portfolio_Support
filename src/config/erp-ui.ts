/** Lucide icon keys resolved in `erp-icons.tsx` */
export type GnbIconKey =
  | "star"
  | "users"
  | "wallet"
  | "briefcase"
  | "shoppingCart"
  | "factory"
  | "truck"
  | "calculator"
  | "settings"
  | "monitor"
  | "handshake"
  | "chevronDown";

export type WorkflowStepIconKey =
  | "keyboard"
  | "monitorSuccess"
  /** 사업관리 플로우 등 */
  | "send"
  | "activity"
  | "checkCircle"
  | "clock";

export type WorkflowStepVariant = "default" | "success" | "muted";

export interface GnbToolItem {
  id: string;
  iconKey: GnbIconKey;
  ariaLabel: string;
}

export interface GnbModuleItem {
  id: string;
  label: string;
  iconKey: GnbIconKey;
}

export interface SetupLnbItem {
  id: string;
  label: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  iconKey: WorkflowStepIconKey;
  variant: WorkflowStepVariant;
}

export interface WorkflowRow {
  id: string;
  categoryLabel: string;
  steps: WorkflowStep[];
  /** 이 step id 뒤에 흐름 화살표(→) 표시 (다음 스텝 앞) */
  arrowAfterStepIds?: string[];
}

export const SETUP_GNB_ID = "setup";

export const SUPPORT_GNB_ID = "support";

/** LNB item that shows the Step 1 organization workflow dashboard */
export const WORKFLOW_STEP1_ORG_ID = "step1-org";

/** 지원 LNB: 전체지원공고 워크플로 대시보드 */
export const SUPPORT_ALL_MENU_ID = "support-all";

/** 전체지원공고 플로우: 공공지원사업 카드 → 공고 목록 화면 */
export const TOTAL_SUPPORT_PUBLIC_STEP_ID = "ts-public";

/** 지원 LNB: 사업관리 프로세스 대시보드 (LNB id와 동일) */
export const SUPPORT_CURRENT_MENU_ID = "support-current";

export const supportCurrentPageTitle = "[지원] 사업관리";

/** 사업관리 단계 id */
export const BUSINESS_STEP_APPLICATION_ID = "bm-apply";
export const BUSINESS_STEP_PENDING_ID = "bm-pending";
export const BUSINESS_STEP_IN_PROGRESS_ID = "bm-progress";
export const BUSINESS_STEP_COMPLETED_ID = "bm-done";

/** 상단 실선 흐름: 신청 → 진행 → 완료 */
export const businessManagementMainLineSteps: WorkflowStep[] = [
  {
    id: BUSINESS_STEP_APPLICATION_ID,
    label: "사업 신청",
    iconKey: "send",
    variant: "default",
  },
  {
    id: BUSINESS_STEP_IN_PROGRESS_ID,
    label: "사업 진행 중",
    iconKey: "activity",
    variant: "default",
  },
  {
    id: BUSINESS_STEP_COMPLETED_ID,
    label: "사업 완료",
    iconKey: "checkCircle",
    variant: "default",
  },
];

/** 분기: 대기중 사업 (점선 흐름) */
export const businessManagementPendingStep: WorkflowStep = {
  id: BUSINESS_STEP_PENDING_ID,
  label: "대기중 사업",
  iconKey: "clock",
  variant: "default",
};

/** 지원 LNB: 서류관리 프로세스 (LNB id와 동일) */
export const SUPPORT_DOCS_MENU_ID = "support-docs";

export const documentsPageTitle = "[지원] 서류관리";

export const DOC_STEP_VALID_YES_ID = "doc-valid-yes";
export const DOC_STEP_VALID_NO_ID = "doc-valid-no";
export const DOC_STEP_RENEW_PER_PROJECT_ID = "doc-renew-per-project";

/** 서류관리: 유효기간 O → X → 매사업 갱신 */
export const documentManagementSteps: WorkflowStep[] = [
  {
    id: DOC_STEP_VALID_YES_ID,
    label: "유효기간 O 서류",
    iconKey: "keyboard",
    variant: "default",
  },
  {
    id: DOC_STEP_VALID_NO_ID,
    label: "유효기간 X 서류",
    iconKey: "keyboard",
    variant: "default",
  },
  {
    id: DOC_STEP_RENEW_PER_PROJECT_ID,
    label: "매사업 갱신 서류",
    iconKey: "keyboard",
    variant: "default",
  },
];

/** 좌측 보조 패널: 구축(STEP 목록) vs 지원 vs 일반 모듈 서브메뉴 */
export type ErpLnbKind = "setup" | "module" | "support" | null;

export const gnbToolItems: GnbToolItem[] = [
  { id: "favorites", iconKey: "star", ariaLabel: "즐겨찾기" },
];

export const gnbModuleItems: GnbModuleItem[] = [
  { id: "hr", label: "인사/급여", iconKey: "users" },
  { id: "accounting", label: "회계", iconKey: "wallet" },
  { id: "sales", label: "영업/수출", iconKey: "briefcase" },
  { id: "purchase", label: "구매/수입", iconKey: "shoppingCart" },
  { id: "production", label: "생산/외주", iconKey: "factory" },
  { id: "logistics", label: "물류", iconKey: "truck" },
  { id: "cost", label: "원가", iconKey: "calculator" },
  { id: "operations", label: "운영기본", iconKey: "settings" },
  { id: SETUP_GNB_ID, label: "구축", iconKey: "monitor" },
  { id: SUPPORT_GNB_ID, label: "지원", iconKey: "handshake" },
];

export const setupLnbItems: SetupLnbItem[] = [
  { id: WORKFLOW_STEP1_ORG_ID, label: "STEP1 조직초기설정" },
  { id: "step1-partners", label: "STEP1 거래처_품목_물류 초기설정" },
  { id: "step2-accounting", label: "STEP2 업무별기초정보(회계)" },
  { id: "step2-sales", label: "STEP2 영업/수출 초기설정" },
  { id: "step2-production", label: "STEP2 생산/품질 초기설정" },
  { id: "step2-purchase", label: "STEP2 구매/수입 초기설정" },
  { id: "step2-base-cost", label: "STEP2 업무별기초정보(기본원가)" },
  { id: "step2-total-cost", label: "STEP2 총원가 초기설정" },
  { id: "step2-logistics", label: "STEP2 업무별기초정보(물류)" },
];

export const organizationSetupWorkflow: WorkflowRow[] = [
  {
    id: "company",
    categoryLabel: "회사정보",
    arrowAfterStepIds: ["biz-info"],
    steps: [
      { id: "co-basic", label: "회사기본정보", iconKey: "keyboard", variant: "default" },
      { id: "biz-info", label: "사업자정보", iconKey: "keyboard", variant: "default" },
      {
        id: "biz-lookup",
        label: "사업자등록조회",
        iconKey: "monitorSuccess",
        variant: "success",
      },
      {
        id: "acct-unit",
        label: "회계단위 및\n전표관리단위",
        iconKey: "keyboard",
        variant: "default",
      },
      {
        id: "env-consultant",
        label: "환경설정\n(컨설턴트)",
        iconKey: "keyboard",
        variant: "default",
      },
      { id: "codes", label: "코드관리", iconKey: "keyboard", variant: "default" },
    ],
  },
  {
    id: "organization",
    categoryLabel: "조직정보",
    arrowAfterStepIds: ["dept"],
    steps: [
      { id: "biz-unit", label: "사업단위", iconKey: "keyboard", variant: "default" },
      { id: "dept", label: "부서", iconKey: "keyboard", variant: "default" },
      { id: "org", label: "조직", iconKey: "keyboard", variant: "default" },
      { id: "employee", label: "사원", iconKey: "keyboard", variant: "default" },
      {
        id: "bulk-appoint",
        label: "발령일괄등록",
        iconKey: "keyboard",
        variant: "default",
      },
      { id: "external", label: "외부직원", iconKey: "keyboard", variant: "default" },
    ],
  },
  {
    id: "users",
    categoryLabel: "사용자정보",
    arrowAfterStepIds: ["group-perm", "group-detail-perm"],
    steps: [
      { id: "user", label: "사용자", iconKey: "keyboard", variant: "default" },
      { id: "user-group", label: "사용자그룹", iconKey: "keyboard", variant: "default" },
      {
        id: "group-perm",
        label: "그룹별권한",
        iconKey: "keyboard",
        variant: "default",
      },
      {
        id: "group-detail-perm",
        label: "그룹별 상세권한",
        iconKey: "keyboard",
        variant: "muted",
      },
      {
        id: "user-exception",
        label: "사용자별 예외권한",
        iconKey: "keyboard",
        variant: "muted",
      },
    ],
  },
];

export const workflowPageTitle = "STEP1 조직초기설정";

export const setupLnbTitle = "구축";

export const supportLnbTitle = "지원";

export const supportLnbItems: SetupLnbItem[] = [
  { id: SUPPORT_ALL_MENU_ID, label: "[지원] 전체지원공고" },
  { id: SUPPORT_CURRENT_MENU_ID, label: "[지원] 사업관리" },
  { id: SUPPORT_DOCS_MENU_ID, label: "[지원] 서류관리" },
];

export const totalSupportPageTitle = "[지원] 전체지원공고";

export const totalSupportWorkflow: WorkflowRow[] = [
  {
    id: "total-support-classify",
    categoryLabel: "사업분류",
    arrowAfterStepIds: [],
    steps: [
      {
        id: TOTAL_SUPPORT_PUBLIC_STEP_ID,
        label: "공공지원사업",
        iconKey: "keyboard",
        variant: "default",
      },
      { id: "ts-private", label: "민간지원사업", iconKey: "keyboard", variant: "default" },
      { id: "ts-other", label: "기타지원사업", iconKey: "keyboard", variant: "default" },
    ],
  },
  {
    id: "total-support-search",
    categoryLabel: "상세검색",
    steps: [{ id: "ts-filter", label: "필터링", iconKey: "keyboard", variant: "default" }],
  },
  {
    id: "total-support-result",
    categoryLabel: "결과관리",
    steps: [
      {
        id: "total-support-watchlist",
        label: "관심목록",
        iconKey: "monitorSuccess",
        variant: "success",
      },
    ],
  },
];
