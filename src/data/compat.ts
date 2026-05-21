import type { Hub, Motor, CompatStatus, HubCompatResult } from './types'

export function getCompatStatus(hub: Hub, motor: Motor): CompatStatus {
  if (hub.maxTorqueNm === null || motor.maxTorqueNm === null) return 'unknown'
  if (hub.maxTorqueNm >= motor.maxTorqueNm) return 'ok'
  if (hub.maxTorqueNm >= motor.maxTorqueNm * 0.85) return 'marginal'
  return 'incompatible'
}

export function rankHubsForMotor(hubs: Hub[], motor: Motor): HubCompatResult[] {
  return hubs.map(hub => {
    const status = getCompatStatus(hub, motor)
    const headroomNm =
      hub.maxTorqueNm !== null && motor.maxTorqueNm !== null
        ? hub.maxTorqueNm - motor.maxTorqueNm
        : null
    const headroomPct =
      hub.maxTorqueNm !== null && motor.maxTorqueNm !== null
        ? Math.round((hub.maxTorqueNm / motor.maxTorqueNm) * 100)
        : null
    return { ...hub, status, headroomNm, headroomPct }
  }).sort((a, b) => {
    const order: Record<CompatStatus, number> = { ok: 0, marginal: 1, incompatible: 2, unknown: 3 }
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
    if (a.headroomNm !== null && b.headroomNm !== null) return b.headroomNm - a.headroomNm
    return 0
  })
}

export const STATUS_LABELS: Record<CompatStatus, string> = {
  ok: 'Compatible',
  marginal: 'Marginal',
  incompatible: 'Incompatible',
  unknown: 'Unknown',
}

export const STATUS_DESCRIPTIONS: (hub: Hub, motor: Motor, status: CompatStatus) => string = (hub, motor, status) => {
  switch (status) {
    case 'ok':
      return `Hub rated ${hub.torqueDisplay} handles the motor's max torque of ${motor.torqueDisplay}.`
    case 'marginal':
      return `Hub rated ${hub.torqueDisplay} is slightly under the motor's max torque of ${motor.torqueDisplay}. Verify with the manufacturer.`
    case 'incompatible':
      return `Hub rated ${hub.torqueDisplay} is significantly under the motor's max torque of ${motor.torqueDisplay}.`
    case 'unknown':
      return 'One or more torque ratings are not available. Verify compatibility with the manufacturer.'
  }
}
