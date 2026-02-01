/**
 * Result System Utilities
 * 
 * These utilities support dynamic stream detection and validation
 * for the result import system. Designed to work with all current
 * and future streams without code modifications.
 */

export interface ResultStreamInfo {
    class: string;
    stream: string;
}

/**
 * Derives class and stream from SR No suffix
 * 
 * Supported patterns:
 * - Class 10: -H, -10, -X
 * - Class 12: -MATH/-MATHS, -BIO/-BIOLOGY, -ARTS/-ART, -COMM/-COMMERCE, -HUM/-HUMANITIES
 * - Generic: -12-[STREAM]
 * 
 * Examples: 
 *   400-H -> Class 10, GENERAL
 *   402-BIO -> Class 12, BIO
 *   500-ARTS -> Class 12, ARTS
 *   600-COMMERCE -> Class 12, COMMERCE
 * 
 * Returns null for unrecognized patterns instead of throwing
 */
export function deriveInfoFromSrNo(srNo: string): ResultStreamInfo | null {
    if (!srNo) return null;

    const upperSr = srNo.toUpperCase().trim();

    // Class 10 patterns
    if (upperSr.endsWith('-H') || upperSr.includes('-10') || upperSr.endsWith('-X')) {
        return { class: '10', stream: 'GENERAL' };
    }

    // Class 12 - Maths
    if (upperSr.endsWith('-MATH') || upperSr.includes('-MATHS')) {
        return { class: '12', stream: 'MATH' };
    }

    // Class 12 - Biology/Science
    if (upperSr.endsWith('-BIO') || upperSr.includes('-BIOLOGY') || upperSr.endsWith('-SCI')) {
        return { class: '12', stream: 'BIO' };
    }

    // Class 12 - Arts/Humanities
    if (upperSr.endsWith('-ARTS') || upperSr.includes('-ART')) {
        return { class: '12', stream: 'ARTS' };
    }
    if (upperSr.endsWith('-HUM') || upperSr.includes('-HUMANITIES')) {
        return { class: '12', stream: 'HUMANITIES' };
    }

    // Class 12 - Commerce
    if (upperSr.endsWith('-COMM') || upperSr.includes('-COMMERCE')) {
        return { class: '12', stream: 'COMMERCE' };
    }

    // Generic pattern: -12-[STREAM] or -[STREAM]
    const pattern12 = /-12-?([A-Z]+)$/i;
    const match12 = upperSr.match(pattern12);
    if (match12) {
        return { class: '12', stream: match12[1].toUpperCase() };
    }

    // Try generic suffix pattern
    const genericPattern = /-([A-Z]{2,10})$/i;
    const genericMatch = upperSr.match(genericPattern);
    if (genericMatch) {
        const suffix = genericMatch[1].toUpperCase();
        // Avoid matching common non-stream suffixes
        if (!['NO', 'SR', 'ADM', 'ID', 'NO'].includes(suffix)) {
            return { class: '12', stream: suffix };
        }
    }

    // Return null for unrecognized patterns - let the admin selection take precedence
    return null;
}

/**
 * Legacy wrapper that throws for backward compatibility
 * @deprecated Use deriveInfoFromSrNo which returns null for unknown patterns
 */
export function deriveInfoFromSrNoStrict(srNo: string): ResultStreamInfo {
    const info = deriveInfoFromSrNo(srNo);
    if (!info) {
        throw new Error(`Invalid SR No format: ${srNo}. Could not detect class/stream from suffix.`);
    }
    return info;
}

/**
 * Validates the basic formatting of a result record before insertion
 * More lenient than before - doesn't require stream derivation to succeed
 */
export function validateResultRecord(record: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    const required = ['sr_no', 'student_name', 'subjects_json'];
    for (const field of required) {
        if (!record[field]) {
            errors.push(`Missing mandatory field: ${field}`);
        }
    }

    // Validate SR No format (basic check)
    if (record.sr_no) {
        const srNo = String(record.sr_no).trim();
        if (srNo.length < 2 || srNo.length > 50) {
            errors.push('SR No must be between 2 and 50 characters');
        }
    }

    // Validate student name
    if (record.student_name) {
        const name = String(record.student_name).trim();
        if (name.length < 2) {
            errors.push('Student name too short');
        }
    }

    // Validate JSON structure
    if (record.subjects_json) {
        try {
            const parsed = JSON.parse(String(record.subjects_json));
            if (!Array.isArray(parsed)) {
                errors.push('subjects_json must be a JSON array');
            }
        } catch {
            errors.push('Invalid subjects_json: must be valid JSON');
        }
    }

    // Optional: validate stream info (but don't fail if not detectable)
    if (record.sr_no) {
        const info = deriveInfoFromSrNo(String(record.sr_no));
        if (!info) {
            // Just a warning, not an error - admin selection takes precedence
            console.warn(`[Validation] Could not auto-detect stream for SR No: ${record.sr_no}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Checks if a subject JSON contains valid marks data
 */
export function validateSubjectsJson(subjectsJson: string): boolean {
    try {
        const subjects = JSON.parse(subjectsJson);
        if (!Array.isArray(subjects)) return false;

        return subjects.every(s =>
            typeof s === 'object' &&
            s.subject &&
            typeof s.marks === 'number'
        );
    } catch {
        return false;
    }
}
