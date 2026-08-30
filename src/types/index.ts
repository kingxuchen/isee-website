/** Content types for the WorkBuddy clone. */

export interface CapabilityTab {
  id: "research" | "docs" | "design" | "dev";
  /** Tab pill label, e.g. 研究 */
  label: string;
  /** Scenario title, e.g. 深度调研 */
  title: string;
  /** Scenario subtitle, e.g. 从查资料到给结论，15 分钟交付报告 */
  subtitle: string;
  description: string;
  video: string;
  poster: string;
}

export interface PricingPlan {
  id: "free" | "pro" | "team";
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  /** Strikethrough original price (monthly mode), e.g. "20" */
  monthlyOriginal?: string;
  yearlyOriginal?: string;
  unit: string;
  cta: string;
  highlighted?: boolean;
  enterpriseNote?: string;
  features: string[];
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface EcoApp {
  name: string;
  icon: string;
}
