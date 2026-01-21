
# School-Link 위젯: 학교 업무 간소화 데스크톱 앱

## 1. 전체 구조 및 아키텍처

### 폴더 구조 (Recommended)
- `src/`: React 렌더러 소스
  - `components/`: UI 컴포넌트 (위젯, 모달, 버튼 등)
  - `hooks/`: 비즈니스 로직 (인증, 이벤트 데이터, 설정)
  - `services/`: 백엔드 통신 (Firebase/Supabase 클라이언트)
  - `context/`: 전역 상태 관리 (설정 등)
  - `types.ts`: TypeScript 인터페이스 정의
- `electron/`: 메인 프로세스 (Windows OS 제어)
  - `main.ts`: 창 생성, 트레이 아이콘, Always-on-top 관리
  - `preload.ts`: IPC 브릿지

### 핵심 모듈 설명
1.  **인증 (Auth)**: 교직원 이메일 로그인을 기본으로 하며, 로그인 시 학교 코드(TenantId)를 필수로 연결합니다.
2.  **데이터 (Event Service)**: `visibility` 필드에 따라 개인(private)과 공유(school)를 구분합니다.
3.  **UI/UX**: 좁은 화면에서도 가독성이 좋도록 폰트 크기를 조절하고, 드래그 영역을 명확히 설정했습니다.
4.  **동기화**: Supabase Realtime 또는 Firestore Snapshot을 사용하여 실시간 업데이트를 지원합니다.
5.  **캐시 (Offline Support)**: `localStorage`를 1차 캐시로 사용하여 오프라인에서도 마지막 데이터를 볼 수 있습니다.

---

## 2. 구현 우선순위 (MVP Roadmap)

### 1주차: 코어 기능
- [x] Electron 프로젝트 스캐폴딩 및 위젯 스타일 윈도우 구성
- [x] 기본 UI (달력, 일정 리스트) 레이아웃
- [x] Mock Auth 및 테넌트 연결 플로우

### 2주차: 데이터 및 동기화
- [ ] Supabase/Firebase 연동 및 CRUD
- [ ] 실시간 동기화 (onSnapshot) 및 필터링 기능
- [ ] 트레이 아이콘 및 Always-on-top 토글 실제 구현
- [ ] 알림 발송 로직 추가

---

## 3. 보안 규칙 예시 (Supabase RLS / Firestore Rules)

### Supabase RLS 예시
```sql
-- 개인 일정: 본인만 CRUD 가능
CREATE POLICY "Users can CRUD their own private events"
ON public.events
FOR ALL
USING (auth.uid() = owner_uid AND visibility = 'private');

-- 공유 일정: 같은 테넌트 내 사용자 모두 조회 가능, 수정은 관리자나 본인만
CREATE POLICY "Tenant users can view school events"
ON public.events
FOR SELECT
USING (tenant_id IN (SELECT tenant_id FROM memberships WHERE uid = auth.uid()) AND visibility = 'school');

CREATE POLICY "Owners can update their school events"
ON public.events
FOR UPDATE
USING (auth.uid() = owner_uid);
```

---

## 4. 실행 방법

### 개발 환경 설정
1.  `npm install`
2.  `npm run dev` (Vite 렌더러 실행)
3.  `npm run start` (Electron 메인 프로세스 실행)

### 빌드 및 배포
- `npm run build`: React 빌드
- `npm run package`: OS별 설치 파일(.exe) 생성

## 5. 테스트 체크리스트
- [ ] 부팅 시 자동 실행이 올바르게 설정되는가? (Settings)
- [ ] 다른 창 위에 항상 떠 있는가? (Always-on-top)
- [ ] '공유' 일정 등록 시 다른 계정에서 즉시 보이는가?
- [ ] 오프라인 상태에서 이전에 저장된 일정이 표시되는가?
- [ ] 학교 코드가 없는 사용자는 위젯 기능을 사용할 수 없는가?
