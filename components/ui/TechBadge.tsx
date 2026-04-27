import React from 'react';
import { cn } from '@/lib/utils';
import {
    Globe, Rocket, Layers, Layout, Server, Database, Code,
    FileCode, Terminal, Zap, Shield, Cloud, Infinity,
    Search, Share2, Award, BookOpen, GraduationCap,
    Brain, Bot, Cpu as CpuIcon, Wand2, Network, ScanEye, MessageSquare,
    Smartphone, HardDrive, GitBranch, Coffee, Activity, UploadCloud, Tablet
} from "lucide-react";
import {
    SiHtml5,  SiBootstrap, SiTailwindcss, SiGit, SiGithub, SiNetlify, SiJavascript,
    SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiPostgresql, SiSupabase,
    SiPython, SiFigma, SiMongodb, SiExpress, SiPrisma, SiDrizzle, SiVercel, SiDocker, SiRedis,
     SiCloudflare, SiKubernetes, SiLinux, SiPhp, SiLaravel, SiMysql, SiSpring, SiRust, SiGo, SiCplusplus, SiRuby,
    SiRubyonrails, SiVuedotjs, SiSvelte, SiFlutter, SiKotlin, SiSwift, SiFirebase, SiGraphql, SiRedux, SiWordpress, SiShopify, SiPostman, SiSharp,
    SiOpenai, SiTensorflow, SiPytorch, SiAnaconda, SiPandas, SiNumpy, SiScikitlearn, SiJupyter, SiKeras
} from "react-icons/si";
interface TechBadgeProps {
    tag: string;
    className?: string;
    showIcon?: boolean;
}
const TECH_DATA = [
    { keys: ['artificialintelligence', 'ai'], icon: <SiOpenai className="w-4 h-4" />, color: "#10A37F" },
    { keys: ['machinelearning', 'ml'], icon: <Brain className="w-4 h-4" />, color: "#6366F1" },
    { keys: ['deeplearning', 'dl'], icon: <Bot className="w-4 h-4" />, color: "#8B5CF6" },
    { keys: ['tensorflow'], icon: <SiTensorflow className="w-4 h-4" />, color: "#FF6F00" },
    { keys: ['pytorch'], icon: <SiPytorch className="w-4 h-4" />, color: "#EE4C2C" },
    { keys: ['keras'], icon: <SiKeras className="w-4 h-4" />, color: "#D00000" },
    { keys: ['scikitlearn'], icon: <SiScikitlearn className="w-4 h-4" />, color: "#F7931E" },
    { keys: ['nlp', 'naturalprocessing'], icon: <MessageSquare className="w-4 h-4" />, color: "#3B82F6" },
    { keys: ['computervision', 'cv'], icon: <ScanEye className="w-4 h-4" />, color: "#F43F5E" },
    { keys: ['neuralnetwork'], icon: <Network className="w-4 h-4" />, color: "#6366F1" },
    { keys: ['datascience', 'anaconda'], icon: <SiAnaconda className="w-4 h-4" />, color: "#44A833" },
    { keys: ['pandas'], icon: <SiPandas className="w-4 h-4" />, color: "#150458" },
    { keys: ['numpy'], icon: <SiNumpy className="w-4 h-4" />, color: "#013243" },
    { keys: ['jupyter'], icon: <SiJupyter className="w-4 h-4" />, color: "#F37626" },

    
    { keys: ['html'], icon: <SiHtml5 className="w-4 h-4" />, color: "#E34F26" },
    { keys: ['javascript', 'js'], icon: <SiJavascript className="w-4 h-4" />, color: "#F7DF1E" },
    { keys: ['typescript', 'ts'], icon: <SiTypescript className="w-4 h-4" />, color: "#3178C6" },
    { keys: ['react'], icon: <SiReact className="w-4 h-4" />, color: "#61DAFB" },
    { keys: ['next'], icon: <SiNextdotjs className="w-4 h-4" />, color: "#FFFFFF" },
    { keys: ['node'], icon: <SiNodedotjs className="w-4 h-4" />, color: "#339933" },
    { keys: ['tailwind'], icon: <SiTailwindcss className="w-4 h-4" />, color: "#06B6D4" },
    { keys: ['bootstrap'], icon: <SiBootstrap className="w-4 h-4" />, color: "#7952B3" },
    { keys: ['git'], icon: <SiGit className="w-4 h-4" />, color: "#F05032" },
    { keys: ['github'], icon: <SiGithub className="w-4 h-4" />, color: "#FFFFFF" },
    { keys: ['netlify'], icon: <SiNetlify className="w-4 h-4" />, color: "#00C7B7" },
    { keys: ['vercel'], icon: <SiVercel className="w-4 h-4" />, color: "#FFFFFF" },
    { keys: ['supabase'], icon: <SiSupabase className="w-4 h-4" />, color: "#3ECF8E" },
    { keys: ['postgres'], icon: <SiPostgresql className="w-4 h-4" />, color: "#4169E1" },
    { keys: ['mongo'], icon: <SiMongodb className="w-4 h-4" />, color: "#47A248" },
    { keys: ['express'], icon: <SiExpress className="w-4 h-4" />, color: "#FFFFFF" },
    { keys: ['prisma'], icon: <SiPrisma className="w-4 h-4" />, color: "#2D3748" },
    { keys: ['drizzle'], icon: <SiDrizzle className="w-4 h-4" />, color: "#C5F74F" },
    { keys: ['docker'], icon: <SiDocker className="w-4 h-4" />, color: "#2496ED" },
    { keys: ['redis'], icon: <SiRedis className="w-4 h-4" />, color: "#DC382D" },
    { keys: ['python'], icon: <SiPython className="w-4 h-4" />, color: "#3776AB" },
    { keys: ['figma'], icon: <SiFigma className="w-4 h-4" />, color: "#F24E1E" },
    { keys: ['aws'], icon: <Cloud className="w-4 h-4" />, color: "#FF9900" },
    { keys: ['cloud'], icon: <UploadCloud className="w-4 h-4" />, color: "#00AEEF" },
    { keys: ['devops'], icon: <Infinity className="w-4 h-4" />, color: "#007ACC" },
    { keys: ['kubernetes', 'k8s'], icon: <SiKubernetes className="w-4 h-4" />, color: "#326CE5" },
    { keys: ['linux'], icon: <SiLinux className="w-4 h-4" />, color: "#FCC624" },
    { keys: ['githubactions', 'actions'], icon: <Activity className="w-4 h-4" />, color: "#2088FF" },
    { keys: ['web'], icon: <Globe className="w-4 h-4" />, color: "#00AEEF" },
    { keys: ['bootcamp'], icon: <Rocket className="w-4 h-4" />, color: "#FF4B2B" },
    { keys: ['fullstack'], icon: <Layers className="w-4 h-4" />, color: "#9C27B0" },
    { keys: ['frontend'], icon: <Layout className="w-4 h-4" />, color: "#61DAFB" },
    { keys: ['backend'], icon: <Server className="w-4 h-4" />, color: "#339933" },
    { keys: ['php'], icon: <SiPhp className="w-4 h-4" />, color: "#777BB4" },
    { keys: ['laravel'], icon: <SiLaravel className="w-4 h-4" />, color: "#FF2D20" },
    { keys: ['mysql'], icon: <SiMysql className="w-4 h-4" />, color: "#4479A1" },
    { keys: ['java'], icon: <Coffee className="w-4 h-4" />, color: "#007396" },
    { keys: ['spring'], icon: <SiSpring className="w-4 h-4" />, color: "#6DB33F" },
    { keys: ['rust'], icon: <SiRust className="w-4 h-4" />, color: "#000000" },
    { keys: ['go', 'golang'], icon: <SiGo className="w-4 h-4" />, color: "#00ADD8" },
    { keys: ['cplusplus', 'c++'], icon: <SiCplusplus className="w-4 h-4" />, color: "#00599C" },
    { keys: ['csharp', 'c#'], icon: <SiSharp className="w-4 h-4" />, color: "#239120" },
    { keys: ['ruby'], icon: <SiRuby className="w-4 h-4" />, color: "#CC342D" },
    { keys: ['rails', 'rubyonrails'], icon: <SiRubyonrails className="w-4 h-4" />, color: "#CC0000" },
    { keys: ['vue'], icon: <SiVuedotjs className="w-4 h-4" />, color: "#4FC08D" },
    { keys: ['svelte'], icon: <SiSvelte className="w-4 h-4" />, color: "#FF3E00" },
    { keys: ['flutter'], icon: <SiFlutter className="w-4 h-4" />, color: "#02569B" },
    { keys: ['kotlin'], icon: <SiKotlin className="w-4 h-4" />, color: "#7F52FF" },
    { keys: ['swift'], icon: <SiSwift className="w-4 h-4" />, color: "#F05138" },
    { keys: ['firebase'], icon: <SiFirebase className="w-4 h-4" />, color: "#FFCA28" },
    { keys: ['graphql'], icon: <SiGraphql className="w-4 h-4" />, color: "#E10098" },
    { keys: ['redux'], icon: <SiRedux className="w-4 h-4" />, color: "#764ABC" },
    { keys: ['wordpress'], icon: <SiWordpress className="w-4 h-4" />, color: "#21759B" },
    { keys: ['shopify'], icon: <SiShopify className="w-4 h-4" />, color: "#7AB55C" },
    { keys: ['postman'], icon: <SiPostman className="w-4 h-4" />, color: "#FF6C37" },
    { keys: ['ios', 'iphone', 'apple'], icon: <Tablet className="w-4 h-4" />, color: "#A2AAAD" },
    { keys: ['android'], icon: <Smartphone className="w-4 h-4" />, color: "#3DDC84" },
    { keys: ['database', 'sql'], icon: <Database className="w-4 h-4" />, color: "#4479A1" },
    { keys: ['cloudflare'], icon: <SiCloudflare className="w-4 h-4" />, color: "#F38020" },
    { keys: ['security', 'cyber'], icon: <Shield className="w-4 h-4" />, color: "#10B981" },
    { keys: ['terminal', 'cli', 'shell'], icon: <Terminal className="w-4 h-4" />, color: "#4B5563" },
    { keys: ['search', 'seo'], icon: <Search className="w-4 h-4" />, color: "#6366F1" },
    { keys: ['marketing', 'social'], icon: <Share2 className="w-4 h-4" />, color: "#EC4899" },
    { keys: ['performance', 'speed', 'optimization'], icon: <Zap className="w-4 h-4" />, color: "#F59E0B" },
    { keys: ['hardware', 'iot', 'cpu'], icon: <CpuIcon className="w-4 h-4" />, color: "#EF4444" },
    { keys: ['docs', 'documentation', 'book'], icon: <BookOpen className="w-4 h-4" />, color: "#3B82F6" },
    { keys: ['education', 'learning', 'academic'], icon: <GraduationCap className="w-4 h-4" />, color: "#8B5CF6" },
    { keys: ['design', 'uiux', 'award'], icon: <Award className="w-4 h-4" />, color: "#F43F5E" },
    { keys: ['storage', 'data', 'warehouse'], icon: <HardDrive className="w-4 h-4" />, color: "#F59E0B" },
    { keys: ['hosting', 'serverless', 'deployment'], icon: <Server className="w-4 h-4" />, color: "#0EA5E9" },
    { keys: ['cicd', 'automation', 'pipeline'], icon: <GitBranch className="w-4 h-4" />, color: "#6366F1" },
    { keys: ['programming', 'software', 'coding'], icon: <Code className="w-4 h-4" />, color: "#10B981" },
    { keys: ['snippets', 'template', 'source'], icon: <FileCode className="w-4 h-4" />, color: "#64748B" },
    { keys: ['magic', 'ai', 'generate'], icon: <Wand2 className="w-4 h-4" />, color: "#8B5CF6" },
];
export const getTechBadgeData = (tag: string) => {
    const t = tag.toLowerCase().replace(/\s+/g, '');
    const match = TECH_DATA.find(data =>
        data.keys.some(key => t.includes(key))
    );
    return {
        icon: match?.icon || <Code className="w-4 h-4" />,
        brandColor: match?.color || "#EAB308"
    };
};
export const TechBadge: React.FC<TechBadgeProps> = ({ tag, className, showIcon = true }) => {
    const { icon, brandColor } = getTechBadgeData(tag);
    return (
        <div className={cn(
            "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all group cursor-default",
            "bg-slate-100/80 dark:bg-[#0F1115]/80 backdrop-blur-md border border-slate-300 dark:border-white/5",
            "hover:border-slate-300 dark:hover:border-white/10",
            className
        )}>
            {showIcon && (
                <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300"
                    style={{
                        backgroundColor: `${brandColor}1A`,
                    }}
                >
                    <div
                        className="transition-transform duration-300 group-hover:scale-110"
                        style={{ color: brandColor }}
                    >
                        {icon}
                    </div>
                </div>
            )}
            <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {tag}
            </span>
        </div>
    );
};
export default TechBadge;
