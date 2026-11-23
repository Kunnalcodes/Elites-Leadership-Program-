import React, { useEffect } from 'react';
import ChampionshipLeaderboard from '../components/leaderboard/ChampionshipLeaderboard';

export function LeaderboardPage() {
  useEffect(() => {
    document.title = 'Driver Standings // F1 Championship Leaderboard | Thread Elite';
  }, []);

  return (
    <main className="w-full bg-[#101112]">
      <ChampionshipLeaderboard />
    </main>
  );
}

export default LeaderboardPage;