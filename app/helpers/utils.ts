import debug from "debug";

export const createLogger = (name: string) => debug(`http:${name}`);

export const getFilesDir = (): string => {
  const filesDirectoryIndex = process.argv.findIndex((arg) =>
    arg.startsWith("--directory"),
  );

  let filesDirectory = "/tmp/";
  if (filesDirectoryIndex > -1 && process.argv[filesDirectoryIndex + 1]) {
    filesDirectory = process.argv[filesDirectoryIndex + 1];
  }
  return filesDirectory;
};
