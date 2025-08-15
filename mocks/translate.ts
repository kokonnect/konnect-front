import {
  TranslationResult,
  TranslationEvent,
  VocabularyItem,
  TranslationHistoryItem,
  UploadedFile,
} from "@/types/translate";

// Re-export types for convenience
export type {
  TranslationResult,
  TranslationEvent,
  VocabularyItem,
  TranslationHistoryItem,
  UploadedFile,
};

export const mockTranslationResult: TranslationResult = {
  id: "1",
  fileName: "field_trip_notice.pdf",
  datetime: new Date("2025-08-20T09:00:00Z"),
  fileType: "pdf",
  summary:
    "School event notification about upcoming field trip to the Natural History Museum on August 20th, 2025. Permission form and lunch required.",
  fullText:
    "Dear Parents,\n\nWe are excited to announce our annual field trip to the Natural History Museum scheduled for August 20th, 2025. All students are required to bring a packed lunch and wear comfortable walking shoes.\n\nPlease submit the signed permission form by August 15th. The trip will start at 9:00 AM and we will return by 3:00 PM.\n\nBest regards,\nSchool Administration",
  originalText:
    "학부모님께,\n\n2025년 8월 20일로 예정된 자연사 박물관으로의 연례 현장 학습을 알려드리게 되어 기쁩니다. 모든 학생들은 도시락을 지참하고 편안한 운동화를 착용해야 합니다.\n\n8월 15일까지 서명된 동의서를 제출해 주시기 바랍니다. 견학은 오전 9시에 시작하여 오후 3시에 돌아올 예정입니다.\n\n감사합니다,\n학교 행정실",
  events: [
    {
      id: "1",
      title: "Field Trip - Natural History Museum",
      date: "2025-08-20",
      time: "9:00 AM",
      description:
        "Annual school field trip. Bring lunch and wear comfortable shoes.",
    },
    {
      id: "2",
      title: "Permission Form Deadline",
      date: "2025-08-15",
      description: "Submit signed permission form for field trip.",
    },
  ],
  vocabulary: [
    {
      id: "v1",
      korean: "학부모",
      romanization: "hakbumo",
      english: "Parents",
      description: "Parents or guardians of students",
      example: "학부모님께 알려드립니다",
      exampleTranslation: "Notice to parents",
    },
    {
      id: "v2",
      korean: "현장학습",
      romanization: "hyeonjang hakseup",
      english: "Field Trip",
      description: "Educational trip outside of school",
      example: "박물관 현장학습이 있습니다",
      exampleTranslation: "There is a field trip to the museum",
    },
    {
      id: "v3",
      korean: "동의서",
      romanization: "dong-uiseo",
      english: "Permission Form",
      description: "Consent or permission document",
      example: "동의서를 제출해 주세요",
      exampleTranslation: "Please submit the permission form",
    },
    {
      id: "v4",
      korean: "도시락",
      romanization: "dosirak",
      english: "Packed Lunch",
      description: "Lunch box or packed meal",
      example: "도시락을 지참해 주세요",
      exampleTranslation: "Please bring a packed lunch",
    },
  ],
};

