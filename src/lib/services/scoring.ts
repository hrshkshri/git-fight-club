import { GitHubStats } from './github';

export function calculatePowerLevel(stats: GitHubStats): number {
  // Formula: Power Level = (commits × 0.25) + (public_ratio × 0.30) + (consistency × 0.20) + (quality × 0.15) + (influence × 0.10)
  
  // 1. Commits (Max 100)
  const commitsScore = Math.min(stats.estimatedCommits / 50, 100) * 0.25;
  
  // 2. Public Repositories (Max 100)
  const reposScore = Math.min(stats.publicRepos * 3, 100) * 0.30;
  
  // 3. Consistency (Age in days, max 100 points for ~5 years)
  const consistencyScore = Math.min(stats.accountAgeDays / 18, 100) * 0.20;
  
  // 4. Code Quality (Randomized slightly for dynamic battle variation)
  // In a real app, this could be PR approval rates or test coverage
  const qualityScore = (50 + Math.random() * 50) * 0.15; 
  
  // 5. Influence (Followers, max 100 points for ~100 followers)
  const influenceScore = Math.min(stats.followers * 2, 100) * 0.10;

  const totalScore = Math.floor(commitsScore + reposScore + consistencyScore + qualityScore + influenceScore);
  
  // Ensure power level is mapped cleanly from 1 to 100
  return Math.max(1, Math.min(100, totalScore));
}
