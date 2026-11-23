import React from 'react';
import ChampionshipLeaderboard from '../components/leaderboard/ChampionshipLeaderboard';

export function LeaderboardSection() {
  return (
    <section id="leaderboard" className="w-full bg-[#101112] border-t border-[#34383A] overflow-hidden">
      <ChampionshipLeaderboard />
    </section>
  );
}

export default LeaderboardSection;