export const mockTranslationHistory: TranslationResult[] = [
  {
    id: "1",
    title: "Field Trip Permission Form",
    datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    summary:
      "Annual field trip to Natural History Museum. Permission form and lunch required for all students.",
    fileName: "field_trip_notice.pdf",
    fileType: "pdf",
    confidence: 0.95,
    fullText:
      "Dear Parents,\n\nWe are excited to announce our annual field trip to the Natural History Museum scheduled for August 20th, 2025. All students are required to bring a packed lunch and wear comfortable walking shoes.\n\nPlease submit the signed permission form by August 15th. The trip will start at 9:00 AM and we will return by 3:00 PM.\n\nBest regards,\nSchool Administration",
    originalText:
      "학부모님께,\n\n2025년 8월 20일로 예정된 자연사 박물관으로의 연례 현장 학습을 알려드리게 되어 기쁩니다. 모든 학생들은 도시락을 지참하고 편안한 운동화를 착용해야 합니다.\n\n8월 15일까지 서명된 동의서를 제출해 주시기 바랍니다. 견학은 오전 9시에 시작하여 오후 3시에 돌아올 예정입니다.\n\n감사합니다,\n학교 행정실",
    events: [
      {
        id: "e1",
        title: "Field Trip - Natural History Museum",
        date: "2025-08-20",
        time: "9:00 AM",
        description: "Annual school field trip. Bring lunch and wear comfortable shoes.",
      },
      {
        id: "e2",
        title: "Permission Form Deadline",
        date: "2025-08-15",
        description: "Submit signed permission form for field trip.",
      },
    ],
    vocabulary: [
      {
        id: "v1",
        korean: "학부모",
        romanization: "hakbumo",
        english: "Parents",
        description: "Parents or guardians of students",
        example: "학부모님께 알려드립니다",
        exampleTranslation: "Notice to parents",
      },
      {
        id: "v2",
        korean: "현장학습",
        romanization: "hyeonjang hakseup",
        english: "Field Trip",
        description: "Educational trip outside of school",
        example: "박물관 현장학습이 있습니다",
        exampleTranslation: "There is a field trip to the museum",
      },
    ],
  },
  {
    id: "2",
    title: "Parent-Teacher Conference Notice",
    datetime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    summary:
      "Parent-teacher conference scheduled for next week. Please confirm your availability and discuss your child's academic progress.",
    fileName: "conference_notice.jpg",
    fileType: "image",
    confidence: 0.92,
    fullText:
      "Dear Parents,\n\nWe would like to schedule individual parent-teacher conferences for the week of September 5-9, 2025. These meetings provide an excellent opportunity to discuss your child's academic progress, social development, and any concerns you may have.\n\nPlease reply with your preferred time slot. Each conference will last approximately 20 minutes.\n\nAvailable times:\n- Monday to Friday: 3:30 PM - 6:00 PM\n- Saturday: 9:00 AM - 12:00 PM\n\nSincerely,\nMrs. Johnson\nClass Teacher",
    originalText:
      "학부모님께,\n\n2025년 9월 5일부터 9일까지 개별 학부모-교사 상담을 예정하고 있습니다. 이 면담은 자녀의 학업 진도, 사회성 발달, 그리고 학부모님이 궁금한 사항들을 논의할 수 있는 좋은 기회입니다.\n\n원하시는 시간대를 회신해 주시기 바랍니다. 각 상담은 약 20분간 진행됩니다.\n\n가능한 시간:\n- 월요일부터 금요일: 오후 3시 30분 - 오후 6시\n- 토요일: 오전 9시 - 오후 12시\n\n감사합니다,\n존슨 선생님\n담임교사",
    events: [
      {
        id: "e3",
        title: "Parent-Teacher Conference Week",
        date: "2025-09-05",
        time: "3:30 PM - 6:00 PM",
        description: "Individual meetings to discuss student progress",
      },
    ],
    vocabulary: [
      {
        id: "v3",
        korean: "상담",
        romanization: "sangdam",
        english: "Consultation/Conference",
        description: "Meeting for discussion and advice",
        example: "학부모 상담이 있습니다",
        exampleTranslation: "There is a parent consultation",
      },
      {
        id: "v4",
        korean: "학업",
        romanization: "hageop",
        english: "Academic work/Studies",
        description: "School work and academic activities",
        example: "학업 성취도를 확인합니다",
        exampleTranslation: "Check academic achievement",
      },
    ],
  },
  {
    id: "3",
    title: "School Lunch Menu",
    datetime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    summary:
      "Weekly lunch menu featuring Korean traditional dishes and nutritional information for student meals.",
    fileName: "lunch_menu_week33.pdf",
    fileType: "pdf",
    confidence: 0.98,
    fullText:
      "Weekly Lunch Menu - Week 33\n\nMonday: Korean Rice Bowl (Bibimbap) with mixed vegetables, beef, and spicy sauce\nTuesday: Chicken Teriyaki with steamed rice and miso soup\nWednesday: Fish Cake Soup (Eomuk-guk) with rice and kimchi\nThursday: Pork Bulgogi with lettuce wraps and side dishes\nFriday: Seafood Pancake (Haemul-pajeon) with rice and vegetable soup\n\nAll meals include milk and fresh fruit. Please inform us of any allergies.\n\nNutritional information available upon request.\n\nSchool Cafeteria Team",
    originalText:
      "주간 급식 메뉴 - 33주차\n\n월요일: 비빔밥 (혼합 야채, 소고기, 매운 소스)\n화요일: 데리야키 치킨과 밥, 된장국\n수요일: 어묵국과 밥, 김치\n목요일: 돼지불고기와 상추쌈, 반찬\n금요일: 해물파전과 밥, 야채국\n\n모든 식사에는 우유와 신선한 과일이 포함됩니다. 알레르기가 있으시면 알려주세요.\n\n영양 정보는 요청 시 제공됩니다.\n\n학교 급식팀",
    vocabulary: [
      {
        id: "v5",
        korean: "급식",
        romanization: "geupshik",
        english: "School meal/Cafeteria food",
        description: "Meals provided by school cafeteria",
        example: "오늘 급식 메뉴는 비빔밥입니다",
        exampleTranslation: "Today's school meal menu is bibimbap",
      },
      {
        id: "v6",
        korean: "비빔밥",
        romanization: "bibimbap",
        english: "Mixed rice bowl",
        description: "Korean dish with rice, vegetables, and meat",
        example: "비빔밥은 건강한 음식입니다",
        exampleTranslation: "Bibimbap is healthy food",
      },
      {
        id: "v7",
        korean: "알레르기",
        romanization: "allereugi",
        english: "Allergy",
        description: "Adverse reaction to certain foods",
        example: "땅콩 알레르기가 있습니다",
        exampleTranslation: "I have a peanut allergy",
      },
    ],
  },
  {
    id: "4",
    title: "Sports Day Announcement",
    datetime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    summary:
      "Annual sports day event with various athletic competitions. Students should wear sports uniforms and bring water bottles.",
    fileName: "sports_day_2025.jpg",
    fileType: "image",
    confidence: 0.89,
    fullText:
      "Annual Sports Day - September 15, 2025\n\nDear Students and Parents,\n\nOur annual sports day will be held on September 15, 2025, from 9:00 AM to 4:00 PM at the school playground.\n\nEvents include:\n- Track and field events\n- Team relay races\n- Tug of war\n- Basketball and soccer competitions\n\nStudents must wear sports uniforms and bring water bottles. Parents are welcome to attend and cheer for their children.\n\nIn case of rain, the event will be postponed to September 22, 2025.\n\nPhysical Education Department",
    originalText:
      "연례 체육대회 - 2025년 9월 15일\n\n학생 및 학부모님께,\n\n연례 체육대회가 2025년 9월 15일 오전 9시부터 오후 4시까지 학교 운동장에서 열릴 예정입니다.\n\n경기 종목:\n- 육상 경기\n- 팀 계주\n- 줄다리기\n- 농구 및 축구 경기\n\n학생들은 체육복을 착용하고 물병을 지참해야 합니다. 학부모님들도 참석하셔서 자녀들을 응원해 주시기 바랍니다.\n\n비가 올 경우 2025년 9월 22일로 연기됩니다.\n\n체육부",
    events: [
      {
        id: "e4",
        title: "Annual Sports Day",
        date: "2025-09-15",
        time: "9:00 AM",
        description: "School-wide athletic competitions and events",
      },
    ],
    vocabulary: [
      {
        id: "v8",
        korean: "체육대회",
        romanization: "cheyuk daehoe",
        english: "Sports Day/Athletic meet",
        description: "School event with various sports competitions",
        example: "체육대회에서 달리기를 합니다",
        exampleTranslation: "We run at the sports day",
      },
      {
        id: "v9",
        korean: "응원",
        romanization: "eung-won",
        english: "Cheering/Support",
        description: "Encouraging and supporting someone",
        example: "친구를 응원합니다",
        exampleTranslation: "I cheer for my friend",
      },
    ],
  },
  {
    id: "5",
    title: "School Report Card",
    datetime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    summary:
      "Semester report card showing academic performance across all subjects with teacher comments and recommendations.",
    fileName: "report_card_emma.pdf",
    fileType: "pdf",
    confidence: 0.94,
    fullText:
      "Student Report Card - Emma Johnson\nSemester 1, 2025\n\nSubjects and Grades:\nMathematics: A (95/100) - Excellent problem-solving skills\nKorean Language: B+ (88/100) - Good progress in reading comprehension\nEnglish: A- (92/100) - Strong writing abilities\nScience: A (96/100) - Shows great curiosity and understanding\nSocial Studies: B+ (87/100) - Good participation in discussions\nPhysical Education: A (94/100) - Excellent teamwork and sportsmanship\nArt: A- (91/100) - Creative and imaginative work\n\nTeacher Comments:\nEmma is a dedicated student who consistently puts effort into her studies. She works well with classmates and shows leadership qualities. Continue encouraging her curiosity in science subjects.\n\nRecommendations:\n- Practice more Korean writing exercises\n- Join the school science club\n\nNext Parent Conference: September 10, 2025\n\nHomeroom Teacher: Mrs. Park",
    originalText:
      "학생 성적표 - 엠마 존슨\n2025년 1학기\n\n과목별 성적:\n수학: A (95/100) - 우수한 문제 해결 능력\n국어: B+ (88/100) - 독해력 향상 양호\n영어: A- (92/100) - 뛰어난 작문 실력\n과학: A (96/100) - 높은 호기심과 이해력 보임\n사회: B+ (87/100) - 토론 참여 적극적\n체육: A (94/100) - 우수한 팀워크와 스포츠맨십\n미술: A- (91/100) - 창의적이고 상상력 풍부한 작품\n\n담임 의견:\n엠마는 학습에 꾸준히 노력하는 성실한 학생입니다. 급우들과 잘 어울리며 리더십을 보입니다. 과학 분야에 대한 호기심을 계속 격려해 주시기 바랍니다.\n\n권장사항:\n- 국어 쓰기 연습 더 하기\n- 학교 과학 동아리 가입\n\n다음 학부모 상담: 2025년 9월 10일\n\n담임교사: 박선생님",
    events: [
      {
        id: "e5",
        title: "Parent Conference - Emma's Progress",
        date: "2025-09-10",
        time: "4:00 PM",
        description: "Discuss Emma's academic progress and recommendations",
      },
    ],
    vocabulary: [
      {
        id: "v10",
        korean: "성적표",
        romanization: "seongjeokpyo",
        english: "Report card/Grade report",
        description: "Document showing student's academic performance",
        example: "성적표를 받았습니다",
        exampleTranslation: "I received my report card",
      },
      {
        id: "v11",
        korean: "호기심",
        romanization: "hogisin",
        english: "Curiosity",
        description: "Interest in learning and discovering",
        example: "과학에 대한 호기심이 많습니다",
        exampleTranslation: "I have a lot of curiosity about science",
      },
      {
        id: "v12",
        korean: "권장사항",
        romanization: "gwonjang sahang",
        english: "Recommendations",
        description: "Suggested actions or advice",
        example: "선생님의 권장사항을 따릅니다",
        exampleTranslation: "I follow the teacher's recommendations",
      },
    ],
  },
];

