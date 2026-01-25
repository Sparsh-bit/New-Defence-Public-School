/**
 * Result System Utilities
 */

export interface ResultStreamInfo {
    class: string;
    stream: string;
}

/**
 * Derives class and stream from SR No suffix
 * Examples: 400-H -> Class 10, 402-BIO -> Class 12 BIO
 */
export function deriveInfoFromSrNo(srNo: string): ResultStreamInfo {
    const upperSr = srNo.toUpperCase();

    if (upperSr.endsWith('-H')) {
        return { class: '10', stream: 'GENERAL' };
    } else if (upperSr.endsWith('-MATH')) {
        return { class: '12', stream: 'MATH' };
    } else if (upperSr.endsWith('-BIO')) {
        return { class: '12', stream: 'BIO' };
    } else if (upperSr.endsWith('-ARTS')) {
        return { class: '12', stream: 'ARTS' };
    }

    throw new Error(`Invalid SR No format: ${srNo}. Missing or invalid suffix (-H, -MATH, -BIO, -ARTS).`);
}

/**
 * Validates the basic formatting of a result record before insertion
 */
export function validateResultRecord(record: any) {
    const required = ['sr_no', 'student_name', 'subjects_json', 'total', 'percentage', 'status'];
    for (const field of required) {
        if (!record[field]) {
            throw new Error(`Missing mandatory field: ${field} in record ${record.sr_no || 'unknown'}`);
        }
    }

    // Validate JSON structure
    try {
        JSON.parse(record.subjects_json);
    } catch (e) {
        throw new Error(`Invalid subjects_json for SR No: ${record.sr_no}. Must be valid JSON.`);
    }

    // Validate derivation
    deriveInfoFromSrNo(record.sr_no);
}
