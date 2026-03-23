"use client";

import { useState, useCallback } from "react";
import {
  Edit3,
  ShieldCheck,
  MessageSquare,
  Copy,
  Check,
  Send,
  RotateCcw,
  User,
  Tag,
  MapPin,
  Users,
  CloudSun,
  Mail,
  Target,
  Sparkles,
  Bell,
  ArrowLeft,
} from "lucide-react";

// Types & Constants

type TabId = "record" | "safety" | "polish";
type ViewMode = "home" | "tool";

const containerStyle: React.CSSProperties = {
  maxWidth: "1100px",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "clamp(24px, 5vw, 120px)",
  paddingRight: "clamp(24px, 5vw, 120px)",
};

const tabs = [
  { id: "record" as TabId, label: "생기부 문구 변환", sub: "생기부", desc: "핵심 키워드로 생기부 문구를 자동 생성합니다", icon: Edit3, color: "#3182F6", bg: "#E8F3FF", cardBg: "from-[#E8F3FF] to-[#D4E8FF]" },
  { id: "safety" as TabId, label: "안전 시나리오 생성", sub: "안전", desc: "체험학습 안전 대책을 자동으로 작성합니다", icon: ShieldCheck, color: "#F04452", bg: "#FFE8EA", cardBg: "from-[#FFE8EA] to-[#FFD4D8]" },
  { id: "polish" as TabId, label: "공문/메시지 교정", sub: "공문/메시지", desc: "격식있는 공문과 메시지로 교정합니다", icon: MessageSquare, color: "#00B493", bg: "#E5F6F2", cardBg: "from-[#E5F6F2] to-[#D0F0E8]" },
];


const areaOptions = [
  { id: "haengbal", label: "행발" },
  { id: "changche", label: "창체" },
  { id: "gyogwa", label: "교과세특" },
];

const keywordPresets: Record<string, string[]> = {
  haengbal: ["리더십 있음","책임감 강함","배려심 깊음","성실함","자기주도적","규칙 준수","봉사활동 적극적","교우관계 원만","감정 조절 잘함","긍정적 태도"],
  changche: ["동아리 활동 적극적","자치회 참여","진로 탐색 열심","봉사 시간 많음","행사 기획 참여","발표력 우수","협동 능력 뛰어남","창의적 아이디어"],
  gyogwa: ["수업 집중도 높음","발표 시 논리적","과제 성실","친구 도와줌","실험 참여 적극적","탐구 능력 우수","독서량 많음","토론 능력 뛰어남","비판적 사고력","문제 해결력 우수"],
};

const activityOptions = ["놀이기구 이용","등산/트레킹","수상 활동","박물관/전시 관람","스포츠 활동","요리 체험","자연 생태 관찰","공장/시설 견학"];
const weatherOptions = [{ id: "sunny", label: "맑음" },{ id: "cloudy", label: "흐림" },{ id: "rainy", label: "비" },{ id: "hot", label: "폭염" }];
const recipientOptions = ["학부모","동료 교사","관리자/교장","교육청"];
const purposeOptions = ["협조 요청","보고","공지/안내","사과/해명","감사"];
const toneOptions = [{ id: "softer", label: "더 부드럽게" },{ id: "formal", label: "더 공적인" },{ id: "concise", label: "더 간결하게" }];

// Mock Data

const mockRecordResults = [
  { label: "표준형", color: "#3182F6", bg: "#E8F3FF", content: "수업 시간에 높은 집중력을 유지하며 교사의 설명을 경청하는 태도가 돋보임. 발표 상황에서 자신의 생각을 논리적으로 전개하여 표현하는 능력이 우수하며, 학습 과제에 대한 성실한 태도로 꾸준히 노력하는 모습을 보임. 또래 학습에서 어려움을 겪는 친구를 자발적으로 도와주는 배려심이 있으며, 이러한 협력적 자세가 학급 내 긍정적인 학습 분위기 형성에 기여함. 자기주도적 학습 역량과 타인에 대한 공감 능력이 조화롭게 발달하고 있어 향후 더욱 성장할 가능성이 높은 학생임." },
  { label: "강조형", color: "#F04452", bg: "#FFE8EA", content: "탁월한 수업 집중력과 논리적 사고력을 바탕으로 학업 역량을 지속적으로 향상시켜 온 학생임. 특히 발표 시 핵심 내용을 체계적으로 정리하여 명확하게 전달하는 역량이 두드러지며, 이는 깊이 있는 사고 과정을 거친 결과물로 평가됨. 과제 수행에 있어 성실성과 완성도가 높으며, 학습 과정에서 어려움을 겪는 동료를 적극적으로 지원하는 나눔의 자세가 돋보임." },
  { label: "요약형", color: "#00B493", bg: "#E5F6F2", content: "수업 집중력이 높고 논리적 발표 능력이 우수함. 과제 수행이 성실하며 또래를 자발적으로 도와주는 배려심을 갖추고 있어 자기주도 학습 역량과 협력적 태도의 균형 잡힌 성장이 기대됨." },
];

