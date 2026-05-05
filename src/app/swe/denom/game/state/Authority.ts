export type AuthorityConfig = {
  current: number
  cap: number
  incomeLastTurn: number
}

export interface AuthorityRules {
  baseIncome: number
  legitimacyIndicatorId: string
  unityIndicatorId: string
  schismIndicatorId: string
  integrityIndicatorId: string

  wLegitimacy: number
  wUnity: number
  wSchism: number
  wIntegrity: number
}