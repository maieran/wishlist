export function getPriorityColor(priority: string) {
  switch (priority) {
    case "red":
      return "#ff4d4d";
    case "blue":
      return "#4d79ff";
    case "green":
      return "#4dff88";
    default:
      return "#ccc";
  }
}
