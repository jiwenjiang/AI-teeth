export enum MediaType {
  PICTURE = 1,
  VIDEO,
  AUDIO
}

export enum GenderType {
  MALE = 1,
  FEMALE
}

export enum ScaleTableCode {
  BRAIN = 9,
  GMS,
  BRAIN_GMS,
  LEIBO_BRAIN,
  LEIBO_GMS
}

export enum OrderStatus {
  UNPAID = 1,
  PAID,
  USED,
  CANCELLED
}

export const tabPages = ["/pages/index/index", "pages/mine/index"];
