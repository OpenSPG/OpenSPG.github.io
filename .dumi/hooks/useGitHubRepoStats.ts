import { useEffect, useState } from 'react';

export const useGithubRepoStats = (owner: string, repo: string) => {
  const [repoStats, setRepoStats] = useState({ stars: 0, forks: 0 });

  useEffect(() => {
    async function fetchRepoStats() {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
        );
        const repoData = await response.json();
        setRepoStats({
          stars: repoData.stargazers_count,
          forks: repoData.forks,
        });
      } catch (error) {
        console.error('Error fetching repo stats:', error);
      }
    }
    fetchRepoStats();
  }, [owner, repo]);

  return repoStats;
};
