import { bad_words, greetings } from "./words.js";

const words = {
  bad: checkBadWord,
  greetings: checkGreeting,
  default: () => false,
};

/**
 * @param {string} message
 * @param {"bad" | "greetings"} type
 * @returns {boolean}
 */
export function checkWord(message, type) {
  if (typeof words[type] !== "function") {
    return words["default"](message.toLowerCase());
  }
  return words[type](message.toLowerCase());
}
/**
 * @param {string} message
 * @returns {boolean}
 */
function checkBadWord(message) {
  return bad_words.includes(message);
}
/**
 * @param {string} message
 * @returns {boolean}
 */
function checkGreeting(message) {
  return greetings.includes(message);
}
