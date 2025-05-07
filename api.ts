import {
  AbsenceSummary,
  GradeRecord,
  LessonType,
  StudentEvent,
} from "./types.ts";

enum HEADERS {
  TOKEN_HEADER = "x-csrf-token",
  COOKIE_HEADER = "set-cookie",
}

export class Client {
  private X_CSRF_TOKEN: string;
  private USER_ID: string;
  private COOKIE: string;

  private semel: string;
  private year: string;
  private username: string;
  private password: string;

  constructor(
    semel: number | string,
    year: number | string,
    username: string,
    password: string
  ) {
    this.semel = semel.toString();
    this.year = year.toString();
    this.username = username.toString();
    this.password = password.toString();
    this.X_CSRF_TOKEN = "";
    this.USER_ID = "";
    this.COOKIE = "";
  }

  /**
   * Logs in the user by sending a POST request to the Mashov API.
   * Sets the X_CSRF_TOKEN, COOKIE, and USER_ID properties upon successful login.
   */
  login = async () => {
    const response = await fetch("https://web.mashov.info/api/login", {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "x-csrf-token": "dc672246-e8b5-c01e-ffc1-f09a5c1f141f",
        Referer: "https://web.mashov.info/students/login",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `{"semel":${this.semel},"year":${this.year},"username":"${this.username}","password":"${this.password}","IsBiometric":false,"appName":"info.mashov.students","apiVersion":"3.20210425","appVersion":3.20210425,"appBuild":3.20210425,"deviceUuid":"chrome","devicePlatform":"chrome","deviceManufacturer":"win","deviceModel":"desktop","deviceVersion":"131.0.0.0"}`,
      method: "POST",
    });
    this.X_CSRF_TOKEN =
      response.headers.get(HEADERS.TOKEN_HEADER)?.toString() ?? "";
    this.COOKIE = response.headers.get(HEADERS.COOKIE_HEADER)?.toString() ?? "";

    const json = await response.json();

    if ((json as { credential: { userId: string } }).credential.userId) {
      this.USER_ID = json.credential.userId;
    }
  };

  /**
   * Fetches the grades of the logged-in user from the Mashov API.
   */
  getGrades = async (): Promise<GradeRecord[]> => {
    const gradesResponse = await fetch(
      `https://web.mashov.info/api/students/${this.USER_ID}/grades`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "x-csrf-token": this.X_CSRF_TOKEN,
          cookie: this.COOKIE,
          Referer: `https://web.mashov.info/students/main/students/${this.USER_ID}/regularGrades`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );

    return (await gradesResponse.json()) as GradeRecord[];
  };

  /**
   * Fetches the behavior events of the logged-in user from the Mashov API.
   */
  getBehaviour = async (): Promise<StudentEvent[]> => {
    const behaveResponse = await fetch(
      `https://web.mashov.info/api/students/${this.USER_ID}/behave`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "x-csrf-token": this.X_CSRF_TOKEN,
          cookie: this.COOKIE,
          Referer: `https://web.mashov.info/students/main/students/${this.USER_ID}/behave`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );

    return (await behaveResponse.json()) as StudentEvent[];
  };

  /**
   * Fetches the lessons history for a given group ID from the Mashov API.
   * @param {string | number} groupId - The group ID
   * @returns {Promise<LessonType[]>} The lessons data
   */
  getLessons = async (groupId: string | number): Promise<LessonType[]> => {
    const lessonsResponse = await fetch(
      `https://web.mashov.info/api/groups/${groupId}/history`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "x-csrf-token": this.X_CSRF_TOKEN,
          cookie: this.COOKIE,
          Referer: `https://web.mashov.info/students/main/students/${this.USER_ID}/behave`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );

    return await lessonsResponse.json();
  };

  /**
   * Returns the average of all grades.
   * NOTE: this isn't accurate, as grades aren't actually calculated like this.
   * @returns {Promise<number>} The grade average
   */
  getAverageGrades = async (): Promise<number> => {
    const grades = await this.getGrades();

    let sum = 0;

    for (const { grade } of grades) {
      sum += grade;
    }

    return sum / grades.length;
  };

  /**
   * Prints the percentage of absences in every subject.
   * @returns {Promise<void>}
   */
  async printAbsences(): Promise<void> {
    const NOT_JUSTIFIED = -1;
    const HEADRUT_NOTICE = "העדרות";

    const behaveTable = await this.getBehaviour();

    const behaveMap = new Map<string, number>();
    const groupMap = new Map<string, string>();

    behaveTable.forEach((notice: StudentEvent) => {
      if (
        notice.achvaName === HEADRUT_NOTICE &&
        notice.justified === NOT_JUSTIFIED
      ) {
        groupMap.set(notice.subject, notice.groupId);
        behaveMap.set(notice.subject, (behaveMap.get(notice.subject) || 0) + 1);
      }
    });

    const lessonsMap = new Map<string, number>();

    await Promise.all(
      Array.from(groupMap.entries()).map(async ([subjectName, groupId]) => {
        const lessons: LessonType[] = await this.getLessons(groupId);
        lessonsMap.set(subjectName, lessons.length);
      })
    );

    lessonsMap.forEach((amountOfLessons, subjectName) => {
      const unjustifiedAbsences = behaveMap.get(subjectName) || 0;
      const percentage = (
        (unjustifiedAbsences * 100) /
        amountOfLessons
      ).toFixed(2);

      console.log(
        `%c${subjectName.split("").reverse().join("")}`,
        "color: gold"
      ); // reverse hebrew
      console.log(`%cUnjust: ${unjustifiedAbsences}`, "color: red");
      console.log(`Total Lessons: ${amountOfLessons}`);
      console.log(`Percentage of missing: ${percentage}%`);
      console.log("\n\n");
    });
  }

  async getAbsenceSummary(): Promise<AbsenceSummary[]> {
    const NOT_JUSTIFIED = -1;
    const HEADRUT_NOTICE = "העדרות";

    const behaveTable = await this.getBehaviour();

    const subjectAbsenceMap = new Map<
      string,
      { count: number; groupId: string }
    >();

    for (const notice of behaveTable) {
      if (
        notice.achvaName === HEADRUT_NOTICE &&
        notice.justified === NOT_JUSTIFIED
      ) {
        const existing = subjectAbsenceMap.get(notice.subject);
        if (existing) {
          existing.count += 1;
        } else {
          subjectAbsenceMap.set(notice.subject, {
            count: 1,
            groupId: notice.groupId,
          });
        }
      }
    }

    const summaries: AbsenceSummary[] = await Promise.all(
      Array.from(subjectAbsenceMap.entries()).map(
        async ([subjectName, { count, groupId }]) => {
          const lessons = await this.getLessons(groupId);
          const totalLessons = lessons.length;
          const percentage =
            totalLessons === 0 ? 0 : (count * 100) / totalLessons;

          return {
            subjectName,
            groupId,
            unjustifiedAbsences: count,
            totalLessons,
            absencePercentage: parseFloat(percentage.toFixed(2)),
          };
        }
      )
    );

    return summaries;
  }
}
