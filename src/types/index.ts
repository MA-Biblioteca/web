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
  content: string
  contributionId: number
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    name: string
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
  resourceType: string
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
}
