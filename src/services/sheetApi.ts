import type { LeaderboardEntry } from '../types';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbylLjsHuTcbVh3mzD5z8G2ZQfKOa3GkTJn_jeQdDd4Q8DydZ8fkut_25_KNDWAzce6-Wg/exec';

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

export async function updateUserLocation(username: string, location: string) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        action: 'updateLocation',
        location,
      }),
    });
    console.log('Location updated');
  } catch (error) {
    console.error('Failed to update location:', error);
  }
}

export async function redeemCode(username: string, code: string): Promise<{ success: boolean; xp?: number; error?: string }> {
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        action: 'redeemCode',
        code,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to redeem code:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function fetchUserByUsername(username: string): Promise<LeaderboardEntry | null> {
  try {
    const leaderboard = await fetchLeaderboard();
    const user = leaderboard.find(entry => entry.username === username);
    return user || null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
