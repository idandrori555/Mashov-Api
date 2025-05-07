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

export type GradeRecord = {
  year: number;
  studentGuid: string;
  gradingEventId: number;
  grade: number;
  rate: number;
  timestamp: string; // ISO datetime string
  teacherName: string;
  groupId: number;
  groupName: string;
  subjectName: string;
  groupLevel: string;
  eventDate: string; // ISO date string
  id: number;
  gradingPeriod: number;
  gradingEvent: string;
  gradeRate: number;
  gradeTypeId: number;
  gradeType: string;
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

export type AbsenceSummary = {
  subjectName: string;
  groupId: string;
  unjustifiedAbsences: number;
  totalLessons: number;
  absencePercentage: number;
};
