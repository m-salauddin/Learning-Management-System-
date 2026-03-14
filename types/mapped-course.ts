export interface Instructor {
    id?: string;
    name: string;
    title: string;
    avatar: string; // URL
    bio: string;
    expertise?: string[];
    social_links?: {
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        website?: string;
        github?: string;
    };
    total_courses?: number;
    total_students?: number;
    rating?: number;
    role?: 'main' | 'support';
}

export interface LessonItem {
    title: string;
    isFreePreview: boolean; // Add this
    duration: string; // Add formatted duration
    type?: string;
}

export interface CurriculumModule {
    title: string;
    duration: string;
    lessons: LessonItem[]; // Update to object
}

export interface MappedCourse {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription?: string;
    image: string;
    price: string;
    originalPrice?: string;
    duration: string;
    students: string;
    rating: number;
    reviews: number;
    instructor: Instructor;
    instructors?: Instructor[];
    tags: string[];
    level: string;
    language: string;
    lastUpdated: string;
    whatYouLearn: string[];
    requirements?: string[];
    targetAudience?: string[];
    curriculumOverview?: string;
    curriculum: CurriculumModule[];
    type: string;
    priceType: string;
    isEnrolled?: boolean;
    category?: string;
    discountPrice?: string;
    discountExpiresAt?: string;
    totalLessons?: number;
    batchNo?: number;
    previewVideoUrl?: string;
}

