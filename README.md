# U&I Tennis Academy (유앤아이테니스) – 리뉴얼

기존 WordPress(Bridge 테마 + KBoard) 사이트 http://unitennis.co.kr 의 콘텐츠와 기능을 최신 스택으로 다시 만든 프로젝트입니다.

## 스택
- **Next.js 16** (App Router, React 19, Server Actions, Cache Components/PPR, Partial Prefetching)
- **Tailwind CSS v4**, Pretendard + Archivo 폰트
- **SQLite** – Node.js 내장 `node:sqlite` (추가 DB 서버·네이티브 모듈 불필요, Node 24+ 필요)
- 네이티브 Popover API(모바일 메뉴), `<dialog>`(사진 라이트박스), CSS scroll-driven animation, View Transitions

## 실행
```bash
cp .env.example .env.local   # ADMIN_PASSWORD, SESSION_SECRET 설정
npm install
npm run dev                  # http://localhost:3000
# 운영: npm run build && npm start
```
DB와 업로드 파일은 `data/`에 생기며, 첫 실행 시 공지글이 자동 생성됩니다.

## 페이지
| 경로 | 내용 | 기존 URL (301 리다이렉트) |
|---|---|---|
| `/` | 슬라이더, 명언, 소개 카드, 빠른 상담 신청 | `/` |
| `/about` | 아카데미 소개, 오시는 길(지도) | `/about/` |
| `/facility` | 시설 사진 갤러리 | `/gallery/` |
| `/coaches` | 강사진 소개 | `/강사진-소개/` |
| `/program` | 평일/주말/쿠폰/특별 레슨 가격표 | `/프로그램/` |
| `/community` | 강습 문의 게시판 | `/commnunity/`, `?uid=N&mod=document` → `/community/N` |
| `/admin` | 관리자 (상담 신청 관리, 공지 지정, 게시글 삭제) | – |

## 게시판 기능 (KBoard 대응)
- 비회원 글쓰기(작성자·비밀번호), **비밀글**, 공지사항, 썸네일 + 첨부파일 2개(5MB)
- 통합검색(전체/제목/내용/작성자) + 글별 검색 허용 범위, 페이지네이션, 조회수, 새 글 N 배지, 이전/다음 글
- 비밀번호로 열람·수정·삭제, 댓글(비밀번호 삭제), 관리자 답변 댓글 배지
- 스팸 방지: 산수 보안코드 + 허니팟 + 최소 작성시간 (기존 게시판에 스팸 글이 올라와 있던 문제 대응)
- 보안: scrypt 비밀번호 해시, HMAC 서명 쿠키, 비밀글 첨부파일 접근 제어, 본문 HTML 미렌더링(XSS 방지)