const mockSafetyTable = [
  { risk: "미아/이탈 발생", level: "높음", prevention: "조별 인원 확인 체크리스트 준비, 명찰 착용 의무화, 집합 장소 및 시간 반복 교육", response: "즉시 조별 인원 파악 → 안내방송 요청 → 15분 내 미발견 시 112 신고 및 보호자 연락" },
  { risk: "놀이기구 탑승 중 부상", level: "높음", prevention: "탑승 제한 키/나이 사전 확인, 건강 이상자 별도 관리, 놀이기구별 안전 수칙 사전 교육", response: "현장 응급처치 → 119 신고 → 보호자 연락 → 사고 경위 기록" },
  { risk: "식중독/알레르기 반응", level: "중간", prevention: "알레르기 학생 명단 사전 파악, 도시락 위생 관리 안내, 음식 구매 시 성분 확인 교육", response: "증상 확인 및 격리 → 에피펜 보유 학생 확인 → 119 신고 → 보호자 연락" },
  { risk: "폭염/열사병", level: "중간", prevention: "매 60분마다 그늘 휴식, 충분한 음수량 확보, 모자 착용 안내, 열사병 초기 증상 교육", response: "그늘진 곳 이동 → 체온 냉각(물수건) → 의식 확인 → 119 신고" },
];

const mockEmergencyContacts = [
  { role: "인솔 교사(총괄)", contact: "OOO (010-XXXX-XXXX)" },
  { role: "보건 교사", contact: "OOO (010-XXXX-XXXX)" },
  { role: "학교 비상 연락", contact: "교무실 (02-XXX-XXXX)" },
  { role: "현지 응급/경찰", contact: "119 / 112" },
];

const mockPolishResults: Record<string, string> = {
  softer: `안녕하세요, OO 학부모님.

따뜻한 봄날, 가정에 평안이 가득하시기를 바랍니다.

다름이 아니오라, 다가오는 수요일(3월 26일)에 예정된 학부모 상담 일정을 안내드리고자 합니다.

최근 OO 학생이 수업 중 다양한 관심사로 인해 집중하는 데 다소 어려움을 보이고 있습니다. 이는 성장 과정에서 자연스럽게 나타날 수 있는 모습이며, 가정과 학교가 함께 협력하여 OO 학생이 더 집중할 수 있는 환경을 만들어 주면 좋겠다는 생각에 말씀드립니다.

학부모님의 소중한 의견을 듣고 함께 방법을 모색할 수 있는 자리가 되었으면 합니다.

감사합니다.
OOO 교사 드림`,
  formal: `학부모님께

안녕하십니까. OO초등학교 O학년 O반 담임교사 OOO입니다.

2026학년도 1학기 학부모 상담 주간을 맞이하여 아래와 같이 상담 일정을 안내드립니다.

■ 상담 일시: 2026년 3월 26일(수)
■ 상담 장소: O학년 O반 교실
■ 상담 내용: 학생 수업 태도 및 학습 집중도 관련

최근 수업 중 학생의 집중도가 다소 저하된 모습이 관찰되고 있어, 학교와 가정 간 긴밀한 소통을 통해 학생의 학습 환경 개선 방안을 함께 논의하고자 합니다.

상담 참석이 가능하신 시간대를 회신하여 주시면 감사하겠습니다.

OO초등학교 O학년 O반 담임 OOO 배상`,
  concise: `안녕하세요, OO 학부모님.

다음 주 수요일(3/26) 학부모 상담 안내드립니다.
OO 학생의 최근 수업 집중도와 관련하여 말씀 나누고자 합니다.

참석 가능한 시간을 알려주시면 일정을 조율하겠습니다.

감사합니다.
OOO 교사 드림`,
};

