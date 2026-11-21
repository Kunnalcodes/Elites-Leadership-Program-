import React from 'react';
import { Hero } from '../sections/Hero';
import { WhyAreWeHere } from '../sections/WhyAreWeHere';
import { Philosophy } from '../sections/Philosophy';
import { EliteExperience } from '../sections/EliteExperience';
import { ProgressionSection } from '../sections/ProgressionSection';
import { TaskEcosystem } from '../sections/TaskEcosystem';
import { LeaderboardSection } from '../sections/LeaderboardSection';
import { CommunitySection } from '../sections/CommunitySection';
import { ThreadSecurityConnection } from '../sections/ThreadSecurityConnection';
import { FaqSection } from '../sections/FaqSection';
import { FinalConversion } from '../sections/FinalConversion';

export function Home() {
  return (
    <main className="w-full bg-[#08070C] text-white">
      {/* 01. Hero Section with 3D Shield Canvas */}
      <Hero />

      {/* 02. Why Are We Here: 4 Pillars & 3D Leader Hologram */}
      <WhyAreWeHere />

      {/* 03. Philosophy: Ownership, Collaboration, Impact */}
      <Philosophy />

      {/* 04. The Elite Experience: 1-Year Journey Arc */}
      <EliteExperience />

      {/* 05. Five-Stage Progression Model with 3D Platforms */}
      <ProgressionSection />

      {/* 06. Task Ecosystem & Real-World Execution Engine */}
      <TaskEcosystem />

      {/* 07. Recognition, Leaderboard & 3D Podiums */}
      <LeaderboardSection />

      {/* 08. Mentorship & Community Directorate */}
      <CommunitySection />

      {/* 09. Thread Security Governance & Real-World Foundations */}
      <ThreadSecurityConnection />

      {/* 10. Accessible Interactive FAQ */}
      <FaqSection />

      {/* 11. Final Dramatic Conversion Call to Action */}
      <FinalConversion />
    </main>
  );
}

export default Home;
