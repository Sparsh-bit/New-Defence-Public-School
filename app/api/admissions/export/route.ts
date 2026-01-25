import { secureApiHandler, type SecureRequest } from '@/lib/security';

export const runtime = 'edge';

/**
 * SECURE Admissions CSV Export Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: Admin (30 req/min) - exports can be expensive
 * - Authentication: JWT token required
 * - Authorization: Requires 'admissions:export' permission
 * - CORS: Strict origin validation
 */
async function handleExport(request: SecureRequest) {
    try {
        // Log export action for audit trail (exports of sensitive data should always be logged)
        console.log(`[ADMISSIONS EXPORT] User: ${request.user?.username || 'unknown'} | Time: ${new Date().toISOString()}`);

        // CSV export logic would go here, but reading the data file is not possible on Edge without a DB.
        // Returning simple header with sample data.
        const csvContent = "ID,Student Name,Father Name,Class,Status,Date\nNDPS-SAMPLE-001,Aarav Sharma,Rajesh Sharma,Class 5,pending,2024-01-15\nNDPS-SAMPLE-002,Aditi Singh,Vikram Singh,Class 9,reviewed,2024-01-14";

        return new Response(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="applications.csv"',
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return new Response('Export failed', { status: 500 });
    }
}

// Export with security wrapper
// NOTE: During initial setup, auth is set to false. 
// Enable authentication after setting up JWT_SECRET and user management.
export const GET = secureApiHandler(handleExport, {
    rateLimit: 'admin',      // 30 requests/minute (exports are expensive)
    auth: { required: true, permissions: ['admissions:export'] },
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admissions/export'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
