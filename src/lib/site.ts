export const site = {
  name: "U&I TENNIS ACADEMY",
  nameKo: "유앤아이테니스",
  description: "광교테니스, 분당테니스, 실내테니스레슨, 강습전문테니스아카데미",
  phone: "010-9949-6811",
  email: "jinnyher@naver.com",
  kakaoId: "unitennis",
  address: "경기도 용인시 수지구 광교중앙로 302, 7층",
  addressDetail: "(상현동, 블루스퀘어)",
  subway: "신분당선 상현역 2번 출구 도보 10초",
  bankAccount: "010-5344-9722 (우리은행/허진회)",
  since: 2019,
};

export const nav = [
  { href: "/about", label: "아카데미 소개", en: "About" },
  { href: "/facility", label: "시설정보", en: "Facility" },
  { href: "/coaches", label: "강사진 소개", en: "Coaches" },
  { href: "/program", label: "프로그램", en: "Program" },
  { href: "/community", label: "커뮤니티", en: "Community" },
] as const;

export const quote = {
  en: "Of course, I want to be number one. But being happy & healthy is the most important thing.",
  ko: "물론 나는 1위가 되길 원한다. 그러나 행복하고 건강해지는 것이 가장 중요한 것이다.",
  by: "Serena Williams 세레나 윌리암스",
};

export const highlights = [
  { title: "남녀노소", body: "남녀노소 누구든 테니스를 쉽고 즐겁게!" },
  { title: "상현역 2번 출구", body: "광교 신도시 신분당선 상현역 2번출구, 도보 10초!" },
  { title: "지상 7층", body: "초역세권 지상 7층에 정식 규격코트" },
  { title: "어린이 미니코트", body: "입문자와 어린이들을 위한 미니코트!" },
];

export type PriceTable = {
  title: string;
  note?: string;
  columns: string[];
  rows: { time: string; type: string; prices: (string | null)[] }[];
};

/** 원본 프로그램 페이지 가격표 (VAT 포함, 괄호는 1인당 금액) */
export const priceTables: PriceTable[] = [
  {
    title: "평일반",
    columns: ["주1회 (월4회)", "주2회 (월8회)", "주3회 (월12회)"],
    rows: [
      { time: "20분", type: "개인", prices: ["165,000", "275,000", "352,000"] },
      { time: "20분", type: "2인", prices: ["275,000 (137,500)", "418,000 (209,000)", "528,000 (264,000)"] },
      { time: "30분", type: "개인", prices: ["209,000", "352,000", "462,000"] },
      { time: "30분", type: "2인", prices: ["330,000 (165,000)", "528,000 (264,000)", "693,000 (346,500)"] },
    ],
  },
  {
    title: "주말반",
    columns: ["주1회 (월4회)", "주2회 (월8회)"],
    rows: [
      { time: "20분", type: "개인", prices: ["187,000", "319,000"] },
      { time: "20분", type: "2인", prices: ["330,000 (165,000)", "528,000 (264,000)"] },
      { time: "30분", type: "개인", prices: ["231,000", "396,000"] },
      { time: "30분", type: "2인", prices: ["374,000 (187,000)", "561,000 (280,500)"] },
    ],
  },
  {
    title: "쿠폰레슨",
    columns: ["4회 (평일)", "4회 (주말)"],
    rows: [
      { time: "30분", type: "개인", prices: ["231,000", "253,000"] },
      { time: "30분", type: "2인", prices: ["374,000 (187,000)", "418,000 (209,000)"] },
    ],
  },
];

export const specialLessons = [
  { name: "특별레슨", target: "희망", time: "40분", price: "100,000" },
  { name: "원포인트레슨", target: "희망", time: "30분", price: "66,000" },
];

export const coaches = [
  {
    name: "최낙준",
    photo: "/images/coaches/choi.jpg",
    education: ["건국대학교 사범대학부속중학교", "건국대학교 사범대학부속고등학교", "한국체육대학교"],
    career: [
      "전국 종별테니스대회 복식 우승",
      "전국 주니어 테니스대회 단식 3위, 복식 우승",
      "전국 문화체육부장관기 테니스대회 우승",
      "베트남 국제 테니스대회 복식 준우승",
      "전국 추계 대학 테니스대회 우승",
    ],
  },
  {
    name: "한성재",
    photo: "/images/coaches/han.jpg",
    education: ["울산제일중학교", "안성두원공업고등학교", "명지대학교", "안성시청"],
    career: [
      "한국실업테니스연맹전 혼합복식 3위",
      "한국실업회장기테니스대회 복식 3위",
      "전국춘계대학연맹전 복식 3위",
      "전국하계대학연맹전 단식 1위",
      "전국추계대학연맹전 복식 2위",
      "한국대학테니스선수권 복식 3위",
    ],
  },
  {
    name: "김민서",
    photo: "/images/coaches/kim.jpg",
    education: ["서울 중앙여자중학교", "서울 중앙여자고등학교", "명지대학교 재학"],
    career: [
      "한국대학테니스선수권대회 혼복 2위",
      "전국 춘계대학테니스연맹 단체 1위",
      "회장기대회 복식 1위",
      "전국대학대항테니스 단체 2위",
      "회장기 전국남녀중고테니스대회 단체 1위",
    ],
  },
];

export const facilityPhotos = [
  { src: "/images/facility/00_Photo_outside_02.jpg", caption: "건물 외관" },
  { src: "/images/facility/00_Photo_outside.jpg", caption: "건물 외관" },
  { src: "/images/facility/01_Photo_door.jpg", caption: "아카데미 입구" },
  { src: "/images/facility/02_Photo_tools.jpg", caption: "장비" },
  { src: "/images/facility/03_Photo_court1.jpg", caption: "코트 1" },
  { src: "/images/facility/04_Photo_court1_2.jpg", caption: "코트 1" },
  { src: "/images/facility/05_Photo_court2.jpg", caption: "코트 2" },
  { src: "/images/facility/06_Photo_court2_1.jpg", caption: "코트 2" },
  { src: "/images/facility/07_Photo_court2_2.jpg", caption: "코트 2" },
  { src: "/images/facility/08_Photo_court_mach.jpg", caption: "볼머신" },
  { src: "/images/facility/09_Photo_meet.jpg", caption: "미팅룸" },
  { src: "/images/facility/10_Photo_shower1.jpg", caption: "샤워실" },
  { src: "/images/facility/11_Photo_shower2.jpg", caption: "샤워실" },
  { src: "/images/facility/12_Photo_shower3.jpg", caption: "샤워실" },
  { src: "/images/facility/13_Photo_shower4.jpg", caption: "샤워실" },
];

export const heroSlides = [
  { src: "/images/slide-2.jpg", eyebrow: "Indoor Tennis Academy", title: "날씨와 상관없이,\n언제나 테니스" },
  { src: "/images/slide-3.jpg", eyebrow: "Elite Coaching Staff", title: "선수 출신 프로에게\n제대로 배우는 테니스" },
  { src: "/images/slide-1.jpg", eyebrow: "Sanghyeon Station Exit 2", title: "상현역 2번 출구\n도보 10초" },
];
