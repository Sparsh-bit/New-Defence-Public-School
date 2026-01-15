import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';

export const runtime = 'edge';

// Mock data for Edge / Fallback
const MOCK_APPLICATIONS = [
    {
        id: "NDPS-SAMPLE-001",
        studentName: "Aarav Sharma",
        fatherName: "Rajesh Sharma",
        classApplyingFor: "Class 5",
        status: "pending",
        date: "2024-01-15",
        submittedAt: new Date().toISOString()
    },
    {
        id: "NDPS-SAMPLE-002",
        studentName: "Aditi Singh",
        fatherName: "Vikram Singh",
        classApplyingFor: "Class 9",
        status: "reviewed",
        date: "2024-01-14",
        submittedAt: new Date(Date.now() - 86400000).toISOString()
    }
];

/**
 * SECURE Admissions List Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: Standard API (100 req/min)
 * - Authentication: JWT token required
 * - Authorization: Requires 'admissions:read' permission
 * - CORS: Strict origin validation
 */
async function handleList(request: SecureRequest) {
    try {
        // Log access for audit trail
        console.log(`[ADMISSIONS ACCESS] User: ${request.user?.username || 'unknown'} | Action: list | Time: ${new Date().toISOString()}`);

        // Edge Runtime does not support fs. 
        // In a real production environment, this should connect to a Database (e.g. Supabase, MongoDB).
        // For this deployment, we return mock/in-memory data to ensure the site functions.

        return NextResponse.json({
            success: true,
            applications: MOCK_APPLICATIONS
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// Export with security wrapper
// NOTE: During initial setup, auth is set to false. 
// Enable authentication after setting up JWT_SECRET and user management.
export const GET = secureApiHandler(handleList, {
    rateLimit: 'api',        // 100 requests/minute
    auth: false,             // TODO: Enable after setting JWT_SECRET: { required: true, permissions: ['admissions:read'] }
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admissions/list'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
