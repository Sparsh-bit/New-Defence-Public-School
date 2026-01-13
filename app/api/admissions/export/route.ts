import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
    // CSV export logic would go here, but reading the data file is not possible on Edge without a DB.
    // Returning simple header.
    const csvContent = "ID,Student Name,Date\nNDPS-MOCK,MOCK DATA,2024-01-01";

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="applications.csv"',
        },
    });
}
