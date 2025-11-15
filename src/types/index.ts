export interface AppConfig {
  name: string
  version: string
}

export interface Career {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
  year: number
}

export interface CareerSubject {
  id: number
  career: Career
  subject: Subject
}

export interface ResourceFile {
  id: number
  originalName: string
  path: string
}

export interface Comment {
  id: number
  text: string
  contributionId: number
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    firstName?: string
    lastName?: string
    email: string
  }
}

export interface Rating {
  id: number
  value: number
  contributionId: number
  userId: number
  createdAt: string
  updatedAt: string
}

export interface Contribution {
  id: number
  title: string
  description: string
  year: number
  resourceType: {
    id: number
    name: string
  }
  views: number
  careerSubjectId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  careerSubject: CareerSubject
  files: ResourceFile[]
  comments?: Comment[]
  ratings?: Rating[]
  averageRating?: number
  totalRatings?: number
  userRating?: number
  userId?: number // Agregado: id del propietario (deberá devolverlo el backend)
}

export interface UpdateUser {
  firstName?: string
  lastName?: string
  identificationNumber?: string
  street_number?: string
  address?: string
  route?: string
  locality?: string
  administrative_area_level_2?: string
  administrative_area_level_1?: string
  phone?: string
  roleId?: string
  secondaryPhone?: string
}

export interface CreateUser {
  email: string
  password: string
}
