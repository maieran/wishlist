export function generateSilentSantaMatching(userIds: string[]) {
  if (userIds.length < 2) {
    throw new Error("Need at least 2 users to match.");
  }

  let receivers = [...userIds];

  // Try to shuffle valid derangement
  for (let attempts = 0; attempts < 20; attempts++) {
    receivers = shuffle([...receivers]);

    const valid = userIds.every((giver, i) => giver !== receivers[i]);
    if (valid) break;
  }

  // Final fallback: swap any self-match
  for (let i = 0; i < userIds.length; i++) {
    if (userIds[i] === receivers[i]) {
      const swapIndex = (i + 1) % userIds.length;
      [receivers[i], receivers[swapIndex]] = [receivers[swapIndex], receivers[i]];
    }
  }

  const result: Record<string, string> = {};
  userIds.forEach((giver, i) => {
    result[giver] = receivers[i];
  });

  return result;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
