export function formatTimeLeft(endsAt) {
  const endTime = new Date(endsAt).getTime();
  const timeLeft = endTime - Date.now();

  if (timeLeft <= 0) {
    return "Ended";
  }

  const days = Math.floor(timeLeft / 86400000);

  if (days >= 1) {
    return days === 1 ? "1 day" : `${days} days`;
  }

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}
