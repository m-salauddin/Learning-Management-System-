import { Layers, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getCategoryById } from "@/lib/actions/categories";
import { CategoryForm } from "@/components/dashboard/admin/categories/CategoryForm";
import { notFound } from "next/navigation";
interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}
export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const result = await getCategoryById(id);
    if (!result.success || !result.data) {
        return notFound();
    }
    const category = result.data;
    return (
        <div className="space-y-8 pb-10 max-w-5xl mx-auto">
            {}
            <div className="flex flex-col gap-4">
                <Link
                    href="/dashboard/categories"
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit group"
                >
                    <div className="p-1 rounded-md bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Back to Categories</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                            Edit <span className="text-primary">Category</span>
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                            Modify taxonomy details and visual branding for {category.name}
                        </p>
                    </div>
                </div>
            </div>
            {}
            <div className="p-8 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 p-12 -ml-16 -mb-16 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <CategoryForm initialData={category} isEditing={true} />
                </div>
            </div>
        </div>
    );
}
