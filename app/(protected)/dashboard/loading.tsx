import { CustomLoading } from "@/components/ui/custom-loading";
export default function DashboardLoading() {
    return (
        <div className="flex-1 flex items-center justify-center min-h-[85vh] w-full bg-background/50 backdrop-blur-sm rounded-3xl border border-border/40 my-4 shadow-inner">
            <CustomLoading size="xl" />
        </div>
    );
}
