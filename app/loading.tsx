import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#0A1628]/10 border-t-[#C6A75E] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#0A1628] animate-pulse" />
                </div>
            </div>
            <p className="mt-4 text-[#0A1628] font-bold tracking-widest text-sm uppercase animate-pulse">
                Loading NDPS...
            </p>
        </div>
    );
}
