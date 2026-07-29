/*
Checks whether a message contains valid content.
A valid message:
    - must be a string
    - cant be empty or contain only spaces
    - cannot be longer than 500 characters
@param {*} message - The message content to validate.
@returns {boolean} True when the message is valid; otherwise false.
 */
export function validateMessage(message) {
  if (typeof message !== "string") {
    return false;
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return false;
  }

  if (trimmedMessage.length > 500) {
    return false;
  }

  return true;
}