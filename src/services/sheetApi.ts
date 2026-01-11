import type { LeaderboardEntry } from '../types';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzKCdYc2FO7bytUscm9qdEE06CvMrC0QfHKZPYvi-x8JAKP2c22-uyICY0ulcDVQZUCZg/exec';

export async function recordProgress(data: {
  username: string;
  chapter: string;
  score: string;
  xp: number;
  isSuperMember?: boolean;
}) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('Progress recorded to Google Sheets');
  } catch (error) {
    console.error('Failed to record progress:', error);
  }
}

export async function updateMemberStatus(username: string, isSuperMember: boolean) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        action: 'updateMemberStatus',
        isSuperMember,
      }),
    });
    console.log('Member status updated');
  } catch (error) {
    console.error('Failed to update member status:', error);
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(SHEET_URL, {
      method: 'GET',
    });
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}