const tips: Record<TabId, string> = {
  record: "관찰 사실 위주의 구체적 키워드(3~5개)를 입력하시면 더 자연스러운 문장이 생성됩니다.",
  safety: "장소명과 활동을 구체적으로 작성할수록 위험 분석의 정확도가 높아집니다.",
  polish: "수신인과 목적을 선택하면 상황에 맞는 격식과 톤이 자동 적용됩니다.",
};

// Component

export default function SuperTeacherDemo() {
  const [view, setView] = useState<ViewMode>("home");
  const [activeTab, setActiveTab] = useState<TabId>("record");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [studentName, setStudentName] = useState("");
  const [selectedArea, setSelectedArea] = useState("gyogwa");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [recordResults, setRecordResults] = useState<typeof mockRecordResults | null>(null);

  const [location, setLocation] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedWeather, setSelectedWeather] = useState("");
  const [safetyResult, setSafetyResult] = useState(false);

  const [draft, setDraft] = useState("");
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("softer");
  const [polishResult, setPolishResult] = useState("");

  const openTool = (tabId: TabId) => {
    setActiveTab(tabId);
    setView("tool");
    handleReset(tabId);
  };

  const goHome = () => setView("home");

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCopiedIdx(null);
    setTimeout(() => {
      if (activeTab === "record") setRecordResults(mockRecordResults);
      else if (activeTab === "safety") setSafetyResult(true);
      else setPolishResult(mockPolishResults[tone] || mockPolishResults.softer);
      setIsGenerating(false);
    }, 1500);
  }, [activeTab, tone]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleReset = (tab?: TabId) => {
    const t = tab || activeTab;
    setCopiedIdx(null);
    if (t === "record") { setStudentName(""); setSelectedKeywords([]); setRecordResults(null); }
    else if (t === "safety") { setLocation(""); setStudentCount(""); setSelectedActivities([]); setSelectedWeather(""); setSafetyResult(false); }
    else { setDraft(""); setRecipient(""); setPurpose(""); setPolishResult(""); }
  };

  const toggleKeyword = (kw: string) => setSelectedKeywords((p) => p.includes(kw) ? p.filter((k) => k !== kw) : [...p, kw]);
  const toggleActivity = (act: string) => setSelectedActivities((p) => p.includes(act) ? p.filter((a) => a !== act) : [...p, act]);

  const handleToneChange = (t: string) => {
    setTone(t);
    if (polishResult) {
      setIsGenerating(true);
      setTimeout(() => { setPolishResult(mockPolishResults[t] || mockPolishResults.softer); setIsGenerating(false); }, 800);
    }
  };

  const canGenerate = activeTab === "record" ? studentName.trim() && selectedKeywords.length > 0 : activeTab === "safety" ? location.trim() && selectedActivities.length > 0 : draft.trim();
  const hasResult = activeTab === "record" ? !!recordResults : activeTab === "safety" ? safetyResult : !!polishResult;

  const loadSample = () => {
    if (activeTab === "record") { setStudentName("김민준"); setSelectedArea("gyogwa"); setSelectedKeywords(["수업 집중도 높음", "발표 시 논리적", "친구 도와줌"]); }
    else if (activeTab === "safety") { setLocation("에버랜드"); setStudentCount("120"); setSelectedActivities(["놀이기구 이용", "자연 생태 관찰"]); setSelectedWeather("sunny"); }
    else { setDraft("안녕하세요 선생님\n다음주 수요일에 학부모 상담이 있는데요\n아이가 요즘 수업시간에 좀 산만하고 집중을 못하는 것 같아서\n한번 말씀드리고 싶었어요\n시간 되시면 와주세요"); setRecipient("학부모"); setPurpose("공지/안내"); }
  };

  const at = tabs.find((t) => t.id === activeTab)!;
  const inputCls = "w-full pl-14 pr-6 py-[18px] border border-[#E5E8EB] rounded-2xl focus:ring-2 focus:outline-none bg-[#FAFAFB] text-[16px] text-[#1B1D1F] placeholder:text-[#B0B8C1] transition-all leading-normal tracking-[-0.01em]";

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">

      {/* ===== Header ===== */}
      <header className="bg-white border-b border-[#EAECEF] sticky top-0 z-50">
        <div style={containerStyle} className="h-[72px] flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-[#3182F6] flex items-center justify-center">
              <span className="text-white text-[15px] font-bold">T</span>
            </div>
            <span className="text-[20px] font-extrabold text-[#1B1D1F] tracking-[-0.04em]">Teacher Tools</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="relative w-11 h-11 rounded-full bg-[#F2F4F6] flex items-center justify-center hover:bg-[#E5E8EB] transition-colors">
              <Bell size={19} className="text-[#6B7684]" />
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#F04452] rounded-full text-white text-[10px] font-bold flex items-center justify-center">2</span>
            </button>
            <div className="w-11 h-11 rounded-full bg-[#3182F6] flex items-center justify-center text-white text-[14px] font-bold cursor-pointer">
              DA
            </div>
          </div>
        </div>
      </header>

      {/* ===== HOME VIEW ===== */}
      {view === "home" && (
        <div className="flex-1">

          {/* Hero */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F3FF] via-[#EEF2FF] to-[#E0ECFF]">
            <div className="absolute top-[-80px] left-[-60px] w-[250px] h-[250px] rounded-full bg-[#3182F6]/[0.06]" />
            <div className="absolute top-[10px] right-[8%] w-[180px] h-[180px] rounded-full bg-[#3182F6]/[0.05]" />
            <div className="absolute bottom-[-40px] right-[-30px] w-[220px] h-[220px] rounded-full bg-[#3182F6]/[0.04]" />
            <div className="absolute bottom-[20px] left-[25%] w-[120px] h-[120px] rounded-full bg-white/20" />

            <div style={containerStyle} className="py-20 md:py-28 relative z-10 text-center">
              <h1 className="text-[36px] md:text-[46px] font-extrabold text-[#1B1D1F] leading-[1.35] tracking-[-0.04em]">
                오늘은 어떤 업무를<br />도와드릴까요?
              </h1>
              <p className="text-[17px] md:text-[19px] text-[#6B7684] mt-6 leading-relaxed tracking-[-0.01em]">
                AI가 선생님의 반복 업무를 빠르게 처리해 드립니다
              </p>
            </div>
          </section>

          {/* Tool Cards Section */}
          <div style={containerStyle} className="pt-20 pb-10">
            <h2 className="text-[22px] font-extrabold text-[#1B1D1F] tracking-[-0.03em] mb-10">
              교사 업무를 위한 AI 도구
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => openTool(tab.id)}
                    className="bg-white rounded-3xl border border-[#EAECEF] overflow-hidden hover:shadow-xl hover:border-transparent transition-all text-left group"
                  >
                    <div className={`h-[180px] bg-gradient-to-br ${tab.cardBg} flex items-center justify-center relative`}>
                      <Icon size={56} style={{ color: tab.color }} className="opacity-25 group-hover:opacity-45 transition-opacity group-hover:scale-110 duration-300" />
                      <div className="absolute bottom-4 right-4 w-[70px] h-[70px] rounded-full opacity-10" style={{ backgroundColor: tab.color }} />
                    </div>
                    <div className="p-7">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-[13px] font-bold px-3 py-1 rounded-lg" style={{ color: tab.color, backgroundColor: tab.bg }}>{tab.sub}</span>
                      </div>
                      <p className="text-[18px] font-extrabold text-[#1B1D1F] tracking-[-0.03em]">{tab.label}</p>
                      <p className="text-[14px] text-[#8B95A1] mt-2 tracking-[-0.01em] leading-relaxed">{tab.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ===== TOOL VIEW ===== */}
      {view === "tool" && (
        <main style={containerStyle} className="py-12 flex-1">

          {/* Breadcrumb */}
          <button onClick={goHome} className="flex items-center gap-2 text-[15px] text-[#8B95A1] hover:text-[#4E5968] transition-colors mb-10 group">
            <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" />
            <span>홈으로 돌아가기</span>
          </button>

          {/* Tool Tabs */}
          <div className="flex gap-3 mb-12 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); handleReset(tab.id); }}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[15px] font-bold whitespace-nowrap transition-all ${
                    isActive ? "text-white shadow-lg" : "bg-white text-[#6B7684] border border-[#EAECEF] hover:bg-[#F2F4F6]"
                  }`}
                  style={isActive ? { backgroundColor: at.color } : {}}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Section Title */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: at.bg }}>
              <Sparkles size={22} style={{ color: at.color }} />
            </div>
            <div>
              <h3 className="text-[24px] font-extrabold text-[#1B1D1F] tracking-[-0.04em]">
                {activeTab === "record" && "핵심 키워드 기반 문구 변환기"}
                {activeTab === "safety" && "체험학습 사고 예방 시나리오"}
                {activeTab === "polish" && "공문/메시지 격식 교정기"}
              </h3>
              <p className="text-[15px] text-[#8B95A1] mt-1 tracking-[-0.01em]">{at.desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* LEFT: Input */}
            <div className="space-y-8" key={activeTab + "-input"}>
              <div className="bg-white rounded-3xl shadow-sm border border-[#EAECEF] p-10 animate-fade-in">

                {/* Card Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: at.bg }}>
                      {activeTab === "record" && <Edit3 size={18} style={{ color: at.color }} />}
                      {activeTab === "safety" && <ShieldCheck size={18} style={{ color: at.color }} />}
                      {activeTab === "polish" && <MessageSquare size={18} style={{ color: at.color }} />}
                    </div>
                    <span className="text-[19px] font-extrabold text-[#1B1D1F] tracking-[-0.03em]">
                      {activeTab === "record" && "학생 정보 입력"}
                      {activeTab === "safety" && "체험학습 정보"}
                      {activeTab === "polish" && "메시지 초안"}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={loadSample} className="text-[13px] font-bold px-5 py-2.5 rounded-full transition-all hover:shadow-sm" style={{ color: at.color, backgroundColor: at.bg }}>
                      예시 불러오기
                    </button>
                    <button onClick={() => handleReset()} className="text-[13px] text-[#8B95A1] hover:text-[#4E5968] flex items-center gap-1.5 bg-[#F7F8FA] px-5 py-2.5 rounded-full transition-all">
                      <RotateCcw size={13} /> 초기화
                    </button>
                  </div>
                </div>

                {/* Record */}
                {activeTab === "record" && (
                  <div className="space-y-8">
                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-3 block tracking-[-0.01em]">학생 성명</label>
                      <div className="relative">
                        <User size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B0B8C1]" />
                        <input type="text" className={`${inputCls} focus:ring-[#3182F6]/20 focus:border-[#3182F6]`} placeholder="예: 김민준" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-4 flex items-center gap-2 tracking-[-0.01em]">
                        <Tag size={15} /> 영역 선택
                      </label>
                      <div className="flex gap-3">
                        {areaOptions.map((a) => (
                          <button key={a.id} onClick={() => { setSelectedArea(a.id); setSelectedKeywords([]); }}
                            className={`px-7 py-3.5 rounded-xl text-[15px] font-bold transition-all tracking-[-0.01em] ${
                              selectedArea === a.id ? "text-white shadow-sm" : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                            }`}
                            style={selectedArea === a.id ? { backgroundColor: "#3182F6" } : {}}
                          >{a.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-4 block tracking-[-0.01em]">핵심 키워드 (복수 선택)</label>
                      <div className="flex flex-wrap gap-3">
                        {(keywordPresets[selectedArea] || []).map((kw) => (
                          <button key={kw} onClick={() => toggleKeyword(kw)}
                            className={`px-5 py-3 rounded-full text-[14px] font-semibold transition-all border leading-none tracking-[-0.01em] ${
                              selectedKeywords.includes(kw) ? "text-white border-transparent shadow-sm" : "bg-white text-[#4E5968] border-[#E5E8EB] hover:border-[#3182F6] hover:text-[#3182F6]"
                            }`}
                            style={selectedKeywords.includes(kw) ? { backgroundColor: "#3182F6" } : {}}
                          >{kw}</button>
                        ))}
                      </div>
                    </div>

                    {selectedKeywords.length > 0 && (
                      <div className="rounded-2xl p-6" style={{ backgroundColor: "#E8F3FF" }}>
                        <p className="text-[13px] font-bold mb-2" style={{ color: "#3182F6" }}>
                          선택된 키워드 ({selectedKeywords.length}개)
                        </p>
                        <p className="text-[15px] leading-relaxed tracking-[-0.01em]" style={{ color: "#1B64DA" }}>
                          {selectedKeywords.join("  /  ")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Safety */}
                {activeTab === "safety" && (
                  <div className="space-y-8">
                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-3 block tracking-[-0.01em]">어디로 가시나요?</label>
                      <div className="relative">
                        <MapPin size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B0B8C1]" />
                        <input type="text" className={`${inputCls} focus:ring-[#F04452]/20 focus:border-[#F04452]`} placeholder="예: 에버랜드, 북한산" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-3 block tracking-[-0.01em]">학생 수</label>
                      <div className="relative">
                        <Users size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B0B8C1]" />
                        <input type="number" className={`${inputCls} focus:ring-[#F04452]/20 focus:border-[#F04452]`} placeholder="예: 120" value={studentCount} onChange={(e) => setStudentCount(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-4 block tracking-[-0.01em]">무엇을 하나요? (복수 선택)</label>
                      <div className="flex flex-wrap gap-3">
                        {activityOptions.map((act) => (
                          <button key={act} onClick={() => toggleActivity(act)}
                            className={`px-5 py-3 rounded-full text-[14px] font-semibold transition-all border leading-none tracking-[-0.01em] ${
                              selectedActivities.includes(act) ? "text-white border-transparent shadow-sm" : "bg-white text-[#4E5968] border-[#E5E8EB] hover:border-[#F04452] hover:text-[#F04452]"
                            }`}
                            style={selectedActivities.includes(act) ? { backgroundColor: "#F04452" } : {}}
                          >{act}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-4 flex items-center gap-2 tracking-[-0.01em]">
                        <CloudSun size={15} /> 예상 날씨 (선택)
                      </label>
                      <div className="flex gap-3">
                        {weatherOptions.map((w) => (
                          <button key={w.id} onClick={() => setSelectedWeather(selectedWeather === w.id ? "" : w.id)}
                            className={`px-7 py-3.5 rounded-xl text-[15px] font-bold transition-all tracking-[-0.01em] ${
                              selectedWeather === w.id ? "text-white shadow-sm" : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                            }`}
                            style={selectedWeather === w.id ? { backgroundColor: "#F04452" } : {}}
                          >{w.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Polish */}
                {activeTab === "polish" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="text-[15px] font-bold text-[#4E5968] mb-4 flex items-center gap-2 tracking-[-0.01em]">
                          <Mail size={15} /> 수신인
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {recipientOptions.map((r) => (
                            <button key={r} onClick={() => setRecipient(r)}
                              className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border tracking-[-0.01em] ${
                                recipient === r ? "text-white border-transparent" : "bg-white text-[#4E5968] border-[#E5E8EB] hover:border-[#00B493]"
                              }`}
                              style={recipient === r ? { backgroundColor: "#00B493" } : {}}
                            >{r}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[15px] font-bold text-[#4E5968] mb-4 flex items-center gap-2 tracking-[-0.01em]">
                          <Target size={15} /> 목적
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {purposeOptions.map((p) => (
                            <button key={p} onClick={() => setPurpose(p)}
                              className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border tracking-[-0.01em] ${
                                purpose === p ? "text-white border-transparent" : "bg-white text-[#4E5968] border-[#E5E8EB] hover:border-[#00B493]"
                              }`}
                              style={purpose === p ? { backgroundColor: "#00B493" } : {}}
                            >{p}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[15px] font-bold text-[#4E5968] mb-3 block tracking-[-0.01em]">초안 입력</label>
                      <textarea
                        className="w-full h-52 p-6 border border-[#E5E8EB] rounded-2xl focus:ring-2 focus:ring-[#00B493]/20 focus:border-[#00B493] focus:outline-none resize-none bg-[#FAFAFB] text-[16px] text-[#1B1D1F] placeholder:text-[#B0B8C1] leading-[2] tracking-[-0.01em] transition-all"
                        placeholder={"여기에 메모 수준의 초안을 자유롭게 작성하세요...\n\n예: 내일 학부모 상담인데 아이가 수업시간에 좀 산만해서 얘기하고 싶어요"}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[14px] text-[#B0B8C1]">{draft.length}자</span>
                        <div className="flex items-center gap-2.5">
                          {toneOptions.map((t) => (
                            <button key={t.id} onClick={() => handleToneChange(t.id)}
                              className={`px-5 py-2.5 rounded-full text-[14px] font-bold transition-all border tracking-[-0.01em] ${
                                tone === t.id ? "text-white border-transparent" : "bg-white text-[#4E5968] border-[#E5E8EB] hover:border-[#00B493]"
                              }`}
                              style={tone === t.id ? { backgroundColor: "#00B493" } : {}}
                            >{t.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full py-5 text-white rounded-2xl font-extrabold flex items-center justify-center gap-3 disabled:bg-[#E5E8EB] disabled:text-[#ADB5BD] disabled:cursor-not-allowed transition-all text-[17px] tracking-[-0.02em] disabled:shadow-none hover:brightness-105"
                style={{
                  backgroundColor: canGenerate && !isGenerating ? at.color : undefined,
                  boxShadow: canGenerate && !isGenerating ? `0 6px 24px ${at.color}30` : undefined,
                }}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    AI가 생성 중...
                  </>
                ) : (
                  <><Send size={20} /> 결과 생성하기</>
                )}
              </button>

              {/* Tip */}
              <div className="bg-white rounded-2xl border border-[#EAECEF] px-7 py-6 flex items-start gap-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[12px] font-extrabold text-[#FF9800]">TIP</span>
                </div>
                <p className="text-[15px] text-[#6B7684] leading-[1.9] tracking-[-0.01em]">{tips[activeTab]}</p>
              </div>
            </div>

            {/* RIGHT: Output */}
            <div className="space-y-8 animate-fade-in" key={activeTab + "-output"}>

              {/* Empty */}
              {!hasResult && !isGenerating && (
                <div className="bg-white rounded-3xl border border-[#EAECEF] shadow-sm min-h-[580px] flex flex-col items-center justify-center">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center mb-7" style={{ backgroundColor: at.bg }}>
                    <Sparkles size={38} style={{ color: at.color }} className="opacity-40" />
                  </div>
                  <p className="text-[20px] font-extrabold text-[#1B1D1F] tracking-[-0.03em]">AI 결과가 여기에 표시됩니다</p>
                  <p className="text-[15px] text-[#B0B8C1] mt-3 tracking-[-0.01em]">
                    &apos;예시 불러오기&apos;를 눌러 빠르게 체험해 보세요
                  </p>
                </div>
              )}

              {/* Loading */}
              {isGenerating && (
                <div className="bg-white rounded-3xl border border-[#EAECEF] shadow-sm min-h-[580px] flex flex-col items-center justify-center">
                  <div className="flex gap-3 mb-6">
                    <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: at.color, animationDelay: "0ms" }} />
                    <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: at.color, animationDelay: "150ms" }} />
                    <div className="w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: at.color, animationDelay: "300ms" }} />
                  </div>
                  <p className="text-[17px] text-[#4E5968] tracking-[-0.01em]">AI가 결과를 생성하고 있어요</p>
                </div>
              )}

              {/* Record Results */}
              {activeTab === "record" && recordResults && !isGenerating && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[19px] font-extrabold text-[#1B1D1F] tracking-[-0.03em]">생성 결과</span>
                    <span className="text-[13px] text-[#8B95A1] bg-[#F2F4F6] px-4 py-2 rounded-full font-semibold">{recordResults.length}개 버전</span>
                  </div>
                  {recordResults.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-[#EAECEF] shadow-sm p-8 hover:shadow-md transition-all animate-fade-in" style={{ animationDelay: `${idx * 120}ms` }}>
                      <div className="flex justify-between items-center mb-5">
                        <span className="text-[14px] font-bold px-4 py-2 rounded-xl" style={{ color: item.color, backgroundColor: item.bg }}>{item.label}</span>
                        <button onClick={() => handleCopy(item.content, idx)} className="text-[#B0B8C1] hover:text-[#3182F6] flex items-center gap-2 text-[14px] font-semibold transition-colors tracking-[-0.01em]">
                          {copiedIdx === idx ? <><Check size={16} className="text-[#00B493]" /> 복사됨</> : <><Copy size={16} /> 복사하기</>}
                        </button>
                      </div>
                      <p className="text-[16px] text-[#333D4B] leading-[2.1] tracking-[-0.01em]">{item.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Safety Table */}
              {activeTab === "safety" && safetyResult && !isGenerating && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[19px] font-extrabold text-[#1B1D1F] tracking-[-0.03em]">위험 분석 결과</span>
                    <button
                      onClick={() => {
                        const text = mockSafetyTable.map(r => `[${r.risk}] 위험도: ${r.level}\n사전교육: ${r.prevention}\n사고시 조치: ${r.response}`).join("\n\n") + "\n\n[비상 연락 체계]\n" + mockEmergencyContacts.map(c => `${c.role}: ${c.contact}`).join("\n");
                        handleCopy(text, 99);
                      }}
                      className="text-[#B0B8C1] hover:text-[#F04452] flex items-center gap-2 text-[14px] font-semibold transition-colors tracking-[-0.01em]"
                    >
                      {copiedIdx === 99 ? <><Check size={16} className="text-[#00B493]" /> 복사됨</> : <><Copy size={16} /> 전체 복사</>}
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#EAECEF] shadow-sm overflow-hidden animate-fade-in">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#FAFAFB]">
                          <th className="text-left py-5 px-6 text-[14px] font-bold text-[#6B7684] border-b border-[#EAECEF] w-[22%]">발생 가능한 위험</th>
                          <th className="text-left py-5 px-6 text-[14px] font-bold text-[#6B7684] border-b border-[#EAECEF] w-[39%]">사전 교육 내용</th>
                          <th className="text-left py-5 px-6 text-[14px] font-bold text-[#6B7684] border-b border-[#EAECEF] w-[39%]">사고 시 조치</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockSafetyTable.map((row, idx) => (
                          <tr key={idx} className="border-b border-[#F2F4F6] last:border-b-0 hover:bg-[#FAFAFB] transition-colors">
                            <td className="py-6 px-6 align-top">
                              <div className="font-bold text-[15px] text-[#1B1D1F] leading-snug">{row.risk}</div>
                              <span className={`inline-block mt-2.5 text-[12px] font-bold px-3 py-1 rounded-full ${
                                row.level === "높음" ? "bg-[#FFE8EA] text-[#F04452]" : "bg-[#FFF8E1] text-[#FFA726]"
                              }`}>{row.level}</span>
                            </td>
                            <td className="py-6 px-6 text-[15px] text-[#4E5968] leading-[1.9] align-top">{row.prevention}</td>
                            <td className="py-6 px-6 text-[15px] text-[#4E5968] leading-[1.9] align-top">{row.response}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#EAECEF] shadow-sm p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                    <p className="text-[17px] font-extrabold text-[#1B1D1F] mb-5 tracking-[-0.02em]">비상 연락 체계</p>
                    <div className="grid grid-cols-2 gap-3.5">
                      {mockEmergencyContacts.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-[#FAFAFB] rounded-xl px-6 py-4">
                          <span className="text-[14px] font-bold text-[#6B7684] shrink-0">{c.role}</span>
                          <span className="text-[15px] text-[#1B1D1F]">{c.contact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Polish Result */}
              {activeTab === "polish" && polishResult && !isGenerating && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[19px] font-extrabold text-[#1B1D1F] tracking-[-0.03em]">교정 결과</span>
                    <button onClick={() => handleCopy(polishResult, 0)} className="text-[#B0B8C1] hover:text-[#00B493] flex items-center gap-2 text-[14px] font-semibold transition-colors tracking-[-0.01em]">
                      {copiedIdx === 0 ? <><Check size={16} className="text-[#00B493]" /> 복사됨</> : <><Copy size={16} /> 전체 복사</>}
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#EAECEF] shadow-sm p-10 animate-fade-in">
                    <p className="text-[16px] text-[#333D4B] leading-[2.2] whitespace-pre-wrap tracking-[-0.01em]">{polishResult}</p>
                  </div>
                </div>
              )}

              {hasResult && !isGenerating && (
                <p className="text-[14px] text-[#B0B8C1] text-center mt-2 tracking-[-0.01em]">
                  AI가 생성한 결과입니다. 최종 사용 전 반드시 내용을 검토해 주세요.
                </p>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ===== Footer ===== */}
      <footer className="bg-white border-t border-[#EAECEF] mt-auto">
        <div style={containerStyle} className="py-10 flex items-center justify-between">
          <p className="text-[14px] text-[#B0B8C1] tracking-[-0.01em]">&copy; 2026 Teacher Tools - AI 기반 교사 업무 도우미 (Demo)</p>
          <p className="text-[13px] text-[#D1D6DB] tracking-[-0.01em]">Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}
