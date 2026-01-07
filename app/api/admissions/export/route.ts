import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'csv';

        const filePath = path.join(process.cwd(), 'data', 'applications.json');

        // Read applications file
        let applications = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            applications = JSON.parse(fileContent);
        } catch {
            // File doesn't exist yet
            applications = [];
        }

        if (format === 'xlsx') {
            // For Excel format, we'll use CSV with Excel-friendly formatting
            // In production, you'd use a library like 'xlsx' or 'exceljs'
            const csv = convertToCSV(applications);

            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': `attachment; filename="admission_applications_${new Date().toISOString().split('T')[0]}.csv"`,
                },
            });
        } else {
            // CSV format
            const csv = convertToCSV(applications);

            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="admission_applications_${new Date().toISOString().split('T')[0]}.csv"`,
                },
            });
        }
    } catch (error) {
        console.error('Error exporting applications:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to export applications' },
            { status: 500 }
        );
    }
}

function convertToCSV(applications: any[]): string {
    if (applications.length === 0) {
        return 'No applications found';
    }

    // Define headers
    const headers = [
        'Application ID',
        'Submitted Date',
        'Student Name',
        'Date of Birth',
        'Gender',
        'Nationality',
        'Religion',
        'Category',
        'Aadhar Number',
        'Father Name',
        'Father Occupation',
        'Father Phone',
        'Father Email',
        'Mother Name',
        'Mother Occupation',
        'Mother Phone',
        'Mother Email',
        'Address',
        'City',
        'State',
        'PIN Code',
        'Class Applying For',
        'Previous School',
        'Previous Class',
        'Medical Conditions',
        'Emergency Contact',
        'Emergency Phone',
    ];

    // Create CSV content
    let csv = headers.join(',') + '\n';

    applications.forEach((app) => {
        const row = [
            app.id || '',
            app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '',
            escapeCSV(app.studentName || ''),
            app.dateOfBirth || '',
            app.gender || '',
            app.nationality || '',
            app.religion || '',
            app.category || '',
            app.aadharNumber || '',
            escapeCSV(app.fatherName || ''),
            escapeCSV(app.fatherOccupation || ''),
            app.fatherPhone || '',
            app.fatherEmail || '',
            escapeCSV(app.motherName || ''),
            escapeCSV(app.motherOccupation || ''),
            app.motherPhone || '',
            app.motherEmail || '',
            escapeCSV(app.address || ''),
            escapeCSV(app.city || ''),
            escapeCSV(app.state || ''),
            app.pincode || '',
            escapeCSV(app.classApplyingFor || ''),
            escapeCSV(app.previousSchool || ''),
            escapeCSV(app.previousClass || ''),
            escapeCSV(app.medicalConditions || ''),
            escapeCSV(app.emergencyContact || ''),
            app.emergencyPhone || '',
        ];

        csv += row.join(',') + '\n';
    });

    return csv;
}

function escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
