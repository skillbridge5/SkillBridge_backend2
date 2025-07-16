export interface CourseLesson {
  title: string;
  duration?: string;
}

export interface CourseModule {
  title: string;
  duration: string;
  lessons?: CourseLesson[];
}

export interface CreateCourseWithDetailsRequest {
  // Basic course data
  title: string;
  shortDescription: string;
  detailedDescription: string;
  imageUrl?: string;
  priceOriginal: number;
  priceDiscounted: number;
  status?: 'DRAFT' | 'PUBLISHED';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  duration: string;
  categoryId: string;
  instructorId: string;
  
  // Additional course metadata (optional)
  slug?: string;
  rating?: number;
  reviews?: number;
  students?: number;
  enrollmentYear?: number;
  
  // Nested data
  learningOutcomes?: string[];
  prerequisites?: string[];
  curriculum?: CourseModule[];
}

export interface UpdateCourseWithDetailsRequest extends CreateCourseWithDetailsRequest {
  // Same as create, but for updates
}

export interface CourseResponse {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  imageUrl?: string;
  priceOriginal: number;
  priceDiscounted: number;
  status: 'DRAFT' | 'PUBLISHED';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  duration: string;
  categoryId: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  category: {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
  };
  instructor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      order: number;
    }>;
  }>;
  learningOutcomes: Array<{
    id: string;
    text: string;
  }>;
  prerequisites: Array<{
    id: string;
    text: string;
  }>;
} 