
import { createClient } from "@supabase/supabase-js";

// Bun automatically loads .env files


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const dummyCourses = [
    {
        title: "Advanced React Patterns",
        slug: "advanced-react-patterns",
        description: "Master advanced React design patterns and performance optimization techniques.",
        price: 3500,
        level: "advanced",
        status: "published",
        total_students: 120,
        rating: 4.8,
        thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
        published: true,
    },
    {
        title: "Next.js 14 Full Stack Masterclass",
        slug: "nextjs-14-masterclass",
        description: "Build production-ready full stack applications with Next.js 14 App Router.",
        price: 4500,
        level: "intermediate",
        status: "published",
        total_students: 85,
        rating: 4.9,
        thumbnail_url: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60",
        published: true,
    },
    {
        title: "Python for Data Science",
        slug: "python-data-science",
        description: "Learn Python from scratch and apply it to real-world data science problems.",
        price: 2500,
        level: "beginner",
        status: "draft",
        total_students: 0,
        rating: 0,
        thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
        published: false,
    },
    {
        title: "UI/UX Design Fundamentals",
        slug: "ui-ux-fundamentals",
        description: "A comprehensive guide to designing beautiful and functional user interfaces.",
        price: 3000,
        level: "beginner",
        status: "published",
        total_students: 230,
        rating: 4.7,
        thumbnail_url: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=800&auto=format&fit=crop&q=60",
        published: true,
    },
    {
        title: "Docker & Kubernetes Mastery",
        slug: "docker-kubernetes",
        description: "Deploy and manage containerized applications with confidence.",
        price: 5000,
        level: "advanced",
        status: "published",
        total_students: 45,
        rating: 4.6,
        thumbnail_url: "https://images.unsplash.com/photo-1667372393119-c81c0cda99fb?w=800&auto=format&fit=crop&q=60",
        published: true,
    }
];

async function seed() {
    console.log("Seeding courses...");

    // Try to find an admin first
    let { data: users } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")
        .limit(1);

    // If no admin, try teacher
    if (!users || users.length === 0) {
        ({ data: users } = await supabase
            .from("users")
            .select("id")
            .eq("role", "teacher")
            .limit(1));
    }

    // If still no one, just get ANY user to assign the course to
    if (!users || users.length === 0) {
        ({ data: users } = await supabase.from("users").select("id").limit(1));
    }

    if (!users || users.length === 0) {
        console.error("No users found in the database. Please sign up at least one user first.");
        return;
    }

    const instructorId = users[0].id;

    // Get a category to assign
    const { data: categories } = await supabase.from("categories").select("id").limit(1);
    const categoryId = categories && categories.length > 0 ? categories[0].id : null;

    for (const course of dummyCourses) {
        const { error } = await supabase.from("courses").upsert({
            ...course,
            instructor_id: instructorId,
            category_id: categoryId,
        }, { onConflict: "slug" });

        if (error) {
            console.error(`Error inserting ${course.title}:`, error.message);
        } else {
            console.log(`Inserted: ${course.title}`);
        }
    }

    console.log("Seeding complete!");
}

seed();
