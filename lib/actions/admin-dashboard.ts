'use server';

import { createClient } from '@/lib/supabase/server';

export async function getAdminDashboardTrends() {
    console.log('[getAdminDashboardTrends] Fetching trends...');
    const supabase = await createClient();

    // Fetch user growth (last 6 months)
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('created_at');

    // Fetch enrollment growth (last 6 months)
    const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('created_at');

    // Fetch revenue growth (last 6 months)
    const { data: paymentData, error: paymentError } = await supabase
        .from('transactions')
        .select('created_at, amount')
        .eq('status', 'completed');

    if (userError || enrollmentError || paymentError) {
        console.error('Error fetching trend data:', { userError, enrollmentError, paymentError });
        return { success: false, error: 'Failed to fetch trend data' };
    }

    // Helper to group by month
    const groupByMonth = (data: any[], dateKey: string = 'created_at', sumKey?: string) => {
        const months: Record<string, number> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleString('en-US', { month: 'short' });
            months[key] = 0;
        }

        data.forEach(item => {
            const d = new Date(item[dateKey]);
            const key = d.toLocaleString('en-US', { month: 'short' });
            if (months[key] !== undefined) {
                months[key] += sumKey ? (item[sumKey] || 0) : 1;
            }
        });

        return Object.entries(months).map(([month, value]) => ({ month, value }));
    };

    // Fetch category distribution
    const { data: categoryData, error: categoryError } = await supabase
        .from('courses')
        .select('category');

    if (userError || enrollmentError || paymentError || categoryError) {
        console.error('Error fetching trend data:', { userError, enrollmentError, paymentError, categoryError });
        return { success: false, error: 'Failed to fetch trend data' };
    }

    const categories: Record<string, number> = {};
    (categoryData || []).forEach(c => {
        const cat = c.category || 'Uncategorized';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categories).map(([name, value]) => ({ name, value }));

    return {
        success: true,
        data: {
            userGrowth: groupByMonth(userData || []),
            enrollmentGrowth: groupByMonth(enrollmentData || []),
            revenueGrowth: groupByMonth(paymentData || [], 'created_at', 'amount'),
            categoryDistribution
        }
    };
}

export async function getTopPerformingCourses() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('courses')
        .select(`
            id,
            title,
            price,
            discount_price,
            status,
            enrollments!inner(count),
            transactions:transactions(amount)
        `)
        .eq('status', 'published')
        .limit(5);

    if (error) {
        console.error('Error fetching top courses:', error);
        return { success: false, error: 'Failed to fetch top courses' };
    }

    const formattedCourses = data.map(course => {
        const studentCount = (course.enrollments as any)[0]?.count || 0;
        const totalRevenue = (course.transactions as any[])?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

        return {
            id: course.id,
            title: course.title,
            students: studentCount,
            revenue: totalRevenue,
            status: course.status,
            rating: 4.8, // Fallback since we don't have reviews yet
            trend: 'up',
            trendValue: 12
        };
    }).sort((a, b) => b.revenue - a.revenue);

    return { success: true, data: formattedCourses };
}

export async function getRecentActivity() {
    const supabase = await createClient();

    const [
        { data: newUsers },
        { data: newEnrollments },
        { data: newPayments }
    ] = await Promise.all([
        supabase.from('users').select('id, name, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('enrollments').select('id, user:users(name), course:courses(title), created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('transactions').select('id, user:users(name), amount, created_at').eq('status', 'completed').order('created_at', { ascending: false }).limit(3)
    ]);

    const activities = [
        ...(newUsers || []).map(u => ({
            id: `user-${u.id}`,
            type: 'user',
            title: 'New User Joined',
            description: `${u.name || 'A student'} joined the platform`,
            time: u.created_at
        })),
        ...(newEnrollments || []).map(e => ({
            id: `enroll-${e.id}`,
            type: 'enrollment',
            title: 'New Enrollment',
            description: `${(e.user as any)?.name || 'Student'} enrolled in ${(e.course as any)?.title}`,
            time: e.created_at
        })),
        ...(newPayments || []).map(p => ({
            id: `pay-${p.id}`,
            type: 'payment',
            title: 'Payment Received',
            description: `Received ৳${p.amount} from ${(p.user as any)?.name || 'Student'}`,
            time: p.created_at
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return { success: true, data: activities };
}
