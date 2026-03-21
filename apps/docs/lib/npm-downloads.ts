const NPM_DOWNLOADS_URL =
  "https://api.npmjs.org/downloads/point/last-week/better-ts-stack";

interface NpmDownloadsResponse {
  downloads: number;
  end: string;
  package: string;
  start: string;
}

export interface WeeklyDownloads {
  downloads: number;
  end: string;
  start: string;
}

export async function getWeeklyDownloads(): Promise<WeeklyDownloads | null> {
  try {
    const response = await fetch(NPM_DOWNLOADS_URL, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Partial<NpmDownloadsResponse>;

    if (
      typeof data.downloads !== "number" ||
      typeof data.start !== "string" ||
      typeof data.end !== "string"
    ) {
      return null;
    }

    return {
      downloads: data.downloads,
      end: data.end,
      start: data.start,
    };
  } catch {
    return null;
  }
}
