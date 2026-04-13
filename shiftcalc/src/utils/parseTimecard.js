export function parseTimecardText(text) {
const dateMatch = text.match(/Date:\s*([0-9-]+)/i);
const startMatch = text.match(/Start:\s*([0-9:]+)/i);
const endMatch = text.match(/End:\s*([0-9:]+)/i);
const breakMatch = text.match(/Break:\s*(\d+)/i);
const rateMatch = text.match(/Rate:\s*(\d+(\.\d+)?)/i);

return {
date: dateMatch ? dateMatch[1] : "",
startTime: startMatch ? startMatch[1] : "",
endTime: endMatch ? endMatch[1] : "",
breakMinutes: breakMatch ? breakMatch[1] : "",
hourlyRate: rateMatch ? rateMatch[1] : "",
};
}