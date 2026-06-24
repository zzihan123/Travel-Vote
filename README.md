# ✈️ 여행 투표 앱

링크 붙여넣기 → AI 자동입력 → 하트 투표로 숙소/항공권을 고르는 앱

## 파일 구조

```
travel-vote/
├── api/
│   └── fetch-stay.js   ← Claude API 호출 (서버리스 함수)
├── public/
│   └── index.html      ← 프론트엔드
├── vercel.json
└── README.md
```

---

## 🚀 배포 방법 (Vercel)

### 1. GitHub에 올리기
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_ID/travel-vote.git
git push -u origin main
```

### 2. Vercel 연결
1. https://vercel.com 접속 → **Add New Project**
2. GitHub 레포 선택 → Import
3. **Environment Variables** 탭에서 아래 키 추가:

| 이름 | 값 |
|------|-----|
| `ANTHROPIC_KEY` | `sk-ant-api03-...` |

4. **Deploy** 클릭 → 완료!

> Supabase 실시간 동기화도 원하면 `public/index.html` 상단에  
> `SUPABASE_URL`과 `SUPABASE_ANON` 값을 채워주세요.

---

## 🗄️ Supabase 테이블 설정 (선택)

Supabase SQL Editor에서 실행:

```sql
create table stays (
  id         bigserial primary key,
  name       text not null,
  bed        text,
  bath       text,
  station    text,
  price      integer,
  url        text,
  img        text,
  memo       text,
  added_by   text,
  hearts     text[] default '{}',
  created_at timestamptz default now()
);

alter table stays enable row level security;
create policy "public read"   on stays for select using (true);
create policy "public write"  on stays for insert with check (true);
create policy "public update" on stays for update using (true);
```

---

## 기능

- 🔗 아고다 링크 붙여넣기 → AI가 숙소명/침대/화장실/역/금액 자동 입력
- 📋 리스트 표 형식으로 한눈에 비교
- ❤️ 멤버별 하트 투표 → 1위 자동 선정
- 🗺️ 최신순 / 하트순 / 가격순 / 역 이름순 정렬
- 🌙 다크모드 자동 지원
- 🟢 Supabase 연결 시 친구들과 실시간 동기화
