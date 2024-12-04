/**
 *
 * @param length - length of the unique string
 * @returns
 */
export function generateUniqueString(length = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }

  return uniqueString;
}

import slugify from "slugify";
export function generateSlug(input: string): string {
  return slugify(input, {
    lower: true, // convert to lowercase
    strict: true, // remove special characters
    remove: /[*+~.()'"!:@]/g, // custom remove patterns (optional)
  });
}
