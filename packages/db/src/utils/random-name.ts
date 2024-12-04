import { colors, names, uniqueNamesGenerator } from "unique-names-generator";

export const generateRandomName = () => {
  return uniqueNamesGenerator({
    dictionaries: [colors, names],
    separator: "-",
    style: "lowerCase",
  });
};
