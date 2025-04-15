export const formatVideosList = (message: string) => {
  return message.replace(/(?=\d+\.\s)/g, "\n");
};
