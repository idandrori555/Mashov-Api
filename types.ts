export type StudentEvent = {
  studentGuid: string;
  eventCode: number;
  justified: number;
  lessonId: number;
  reporterGuid: string;
  timestamp: string;
  groupId: string;
  lessonType: number;
  lesson: number;
  lessonDate: string;
  lessonReporter: string;
  achvaCode: number;
  achvaName: string;
  achvaAval: number;
  justificationId: number;
  justification: string;
  reporter: string;
  subject: string;
};

export type LessonType = {
  groupId: number;
  subjectName: string;
  groupName: string;
  lessonId: number;
  lesson: number;
  lessonDate: string;
  reporterGuid: string;
  tookPlace: boolean;
  remark: string;
};

export type MashovLoginData = {
  semel: number;
  year: number;
  username: string;
  password: string;
};