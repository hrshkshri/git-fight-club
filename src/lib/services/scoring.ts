import { GitHubStats } from './github';

export function calculatePowerLevel(stats: GitHubStats): number {
  // Each raw stat used exactly ONCE — no circular dependencies.

  // 1. Public Repositories [30%]
  //    Sqrt scaling avoids rich-get-richer. Max at ~100 repos.
  const repoScore = Math.min(Math.sqrt(stats.publicRepos) / 10, 1) * 30;

  // 2. Followers [35%]
  //    Log scale because followers span 0 → 100k+.
  //    0 followers = 0 pts, 100 = 17.5, 1 000 = 26, 10 000 = 35 (max).
  const followersScore = Math.min(Math.log10(stats.followers + 1) / 4, 1) * 35;

  // 3. Account age / consistency [20%]
  //    Full marks at 5 years (1 825 days).
  const ageScore = Math.min(stats.accountAgeDays / 1825, 1) * 20;

  // 4. Engagement rate [15%]
  //    Followers per repo — rewards repos that attract community attention.
  //    Full marks at 50+ followers per public repo.
  const fpr = stats.publicRepos > 0 ? stats.followers / stats.publicRepos : 0;
  const engagementScore = Math.min(fpr / 50, 1) * 15;

  const total = repoScore + followersScore + ageScore + engagementScore;
  return Math.max(1, Math.min(100, Math.floor(total)));
}

// HP scales with power so the stronger developer is harder to defeat.
// Range: power=1 → 72 HP,  power=100 → 122 HP.
export function calculateMaxHp(powerLevel: number): number {
  return Math.round(72 + powerLevel * 0.5);
}
