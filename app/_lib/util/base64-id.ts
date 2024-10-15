import { urlAlphabet, customAlphabet } from "nanoid";

const ID_LENGTH = 24;

export const base64ID = customAlphabet(urlAlphabet, ID_LENGTH);
