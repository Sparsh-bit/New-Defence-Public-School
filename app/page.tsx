// Deployment v1.1
import HeroSection from '@/components/HeroSection';
import { KeyHighlights } from '@/components/KeyHighlights';
import NewsEventsSection from '@/components/NewsEventsSection'; // Added Import
import { AboutSchoolSection } from '@/components/AboutSchoolSection';
import { LeadershipMessages } from '@/components/LeadershipMessages';
import { AssessmentSection } from '@/components/AssessmentSection';
import { CurriculumAcademics } from '@/components/CurriculumAcademics';
import { OfficialGallery } from '@/components/OfficialGallery';
import { AdmissionInfoSection } from '@/components/AdmissionInfoSection';
import { OfficialContactSection } from '@/components/OfficialContactSection';


export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F9FC]">


      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Key Highlights */}
      <KeyHighlights />

      {/* 2.5 News & Events */}
      <NewsEventsSection />

      {/* 3. About the School */}
      <AboutSchoolSection />

      {/* 4. Message Section (Leadership) */}
      <LeadershipMessages />

      {/* 5. Assessment & Promotion */}
      <AssessmentSection />

      {/* 6. Curriculum & Academics */}
      <CurriculumAcademics />

      {/* 7. Gallery */}
      <OfficialGallery />

      {/* 8. Admissions */}
      <AdmissionInfoSection />

      {/* 9. Contact */}
      <OfficialContactSection />
    </main>

  );
}
