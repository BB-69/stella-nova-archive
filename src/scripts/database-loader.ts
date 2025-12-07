import type { ItemData } from "./structs/item-data";

type FileType = "json" | "webp" | "jpg" | "png";

export interface FetchedFile {
  url: string;
  item: ItemData | string;
}

const baseUrl: string = "https://raw.githubusercontent.com";
const owner: string = "BB-69";
const repo: string = "stella-nova-archive-db";
const branch: string = "main";

async function _TestRepositoryAccess(): Promise<void> {
  try {
    const rootUrl = `${baseUrl}/${owner}/${repo}/${branch}/fileIndex.json`;
    console.log("Fetching Database:", rootUrl);

    const response = await fetch(rootUrl);

    console.log("Response status:", response.status);

    if (response.ok) {
      console.log("Good response.");
      // const rootContents = await response.json();
      // console.log("Paths:", rootContents);
    } else {
      const errorText = await response.text();
      console.log("Error response:", errorText);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

_TestRepositoryAccess();

async function FetchContent(url: string, type: FileType) {
  switch (type) {
    case "json":
      const res = await fetch(url);
      return await res.json();
    case "webp":
    case "jpg":
    case "png":
      return url;
  }
}

async function FetchFilesFromFolder(
  folderPath: string,
  fileType: FileType,
  offset?: number,
  limit?: number
): Promise<FetchedFile[] | null> {
  try {
    const indexRes = await fetch(
      `${baseUrl}/${owner}/${repo}/${branch}/fileIndex.json`
    );
    const allFiles: string[] = await indexRes.json();

    const filteredFiles = allFiles.filter(
      (file) =>
        file.startsWith(folderPath) &&
        file.toLowerCase().endsWith(`.${fileType}`)
    );

    if (offset == null) offset = 0;
    if (offset > filteredFiles.length - 1) return null;
    const batch = filteredFiles.slice(
      offset,
      offset + (limit ?? filteredFiles.length)
    );

    return Promise.all(
      batch.map(async (file) => {
        const url = `${baseUrl}/${owner}/${repo}/${branch}/${file}`;
        const item = await FetchContent(url, fileType);
        return { url, item };
      })
    );
  } catch (error) {
    console.error("Error fetching files:", error);
    return null;
  }
}

export { FetchFilesFromFolder };
