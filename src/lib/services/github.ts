import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  accountAgeDays: number;
  estimatedCommits: number;
}

export async function fetchGitHubUser(username: string): Promise<GitHubStats> {
  try {
    const { data: user } = await octokit.rest.users.getByUsername({ username });
    
    const accountDate = user.created_at ? new Date(user.created_at).getTime() : Date.now() - (1000 * 60 * 60 * 24 * 365);
    const accountAgeDays = Math.max(1, Math.floor((Date.now() - accountDate) / (1000 * 60 * 60 * 24)));
    
    // Since fetching exhaustive commits requires complex API calls mapping repos or GraphQL,
    // we use a fast heuristic for this MVP that estimates impact based on repos, followers, and age.
    const estimatedCommits = (user.public_repos * 42) + Math.floor(accountAgeDays * 0.5) + (user.followers * 5);

    return {
      username: user.login,
      publicRepos: user.public_repos,
      followers: user.followers,
      accountAgeDays,
      estimatedCommits
    };
  } catch (error) {
    console.error(`Error fetching GitHub user ${username}:`, error);
    throw new Error(`Failed to fetch GitHub profile for ${username}. Check if username exists and token is valid.`);
  }
}
