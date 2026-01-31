export interface Instructor {
    name: string;
    title: string;
    avatar: string; // URL
    bio: string;
}

export interface LessonItem {
    title: string;
    isFreePreview: boolean; // Add this
    duration: string; // Add formatted duration
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
    duration: string;
    students: string;
    rating: number;
    reviews: number;
    instructor: Instructor;
    tags: string[];
    level: string;
    language: string;
    lastUpdated: string;
    whatYouLearn: string[];
    curriculum: CurriculumModule[];
    type: string;
    priceType: string;
    isEnrolled?: boolean;
    category?: string;
    discountPrice?: string;
    discountExpiresAt?: string;
    totalLessons?: number;
    batchNo?: number;
}
