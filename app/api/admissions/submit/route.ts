import { NextResponse } from 'next/server';
import { secureApiHandler, type SecureRequest } from '@/lib/security';
import { getDatabase } from '@/lib/db';

export const runtime = 'edge';

// Simple input validation
function validateSubmission(body: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!body.studentName || typeof body.studentName !== 'string' || body.studentName.length < 2) {
        errors.push('Student name is required and must be at least 2 characters');
    }

    if (!body.fatherName || typeof body.fatherName !== 'string') {
        errors.push('Father name is required');
    }

    if (!body.classApplyingFor || typeof body.classApplyingFor !== 'string') {
        errors.push('Class applying for is required');
    }

    // Sanitize inputs - remove any HTML/script tags
    const htmlTagRegex = /<[^>]*>/g;
    if (body.studentName && htmlTagRegex.test(body.studentName)) {
        errors.push('Invalid characters in student name');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * SECURE Admissions Submit Route
 * 
 * Security Measures Applied:
 * - Rate Limiting: Strict (prevent spam submissions)
 * - Input Validation: Server-side validation of all fields
 * - CORS: Strict origin validation
 * - No auth required (public form)
 */
async function handleSubmit(request: SecureRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = validateSubmission(body);
        if (!validation.valid) {
            return NextResponse.json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            }, { status: 400 });
        }

        // Sanitize input data
        const sanitizedData = {
            studentName: body.studentName.trim().substring(0, 100),
            fatherName: body.fatherName.trim().substring(0, 100),
            motherName: body.motherName?.trim().substring(0, 100) || '',
            classApplyingFor: body.classApplyingFor.trim().substring(0, 20),
            dateOfBirth: body.dateOfBirth || null,
            contactNumber: body.contactNumber?.replace(/[^0-9+\-\s]/g, '').substring(0, 20) || '',
            email: body.email?.toLowerCase().trim().substring(0, 100) || '',
            address: body.address?.trim().substring(0, 500) || ''
        };

        // Generate ID
        const id = `NDPS-${Date.now()}`;
        const submittedAt = new Date().toISOString();

        // Save to Database
        const db = getDatabase();
        try {
            await db.prepare(
                `INSERT INTO admissions (
                    id, student_name, father_name, mother_name, 
                    class_applying_for, date_of_birth, contact_number, 
                    email, address, status, submitted_at, data_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                id,
                sanitizedData.studentName,
                sanitizedData.fatherName,
                sanitizedData.motherName,
                sanitizedData.classApplyingFor,
                sanitizedData.dateOfBirth,
                sanitizedData.contactNumber,
                sanitizedData.email,
                sanitizedData.address,
                'pending',
                submittedAt,
                JSON.stringify(body)
            ).run();

            console.log(`[ADMISSION SUBMISSION] ID: ${id} | Student: ${sanitizedData.studentName} | Status: Saved to DB`);
        } catch (dbError: any) {
            console.error('Database insertion error:', dbError);
            // Fallback: If table doesn't exist, we still want to log it
            console.log(`[ADMISSION FALLBACK] ID: ${id} | Data: ${JSON.stringify(sanitizedData)}`);

            // If it's a "no such table" error, we want to provide a helpful message
            if (dbError.message?.includes('no such table')) {
                return NextResponse.json({
                    success: false,
                    message: 'Admissions system is currently being updated. Your data has been logged but not yet processed.',
                    id
                }, { status: 202 }); // Accepted but not fully processed
            }
            throw dbError;
        }

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            id
        });
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// Export with security wrapper
// Public route but with strict rate limiting to prevent spam
export const POST = secureApiHandler(handleSubmit, {
    rateLimit: 'form',       // Strict: 3 requests per 15 minutes to prevent form spam
    auth: false,             // Public form - no auth required
    cors: true,
    securityHeaders: true,
    endpoint: '/api/admissions/submit'
});

// Handle OPTIONS for CORS preflight
export const OPTIONS = secureApiHandler(async () => new Response(null), {
    rateLimit: false,
    auth: false,
    cors: true
});
