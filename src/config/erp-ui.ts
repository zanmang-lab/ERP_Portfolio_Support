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

export type WorkflowStepIconKey = "keyboard" | "monitorSuccess";

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
  { id: "support-all", label: "[지원] 전체지원사업" },
  { id: "support-current", label: "[지원] 진행 중인 사업" },
  { id: "support-docs", label: "[지원] 서류관리" },
  { id: "support-aftercare", label: "[지원] 사후관리" },
];
