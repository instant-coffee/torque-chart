export interface Hub {
  id: string
  name: string
  brand: string
  maxTorqueNm: number | null
  torqueDisplay: string
}

export interface Motor {
  id: string
  name: string
  brand: string
  maxTorqueNm: number | null
  maxPowerW: number | null
  torqueDisplay: string
  powerDisplay: string
}

export type CompatStatus = 'ok' | 'marginal' | 'incompatible' | 'unknown'

export interface HubCompatResult extends Hub {
  status: CompatStatus
  headroomNm: number | null
  headroomPct: number | null
}
