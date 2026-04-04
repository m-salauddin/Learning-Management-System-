"use server";
import { createClient } from "@/lib/supabase/server";
import { Certificate, CertificateWithDetails, ApiResponse, PaginatedResponse } from "@/types/lms";
export async function getMyCertificates(params: {
    page?: number;
    pageSize?: number;
} = {}): Promise<PaginatedResponse<CertificateWithDetails>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('certificates')
        .select(`
            *,
            course:courses(id, title, slug, thumbnail_url, instructor_id),
            user:users(id, name, email, avatar_url)
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    return {
        data: data as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}
export async function getCertificate(certificateId: string): Promise<ApiResponse<CertificateWithDetails>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('certificates')
        .select(`
            *,
            course:courses(id, title, slug, thumbnail_url, instructor_id),
            user:users(id, name, email, avatar_url)
        `)
        .eq('id', certificateId)
        .single();
    if (error) {
        return { success: false, error: 'Certificate not found' };
    }
    return { success: true, data: data as any };
}
export async function verifyCertificate(certificateNumber: string): Promise<ApiResponse<{
    valid: boolean;
    certificate?: CertificateWithDetails;
}>> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('verify_certificate', {
        p_certificate_number: certificateNumber
    });
    if (error) {
        return { success: false, error: 'Verification failed' };
    }
    if (!data || !data.valid) {
        return {
            success: true,
            data: { valid: false }
        };
    }
    const { data: certificate, error: certError } = await supabase
        .from('certificates')
        .select(`
            *,
            course:courses(id, title, slug, thumbnail_url, instructor_id),
            user:users(id, name, email, avatar_url)
        `)
        .eq('certificate_number', certificateNumber)
        .single();
    if (certError) {
        return { success: false, error: 'Certificate not found' };
    }
    return {
        success: true,
        data: {
            valid: true,
            certificate: certificate as any
        }
    };
}
export async function getCertificateByEnrollment(enrollmentId: string): Promise<ApiResponse<Certificate | null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .maybeSingle();
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
}
export async function issueCertificate(
    enrollmentId: string
): Promise<ApiResponse<Certificate>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select(`
            *,
            course:courses(id, instructor_id, title)
        `)
        .eq('id', enrollmentId)
        .single();
    if (!enrollment) {
        return { success: false, error: 'Enrollment not found' };
    }
    const isAdmin = profile?.role === 'admin';
    const isInstructor = (enrollment as any).course?.instructor_id === user.id;
    if (!isAdmin && !isInstructor) {
        return { success: false, error: 'Not authorized to issue certificates' };
    }
    const { data: existingCert } = await supabase
        .from('certificates')
        .select('id')
        .eq('enrollment_id', enrollmentId)
        .maybeSingle();
    if (existingCert) {
        return { success: false, error: 'Certificate already issued for this enrollment' };
    }
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const { data: certificate, error } = await supabase
        .from('certificates')
        .insert({
            user_id: enrollment.user_id,
            course_id: enrollment.course_id,
            enrollment_id: enrollmentId,
            certificate_number: certificateNumber,
            issued_at: new Date().toISOString()
        })
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data: certificate };
}
export async function getCertificatesForCourse(
    courseId: string,
    params: {
        page?: number;
        pageSize?: number;
    } = {}
): Promise<PaginatedResponse<CertificateWithDetails>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();
    const isAdmin = profile?.role === 'admin';
    const isInstructor = course?.instructor_id === user.id;
    if (!isAdmin && !isInstructor) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('certificates')
        .select(`
            *,
            course:courses(id, title, slug, thumbnail_url),
            user:users(id, name, email, avatar_url)
        `, { count: 'exact' })
        .eq('course_id', courseId)
        .order('issued_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    return {
        data: data as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}
export async function getCertificateDownloadUrl(
    certificateId: string
): Promise<ApiResponse<{ url: string }>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: certificate } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', certificateId)
        .single();
    if (!certificate) {
        return { success: false, error: 'Certificate not found' };
    }
    if (certificate.user_id !== user.id) {
        return { success: false, error: 'Not authorized to download this certificate' };
    }
    if (certificate.pdf_url) {
        const { data: signedUrl, error: signedError } = await supabase
            .storage
            .from('certificates')
            .createSignedUrl(certificate.pdf_url, 3600);
        if (signedError) {
            console.error('Certificate storage error:', signedError);
            const errorMessage = signedError.message?.includes('Bucket not found')
                ? "The 'certificates' storage bucket was not found. Please run the the storage setup script."
                : 'Failed to generate download URL';
            return { success: false, error: errorMessage };
        }
        return { success: true, data: { url: signedUrl.signedUrl } };
    }
    return {
        success: true,
        data: { url: `/api/certificates/${certificateId}/download` }
    };
}
