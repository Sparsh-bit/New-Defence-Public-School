import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'csv';

        // Mock data for Edge Runtime
        const csv = 'Application ID,Student Name,Date of Birth,Class Applying For\n';

        if (format === 'xlsx') {
            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': `attachment; filename="admission_applications_mock_${new Date().toISOString().split('T')[0]}.csv"`,
                },
            });
        } else {
            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="admission_applications_mock_${new Date().toISOString().split('T')[0]}.csv"`,
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
