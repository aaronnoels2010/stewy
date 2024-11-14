export function formatDateString(dateString: string) {
  // Parse the date string to a Date object
  let date = new Date(dateString);

  // Extract the date components
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  let day = String(date.getDate()).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the date and time in the desired format
  let formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDateString;
}
