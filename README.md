# My-Chatbot

## 프로젝트 설명

RAG(Retrieval Augmented Generation) 기반의 지능형 챗봇 웹 애플리케이션입니다. Google Gemini, OpenAI, Anthropic 등 다양한 LLM 모델과 실시간 대화가 가능하며, 문서 기반 검색을 통해 더욱 정확한 답변을 제공합니다.

**개발 기간**: 2025.12월 ~ 2026.01월

**개발 인원**: 1명

## 기술 스택

### Frontend

- Next.js - React 기반 풀스택 프레임워크
- Tailwind CSS - 유틸리티 기반 CSS 프레임워크
- shadcn/ui - 재사용 가능한 컴포넌트 라이브러리
- TanStack Query - 서버 상태 관리 및 캐싱
- Zustand - 클라이언트 상태 관리
- React Hook Form - 폼 상태 관리
- Zod - 스키마 검증 라이브러리

### Backend

- Hono - 경량 고성능 웹 프레임워크
- Zod - 타입 안전 데이터 검증
- Better-Auth - 인증 및 세션 관리
- Drizzle ORM - 타입 안전 ORM

### Database

- PostgreSQL - 관계형 데이터베이스
- pgvector - 벡터 유사도 검색 확장

### AI & External APIs

- Vercel AI SDK - AI 통합 및 스트리밍
- Google Gemini API - Google의 LLM
- OpenAI API - GPT 모델
- Anthropic API - Claude 모델
- OpenAI text-embedding-3-small - 문서 임베딩
- Tavily Search API - 실시간 웹 검색

## 주요 기능

### 1. AI 대화 시스템

- **멀티 모델 지원**: Google Gemini, OpenAI GPT, Anthropic Claude 중 선택 가능
- **실시간 스트리밍**: 응답을 실시간으로 스트리밍하여 빠른 사용자 경험 제공
- **컨텍스트 유지**: 대화 히스토리를 기반으로 문맥을 이해하는 대화
- **멀티모달 지원**: 텍스트, 이미지 등 다양한 형식의 입력 처리

### 2. 사용자 인증 및 보안

- Better-Auth 기반 인증: 안전한 세션 관리
- 소셜 로그인: Google, GitHub OAuth 연동
- 사용자별 데이터 격리: 개인 대화 및 문서 관리

### 3. 대화 관리

- CRUD 기능: 대화 생성, 조회, 수정, 삭제
- 즐겨찾기: 중요한 대화를 즐겨찾기로 저장
- 커서 기반 페이지네이션: 효율적인 대화 기록 로딩
- 대화 검색: 과거 대화 내용 빠르게 찾기

4. RAG (Retrieval Augmented Generation)

- **문서 업로드 및 처리**: 프로그래밍 언어 및 Markdown 등 다양한 형식의 문서 지원
- **벡터 임베딩**: OpenAI embedding 모델을 활용한 문서 벡터화
- **고속 유사도 검색**: pgvector의 HNSW 인덱스 활용
- **컨텍스트 기반 답변**: 업로드된 문서를 참조한 정확한 답변 생성

### 5. 웹 검색 통합

- 실시간 정보 검색: Tavily API를 통한 최신 정보 제공

## 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/diuyuy/my-agent.git

pnpm install
```

### 2. .env 파일 생성

```bash
cp .env.example .env
```

### 3. Database 마이그레이션

```bash
npx drizzle-kit migrate
```

### 4. 개발 서버 실행

```bash
pnpm dev
```
