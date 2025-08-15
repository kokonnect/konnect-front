import {
  MessageTemplate,
  MessageTranslation,
  MessageTranslationHistoryItem,
} from "@/types/message";

// Re-export types for convenience
export type {
  MessageTemplate,
  MessageTranslation,
  MessageTranslationHistoryItem,
};

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: "1",
    title: "Absence Notification",
    messageKr:
      "안녕하세요, 제 아이 [아이 이름]이 [날짜]에 [사유]로 인해 학교를 결석하게 됩니다. 결석을 양해해 주시기 바랍니다.",
    messageEn:
      "Hi, my child [Child Name] will be absent from school on [Date] due to [Reason]. Please excuse their absence.",
    category: "absence",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Late Arrival",
    messageKr:
      "안녕하세요, [아이 이름]이 오늘 [사유]로 인해 대략 [시간]에 늦게 등교할 예정입니다.",
    messageEn:
      "Good morning, [Child Name] will be arriving late to school today at approximately [Time] due to [Reason].",
    category: "absence",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Early Dismissal Request",
    messageKr:
      "안녕하세요, [사유]로 인해 오늘 [시간]에 [아이 이름]을 일찍 데려가야 합니다. 사무실에서 준비시켜 주세요.",
    messageEn:
      "Hello, I need to pick up [Child Name] early today at [Time] for [Reason]. Please have them ready in the office.",
    category: "absence",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Homework Question",
    messageKr:
      "안녕하세요, [아이 이름]이 [날짜]에 내주신 [과목] 숙제에 대해 질문이 있습니다. [질문] 내용을 명확히 해주실 수 있나요?",
    messageEn:
      "Hi, [Child Name] has a question about the [Subject] homework assigned on [Date]. Could you please clarify [Question]?",
    category: "homework",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Meeting Request",
    messageKr:
      "안녕하세요, [아이 이름]의 학습 진행 상황에 대해 상담을 요청드리고 싶습니다. [날짜] [시간]에 시간이 되시나요?",
    messageEn:
      "Hello, I would like to schedule a meeting to discuss [Child Name]'s progress. Are you available on [Date] at [Time]?",
    category: "meeting",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Lunch Money Request",
    messageKr:
      "안녕하세요, [아이 이름]이 오늘 점심 도시락을 가져오지 못했습니다. 급식비를 지불하겠습니다.",
    messageEn:
      "Hello, [Child Name] forgot their lunch today. We will pay for the school lunch.",
    category: "concern",
    isFavorite: true,
  },
  {
    id: "7",
    title: "Permission Slip",
    messageKr:
      "안녕하세요, [행사명] 관련 동의서를 보내드립니다. 검토 후 서명하여 보내드리겠습니다.",
    messageEn:
      "Hello, I'm sending the permission slip for [Event Name]. I will review, sign, and return it.",
    category: "other",
    isFavorite: false,
  },
];

export const mockMessageHistory: MessageTranslationHistoryItem[] = [
  {
    id: "1",
    title: "Absence Notification",
    original: "Hello, my child will be absent today due to illness.",
    translated: "안녕하세요, 오늘 저희 아이가 아파서 결석할 예정입니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "2",
    title: "Meeting Request",
    original: "Can we schedule a meeting to discuss my child's progress?",
    translated: "제 아이의 학습 진행 상황에 대해 상담을 예약할 수 있을까요?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "3",
    title: "Thank You Message",
    original: "Thank you for your support with Emma's learning.",
    translated: "Emma의 학습에 대한 선생님의 지원에 감사드립니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "4",
    title: "Late Arrival Notice",
    original:
      "Please excuse Lucas for being late today. We had a doctor's appointment.",
    translated:
      "오늘 Lucas가 병원 예약으로 인해 늦었습니다. 양해 부탁드립니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: "5",
    title: "Field Trip Permission",
    original:
      "I give permission for Emma to attend the field trip to the museum.",
    translated: "Emma가 박물관 현장학습에 참여하는 것을 허락합니다.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
];

// Mock Korean translation
export const mockMessageTranslations: { [key: string]: string } = {
  hello: "안녕하세요",
  "thank you": "감사합니다",
  "my child will be absent today": "오늘 저희 아이가 결석할 예정입니다",
  "can we schedule a meeting": "미팅 일정을 잡을 수 있을까요",
  "My son is feeling unwell today and cannot attend school. I want to inform his homeroom teacher.":
    "안녕하세요, 담임 선생님. 오늘 아들이 몸이 안 좋아서 학교에 못 갈 것 같아요. 양해 부탁드립니다.",
};

// Template categories
export const messageCategories = [
  "all",
  "absence",
  "homework",
  "meeting",
  "concern",
  "other",
];

// Helper function to filter templates by category
export const filterTemplatesByCategory = (
  category: string,
): MessageTemplate[] => {
  if (category === "all") return mockMessageTemplates;
  return mockMessageTemplates.filter(
    (template) => template.category.toLowerCase() === category.toLowerCase(),
  );
};

// Helper function to get favorite templates
export const getFavoriteTemplates = (): MessageTemplate[] => {
  return mockMessageTemplates.filter((template) => template.isFavorite);
};