// Helper function to create a mock translation result
export const createMockTranslationResult = (
  overrides?: Partial<TranslationResult>,
): TranslationResult => ({
  ...mockTranslationResult,
  ...overrides,
});

// Helper function to create a mock uploaded file
export const createMockUploadedFile = (
  name: string,
  type: "image" | "pdf",
): UploadedFile => ({
  name,
  type,
  uri: `mock://file/${name}`,
});

// Helper function to get all events from translation history
export const getTranslationEvents = () => {
  const allEvents: TranslationEvent[] = [];
  mockTranslationHistory.forEach((result) => {
    if (result.events) {
      allEvents.push(...result.events);
    }
  });
  return allEvents;
};

// Helper function to get all vocabulary items from translation history
export const getAllVocabulary = () => {
  const allVocabulary: VocabularyItem[] = [];
  mockTranslationHistory.forEach((result) => {
    if (result.vocabulary) {
      allVocabulary.push(...result.vocabulary);
    }
  });
  return allVocabulary;
};

// Helper function to filter translations by file type
export const filterTranslationsByType = (fileType: "image" | "pdf") => {
  return mockTranslationHistory.filter((result) => result.fileType === fileType);
};

// Helper function to get recent translations (last N days)
export const getRecentTranslations = (days: number = 7) => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return mockTranslationHistory.filter((result) => {
    const resultDate = typeof result.datetime === 'string' ? new Date(result.datetime) : result.datetime;
    return resultDate >= cutoffDate;
  });
};
