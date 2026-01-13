import { NextResponse } from 'next/server';

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

export async function GET() {
    try {
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
