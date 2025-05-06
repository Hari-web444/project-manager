// Example `iat` value from JWT (in seconds, as you mentioned)
const iat = 1746525583;

// Convert `iat` value from seconds to milliseconds
const issuedAt = iat * 1000; // Converting from seconds to milliseconds

// Create a Date object using the timestamp (UTC)
const loginDate = new Date(issuedAt);

// Convert UTC to IST (Indian Standard Time: UTC + 5:30)
loginDate.setMinutes(loginDate.getMinutes() + 330); // Add 330 minutes (5 hours 30 minutes) for IST

// Format the login time to a readable string in 12-hour format (e.g., 09:37 AM)
const formattedLoginTime = loginDate.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true, // AM/PM format
});

// Format the login date in `Day, DD-MM-YYYY` format
const formattedLoginDate = loginDate.toLocaleDateString("en-IN", {
  weekday: "long", // Full day name
  day: "2-digit",  // Day in two digits
  month: "2-digit", // Month in two digits
  year: "numeric",  // Full year
});

// Print the formatted login date and time
console.log("Formatted Login Date in IST:", formattedLoginDate);
console.log("Formatted Login Time in IST:", formattedLoginTime);
