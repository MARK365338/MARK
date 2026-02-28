/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  GoogleGenAI, 
  Type,
  GenerateContentResponse
} from "@google/genai";
import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Trophy, 
  Users, 
  User as UserIcon, 
  Flame, 
  Zap, 
  Search, 
  Plus, 
  Check, 
  X, 
  MessageCircle,
  Clock,
  ChevronRight,
  Award,
  Sword,
  Bot,
  Sparkles,
  Send,
  Trash2,
  Edit3,
  BookOpen,
  Star,
  Lock,
  Gift,
  Heart,
  BrainCircuit,
  FileText,
  Loader2
} from 'lucide-react';
import { User, Question, BattleState } from './types';

// --- Mock Data ---
const MOCK_USER: User = {
  id: 'me',
  name: '金蝉学霸',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  examType: 'CFA',
  level: 12,
  xp: 2450,
  streak: 7,
  studyMinutes: 120,
  status: 'online'
};

const MOCK_FRIENDS: User[] = [
  {
    id: '1',
    name: '王小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    examType: 'CFA',
    level: 15,
    xp: 3200,
    streak: 12,
    studyMinutes: 300,
    status: 'studying'
  },
  {
    id: '2',
    name: '李华',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    examType: 'CPA',
    level: 10,
    xp: 1800,
    streak: 3,
    studyMinutes: 180,
    status: 'offline',
    lastActive: '2小时前'
  },
  {
    id: '3',
    name: '张金融',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    examType: 'FRM',
    level: 8,
    xp: 1200,
    streak: 5,
    studyMinutes: 0,
    status: 'online'
  }
];

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '下列哪项是 CAPM 模型的核心假设？',
    options: ['投资者可以无风险利率借贷', '市场是完全竞争的', '所有投资者都是风险厌恶的', '以上都是'],
    correctIndex: 3,
    explanation: 'CAPM模型假设市场是完美的，投资者理性且风险厌恶。'
  },
  {
    id: 'q2',
    text: '有效前沿上的投资组合具有什么特征？',
    options: ['风险最低', '收益最高', '给定风险水平下收益最高', '给定收益水平下风险最高'],
    correctIndex: 2,
    explanation: '有效前沿代表了在特定风险水平下能获得的最高预期收益。'
  },
  {
    id: 'q3',
    text: '夏普比率（Sharpe Ratio）的计算公式是？',
    options: ['(组合收益-无风险收益)/组合标准差', '(组合收益-无风险收益)/Beta', '组合收益/组合标准差', '无风险收益/组合标准差'],
    correctIndex: 0,
    explanation: '夏普比率衡量的是每单位总风险所获得的超额收益。'
  },
  {
    id: 'q4',
    text: '下列哪项不是行为金融学中的认知偏差？',
    options: ['过度自信', '锚定效应', '风险厌恶', '确认偏差'],
    correctIndex: 2,
    explanation: '风险厌恶是传统金融学的基本假设，而非常规意义上的认知偏差。'
  },
  {
    id: 'q5',
    text: '久期（Duration）衡量的是？',
    options: ['债券的到期时间', '债券价格对利率变化的敏感性', '债券的信用风险', '债券的票面利率'],
    correctIndex: 1,
    explanation: '久期是衡量债券价格对市场利率变动敏感程度的指标。'
  }
];

// --- Components ---

// --- Utilities ---
const playPopSound = () => {
  const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-37a.mp3');
  audio.volume = 0.2;
  audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: '首页', color: 'bg-[#ff4b4b]', borderColor: 'border-[#d33131]', iconColor: 'text-white', boxColor: 'bg-[#e5f6ff]' },
    { id: 'learn', icon: BookOpen, label: '学习', color: 'bg-[#58cc02]', borderColor: 'border-[#46a302]', iconColor: 'text-white', boxColor: 'bg-[#ddf4ff]' },
    { id: 'ai', icon: Bot, label: 'AI 答疑', color: 'bg-[#ffc800]', borderColor: 'border-[#e5a400]', iconColor: 'text-white', boxColor: 'bg-[#fff4d1]' },
    { id: 'friends', icon: Users, label: '好友', color: 'bg-[#ff86d0]', borderColor: 'border-[#e35da8]', iconColor: 'text-white', boxColor: 'bg-[#ffebf7]' },
    { id: 'profile', icon: UserIcon, label: '我的', color: 'bg-[#ce82ff]', borderColor: 'border-[#a560d8]', iconColor: 'text-white', boxColor: 'bg-[#f3e8ff]' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-2 border-duo-gray-light px-2 py-3 flex justify-around items-center z-50">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            setActiveTab(tab.id);
            playPopSound();
          }}
          className="relative flex flex-col items-center group"
        >
          <div className={`w-14 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
            activeTab === tab.id 
              ? `${tab.color} ${tab.borderColor} shadow-[0_4px_0_0_rgba(0,0,0,0.1)]` 
              : `bg-transparent border-transparent`
          }`}>
            <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : ''}`}>
              <tab.icon 
                size={28} 
                strokeWidth={3} 
                className={activeTab === tab.id ? 'text-white' : 'text-duo-gray'} 
              />
            </div>
          </div>
          <span className={`text-[10px] font-black mt-1 transition-colors ${
            activeTab === tab.id ? 'text-duo-blue' : 'text-duo-gray'
          }`}>
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <motion.div 
              layoutId="nav-indicator"
              className="absolute -bottom-1 w-2 h-2 bg-duo-blue rounded-full"
            />
          )}
        </motion.button>
      ))}
    </nav>
  );
};

const Header = ({ user }: { user: User }) => (
  <header className="sticky top-0 bg-white z-40 px-4 py-3 flex justify-between items-center border-b-2 border-duo-gray-light">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1 text-duo-orange font-bold">
        <Flame size={20} fill="currentColor" />
        <span>{user.streak}</span>
      </div>
      <div className="flex items-center gap-1 text-duo-blue font-bold">
        <Zap size={20} fill="currentColor" />
        <span>{user.xp}</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-duo-blue-dark overflow-hidden border-2 border-duo-blue">
        <img src={user.avatar} alt="avatar" referrerPolicy="no-referrer" />
      </div>
    </div>
  </header>
);

// --- Pages ---

const HomePage = ({ onStartPK, friends }: { onStartPK: () => void, friends: User[] }) => {
  return (
    <div className="p-4 pb-24 space-y-6">
      <section className="space-y-4">
        <h2 className="text-xl font-bold">今日目标</h2>
        <div className="duo-card flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-8 border-duo-gray-light flex items-center justify-center text-duo-blue font-bold">
            60%
          </div>
          <div>
            <p className="font-bold">完成 50 道题</p>
            <p className="text-sm text-duo-gray">已完成 30 道，加油！</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">快速开始</h2>
        <div 
          onClick={onStartPK}
          className="duo-button-primary w-full flex items-center justify-center gap-3 py-6 text-xl"
        >
          <Sword size={28} />
          1v1 巅峰对战
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">学习动态</h2>
        <div className="space-y-3">
          {friends.slice(0, 2).map(friend => (
            <div key={friend.id} className="duo-card flex items-start gap-3">
              <img src={friend.avatar} className="w-10 h-10 rounded-full border border-duo-gray-light" alt="" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold">{friend.name}</span> 刚刚完成了 <span className="text-duo-blue font-bold">CFA 一级</span> 模拟考
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-xs text-duo-gray hover:text-duo-red transition-colors">
                    <Flame size={14} /> 赞
                  </button>
                  <button className="flex items-center gap-1 text-xs text-duo-gray">
                    <MessageCircle size={14} /> 评论
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const FriendsPage = ({ onChallenge, friends, onDeleteFriend }: { onChallenge: (u: User) => void, friends: User[], onDeleteFriend: (id: string) => void }) => {
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSearch = () => {
    if (search.trim()) {
      setIsSearching(true);
      setHasRequested(false);
    } else {
      setIsSearching(false);
    }
  };

  const searchResult = {
    name: '金融小天才',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
    examType: 'CFA',
    info: '备考 CFA 一级 · 正在努力中'
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-duo-gray" size={18} />
          <input 
            type="text" 
            placeholder="输入好友 ID (如: 8888)..." 
            className="w-full bg-duo-bone border-2 border-duo-gray-light rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-duo-blue transition-colors font-bold"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value) setIsSearching(false);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          onClick={handleSearch}
          className="duo-button-primary py-2 px-4 text-sm"
        >
          搜索
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.section 
            key="search-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-duo-blue flex items-center gap-2">
              <Search size={20} /> 搜索结果
            </h2>
            <div className="duo-card flex items-center gap-4 p-6 bg-duo-blue/5 border-duo-blue/20">
              <img src={searchResult.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-sm" alt="" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">{searchResult.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-duo-blue text-white rounded font-bold uppercase">
                    {searchResult.examType}
                  </span>
                </div>
                <p className="text-sm text-duo-gray font-bold mt-1">{searchResult.info}</p>
              </div>
              <button 
                onClick={() => setHasRequested(true)}
                disabled={hasRequested}
                className={`py-2 px-6 rounded-xl font-black text-sm transition-all shadow-sm border-b-4 active:border-b-0 active:translate-y-1 ${
                  hasRequested 
                    ? 'bg-duo-gray-light text-duo-gray border-duo-gray cursor-default' 
                    : 'bg-duo-green text-white border-duo-green-dark hover:scale-105'
                }`}
              >
                {hasRequested ? '等待确认' : '添加'}
              </button>
            </div>
            <button 
              onClick={() => setIsSearching(false)}
              className="text-duo-gray text-sm font-bold hover:text-duo-blue transition-colors"
            >
              返回列表
            </button>
          </motion.section>
        ) : (
          <motion.div 
            key="friends-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold">我的好友</h2>
                <button 
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`font-bold text-sm flex items-center gap-1 transition-colors ${isEditMode ? 'text-duo-red' : 'text-duo-blue'}`}
                >
                  {isEditMode ? <Check size={16} /> : <Plus size={16} />}
                  {isEditMode ? '完成' : '修改'}
                </button>
              </div>

              <div className="space-y-3">
                {friends.length === 0 ? (
                  <div className="text-center py-8 text-duo-gray font-bold">
                    还没有好友哦，快去搜索添加吧！
                  </div>
                ) : (
                  friends.map(friend => (
                    <motion.div 
                      layout
                      key={friend.id} 
                      className="duo-card flex items-center gap-3"
                    >
                      <div className="relative">
                        <img src={friend.avatar} className="w-12 h-12 rounded-full border-2 border-duo-gray-light" alt="" referrerPolicy="no-referrer" />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-duo-green' : 
                          friend.status === 'studying' ? 'bg-duo-blue' : 'bg-duo-gray'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{friend.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-duo-bone border border-duo-gray-light rounded text-duo-gray font-bold uppercase">
                            {friend.examType}
                          </span>
                        </div>
                        <p className="text-xs text-duo-gray mt-0.5 font-bold">
                          {friend.status === 'studying' ? '刷题中...' : 
                           friend.status === 'online' ? '在线' : `${friend.lastActive}活跃`}
                        </p>
                      </div>
                      {isEditMode ? (
                        <motion.button 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={() => onDeleteFriend(friend.id)}
                          className="p-2 text-duo-red hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      ) : (
                        <button 
                          onClick={() => onChallenge(friend)}
                          className="p-2 text-duo-blue hover:bg-duo-blue/10 rounded-lg transition-colors"
                        >
                          <Sword size={20} />
                        </button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold">可能认识的人</h2>
              <div className="space-y-3">
                <div className="duo-card flex items-center gap-3 bg-duo-bone/50 border-dashed">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" className="w-10 h-10 rounded-full grayscale opacity-50" alt="" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="font-bold text-duo-gray">赵六</p>
                    <p className="text-xs text-duo-gray font-bold">同公司 · CFA 备考中</p>
                  </div>
                  <button className="duo-button-secondary py-1.5 px-3 text-sm">添加</button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LearningPage = () => {
  const lessons = [
    { id: 1, title: '棋子移动', status: 'completed', icon: Star, offset: 0, color: 'bg-[#58cc02]', shadow: 'shadow-[0_8px_0_0_#46a302]' },
    { id: 2, title: '基础走法', status: 'completed', icon: Star, offset: -40, color: 'bg-[#58cc02]', shadow: 'shadow-[0_8px_0_0_#46a302]' },
    { id: 3, title: '特殊规则', status: 'current', icon: Star, offset: 40, color: 'bg-[#58cc02]', shadow: 'shadow-[0_8px_0_0_#46a302]' },
    { id: 4, title: '练习', status: 'locked', icon: Zap, offset: -60, color: 'bg-[#00cd9c]', shadow: 'shadow-[0_8px_0_0_#00a881]' },
    { id: 5, title: '宝箱奖励', status: 'locked', icon: Gift, offset: 0, color: 'bg-[#ffc800]', shadow: 'shadow-[0_8px_0_0_#e5a400]', isChest: true },
    { id: 6, title: '进阶战术', status: 'locked', icon: Star, offset: 40, color: 'bg-[#58cc02]', shadow: 'shadow-[0_8px_0_0_#46a302]' },
    { id: 7, title: '阶段测试', status: 'locked', icon: Trophy, offset: 80, color: 'bg-[#58cc02]', shadow: 'shadow-[0_8px_0_0_#46a302]' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Stats Bar (Duolingo Style) */}
      <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-white z-40 border-b border-duo-gray-light">
        <div className="flex items-center gap-1">
          <Trophy size={20} className="text-[#00cd9c]" fill="currentColor" />
        </div>
        <div className="flex items-center gap-1">
          <Flame size={20} className="text-[#ff9600]" fill="currentColor" />
          <span className="font-black text-[#afafaf]">0</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap size={20} className="text-[#1cb0f6]" fill="currentColor" />
          <span className="font-black text-[#1cb0f6]">193</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart size={20} className="text-[#ff4b4b]" fill="currentColor" />
          <span className="font-black text-[#ff4b4b]">25</span>
        </div>
      </div>

      {/* Section Header (Rounded Green Box) */}
      <div className="px-4 py-4">
        <div className="bg-[#00cd9c] rounded-3xl p-6 text-white shadow-[0_8px_0_0_#00a881] relative overflow-hidden">
          <p className="text-lg font-black opacity-80 uppercase tracking-wide">第 1 阶段，第 1 部分</p>
          <h2 className="text-2xl font-black mt-1">棋子移动</h2>
        </div>
      </div>

      {/* Learning Path */}
      <div className="flex-1 pb-40 pt-8 relative">
        {/* Character (Oscar) */}
        <div className="absolute right-4 top-1/3 z-20 pointer-events-none">
          <motion.img 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar&mouth=serious&top=shortHair&hairColor=black&facialHair=moustaches&facialHairColor=black&clothing=shirtVNeck&clothingColor=pink" 
            className="w-32 h-32"
            alt="Character"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-md mx-auto flex flex-col items-center space-y-16">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="relative flex flex-col items-center"
              style={{ transform: `translateX(${lesson.offset}px)` }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playPopSound}
                className={`w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition-all ${lesson.shadow} ${
                  lesson.status === 'locked' 
                    ? 'bg-[#e5e5e5] shadow-[0_8px_0_0_#afafaf] text-[#afafaf]' 
                    : `${lesson.color} text-white`
                } ${lesson.status === 'current' ? 'animate-bounce-subtle' : ''}`}
              >
                {lesson.isChest ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-12 bg-[#ffc800] rounded-lg border-4 border-white shadow-sm relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white" />
                    </div>
                  </div>
                ) : (
                  <lesson.icon size={36} fill={lesson.status !== 'locked' ? 'currentColor' : 'none'} />
                )}
              </motion.button>
              
              {/* Path Line (Dashed/Solid) */}
              {lesson.id < lessons.length && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-2 h-16 bg-[#e5e5e5] -z-0" />
              )}
            </div>
          ))}
        </div>

        {/* Floating Down Arrow */}
        <div className="fixed bottom-24 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-white rounded-2xl shadow-[0_4px_0_0_#e5e5e5] border-2 border-[#e5e5e5] flex items-center justify-center text-[#1cb0f6]"
          >
            <ChevronRight size={32} className="rotate-90" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const AIQuestionPage = ({ user }: { user: typeof MOCK_USER }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, isTest?: boolean }[]>([
    { role: 'ai', text: '你好！我是你的金蝉助教。我可以为你提供深度解析、个性化反馈，或者为你生成一套针对性的模拟练习题。你想聊聊什么？' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const callGemini = async (prompt: string, systemInstruction: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "抱歉，我现在有点忙，请稍后再试。";
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const systemInstruction = `你是一个专业的金融备考助教“金蝉”。
    你的目标是帮助用户准备金融考试（如CFA, FRM等）。
    当前用户信息：等级 ${user.level}, 经验值 ${user.xp}。
    
    你的能力包括：
    1. 深度解析：提供详细的金融概念解释，包含背景、公式、应用场景。
    2. 个性化反馈：根据用户的提问，指出其知识盲点并给出学习建议。
    3. 模拟测试：如果用户要求测试，生成高质量的选择题。
    
    请使用亲切、专业且富有激励性的语气。使用 Markdown 格式输出。`;

    const aiResponse = await callGemini(textToSend, systemInstruction);
    
    setMessages([...newMessages, { role: 'ai', text: aiResponse || "抱歉，我无法生成回复。" }]);
    setIsLoading(false);
  };

  const generateTest = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: "请为我生成一套针对当前水平的模拟测试题。" }]);

    const systemInstruction = `你是一个专业的金融备考助教“金蝉”。
    请为用户生成一套包含3道高质量金融选择题的模拟测试。
    题目应涵盖：资产定价、风险管理、伦理准则等。
    每道题应包含：题干、4个选项（A, B, C, D）、正确答案及详细解析。
    使用 Markdown 格式，确保排版清晰。`;

    const aiResponse = await callGemini("生成3道模拟题", systemInstruction);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "无法生成测试题。", isTest: true }]);
    setIsLoading(false);
  };

  const getFeedback = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: "请根据我的学习进度给我一些个性化反馈。" }]);

    const systemInstruction = `你是一个专业的金融备考助教“金蝉”。
    基于用户的当前状态（等级 ${user.level}, XP ${user.xp}），提供一段个性化的学习反馈。
    分析其可能的优势和需要加强的地方，并推荐接下来的学习重点。
    语气要积极向上，像一个贴心的导师。`;

    const aiResponse = await callGemini("提供学习反馈", systemInstruction);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "无法生成反馈。" }]);
    setIsLoading(false);
  };

  const suggestions = [
    "什么是 CAPM 模型？",
    "如何理解有效前沿？",
    "夏普比率的意义是什么？",
    "久期和利率的关系？"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] bg-duo-bone/30">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl font-bold shadow-sm border-2 ${
              msg.role === 'user' 
                ? 'bg-duo-blue text-white border-duo-blue-dark rounded-tr-none' 
                : 'bg-white text-[#4b4b4b] border-duo-gray-light rounded-tl-none'
            }`}>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-2 mb-1 text-duo-blue">
                  <Sparkles size={14} fill="currentColor" />
                  <span className="text-[10px] uppercase tracking-wider">金蝉 AI 助教</span>
                </div>
              )}
              <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border-2 border-duo-gray-light flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-duo-blue" />
              <span className="text-xs font-bold text-duo-gray">金蝉正在思考...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t-2 border-duo-gray-light space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={generateTest}
            disabled={isLoading}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-duo-green/10 text-duo-green border-2 border-duo-green/20 rounded-xl text-xs font-black hover:bg-duo-green/20 transition-colors"
          >
            <FileText size={14} /> 生成模拟考
          </button>
          <button 
            onClick={getFeedback}
            disabled={isLoading}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-duo-blue/10 text-duo-blue border-2 border-duo-blue/20 rounded-xl text-xs font-black hover:bg-duo-blue/20 transition-colors"
          >
            <BrainCircuit size={14} /> 获取学习建议
          </button>
          {suggestions.map((s, i) => (
            <button 
              key={i}
              onClick={() => setInput(s)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 bg-duo-bone border-2 border-duo-gray-light rounded-full text-xs font-bold text-duo-gray hover:border-duo-blue hover:text-duo-blue transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="向 AI 提问..." 
            className="flex-1 bg-duo-bone border-2 border-duo-gray-light rounded-xl px-4 py-3 focus:outline-none focus:border-duo-blue font-bold text-sm transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-xl transition-all border-b-4 ${
              input.trim() && !isLoading 
                ? 'bg-duo-blue text-white shadow-sm border-duo-blue-dark active:border-b-0 active:translate-y-1' 
                : 'bg-duo-gray-light text-duo-gray border-duo-gray cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const BattleArena = ({ opponent, onFinish }: { opponent: User, onFinish: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = MOCK_QUESTIONS[currentIdx % MOCK_QUESTIONS.length];

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1);
    }
  }, [timeLeft, isAnswered]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === question.correctIndex) {
      setScore(s => s + 10 + Math.floor(timeLeft / 3));
    }
  };

  const nextQuestion = () => {
    if (currentIdx < 4) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      onFinish(score);
    }
  };

  return (
    <div className="fixed inset-0 left-1/2 -translate-x-1/2 max-w-md bg-white z-[60] flex flex-col">
      <header className="p-4 flex items-center justify-between border-b-2 border-duo-gray-light">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-duo-blue overflow-hidden border-2 border-duo-blue-dark">
            <img src={MOCK_USER.avatar} alt="" referrerPolicy="no-referrer" />
          </div>
          <div className="text-xs font-bold">
            <p>你</p>
            <p className="text-duo-blue">{score}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-duo-gray uppercase tracking-widest">第 {currentIdx + 1}/5 题</span>
          <div className="w-32 h-2 bg-duo-gray-light rounded-full mt-1 overflow-hidden">
            <motion.div 
              className="h-full bg-duo-green"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / 5) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div className="text-xs font-bold">
            <p>{opponent.name}</p>
            <p className="text-duo-red">{(currentIdx * 8) + Math.floor(Math.random() * 5)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-duo-gray-light overflow-hidden border-2 border-duo-gray">
            <img src={opponent.avatar} alt="" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex justify-center mb-8">
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold ${
            timeLeft <= 5 ? 'border-duo-red text-duo-red animate-pulse' : 'border-duo-blue text-duo-blue'
          }`}>
            {timeLeft}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-8">{question.text}</h2>

        <div className="space-y-4">
          {question.options.map((opt, idx) => {
            let style = "duo-button-secondary w-full text-left py-4 px-6 flex items-center justify-between";
            if (isAnswered) {
              if (idx === question.correctIndex) style = "duo-button-primary w-full text-left py-4 px-6 flex items-center justify-between !bg-duo-green !border-duo-green-dark";
              else if (idx === selectedIdx) style = "duo-button-primary w-full text-left py-4 px-6 flex items-center justify-between !bg-duo-red !border-red-700";
            } else if (idx === selectedIdx) {
              style = "duo-button-secondary w-full text-left py-4 px-6 flex items-center justify-between !border-duo-blue !text-duo-blue";
            }

            return (
              <button 
                key={idx} 
                className={style}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
              >
                <span>{opt}</span>
                {isAnswered && idx === question.correctIndex && <Check size={20} />}
                {isAnswered && idx === selectedIdx && idx !== question.correctIndex && <X size={20} />}
              </button>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        {isAnswered && (
          <motion.footer 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className={`p-6 border-t-4 ${
              selectedIdx === question.correctIndex ? 'bg-green-100 border-duo-green' : 'bg-red-100 border-duo-red'
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedIdx === question.correctIndex ? 'bg-duo-green text-white' : 'bg-duo-red text-white'
              }`}>
                {selectedIdx === question.correctIndex ? <Check size={24} strokeWidth={3} /> : <X size={24} strokeWidth={3} />}
              </div>
              <div>
                <h3 className={`font-black text-xl ${
                  selectedIdx === question.correctIndex ? 'text-duo-green-dark' : 'text-duo-red'
                }`}>
                  {selectedIdx === question.correctIndex ? '太棒了！' : '哎呀，答错了'}
                </h3>
                <p className="text-sm opacity-80">{question.explanation}</p>
              </div>
            </div>
            <button 
              onClick={nextQuestion}
              className={`w-full font-bold py-4 rounded-2xl text-white shadow-lg transition-transform active:scale-95 ${
                selectedIdx === question.correctIndex ? 'bg-duo-green' : 'bg-duo-red'
              }`}
            >
              继续
            </button>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

const BattleResult = ({ score, opponent, onRestart }: { score: number, opponent: User, onRestart: () => void }) => {
  const isWin = score > 40; // Simplified logic

  return (
    <div className="fixed inset-0 left-1/2 -translate-x-1/2 max-w-md bg-white z-[70] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-8"
      >
        <div className="relative">
          <Award size={120} className={isWin ? 'text-duo-yellow' : 'text-duo-gray'} fill="currentColor" />
          {isWin && <Zap size={40} className="absolute -top-4 -right-4 text-duo-blue animate-bounce" fill="currentColor" />}
        </div>
      </motion.div>

      <h1 className="text-4xl font-black mb-2">{isWin ? '你赢了！' : '再接再厉'}</h1>
      <p className="text-duo-gray font-bold mb-8">最终比分 {score} : 35</p>

      <div className="w-full max-w-xs space-y-4 mb-12">
        <div className="duo-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-duo-blue" fill="currentColor" />
            <span className="font-bold">经验值</span>
          </div>
          <span className="text-duo-blue font-black">+{isWin ? 50 : 20}</span>
        </div>
        <div className="duo-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-duo-orange" fill="currentColor" />
            <span className="font-bold">连胜</span>
          </div>
          <span className="text-duo-orange font-black">+1</span>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button onClick={onRestart} className="duo-button-primary w-full text-xl">再来一局</button>
        <button onClick={onRestart} className="duo-button-secondary w-full text-xl">返回首页</button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [friends, setFriends] = useState<User[]>(MOCK_FRIENDS);
  const [battleState, setBattleState] = useState<{ active: boolean, opponent: User | null, finished: boolean, score: number }>({
    active: false,
    opponent: null,
    finished: false,
    score: 0
  });

  const startPK = (opponent: User = friends[0] || MOCK_FRIENDS[0]) => {
    setBattleState({ active: true, opponent, finished: false, score: 0 });
  };

  const finishBattle = (score: number) => {
    setBattleState(prev => ({ ...prev, active: false, finished: true, score }));
  };

  const resetBattle = () => {
    setBattleState({ active: false, opponent: null, finished: false, score: 0 });
    setActiveTab('home');
  };

  const deleteFriend = (id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <Header user={MOCK_USER} />
      
      <main className="min-h-[calc(100vh-112px)]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <HomePage onStartPK={() => startPK()} friends={friends} />
            </motion.div>
          )}
          {activeTab === 'friends' && (
            <motion.div key="friends" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <FriendsPage 
                onChallenge={(u) => startPK(u)} 
                friends={friends}
                onDeleteFriend={deleteFriend}
              />
            </motion.div>
          )}
          {activeTab === 'learn' && (
            <motion.div key="learn" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <LearningPage />
            </motion.div>
          )}
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <AIQuestionPage user={MOCK_USER} />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-8 text-center">
              <div className="w-32 h-32 rounded-full bg-duo-bone mx-auto mb-4 border-4 border-duo-gray-light overflow-hidden">
                <img src={MOCK_USER.avatar} alt="" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-2xl font-black">{MOCK_USER.name}</h2>
              <p className="text-duo-gray font-bold mb-8">CFA 一级备考者</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="duo-card">
                  <p className="text-duo-gray text-xs font-bold uppercase">等级</p>
                  <p className="text-2xl font-black">{MOCK_USER.level}</p>
                </div>
                <div className="duo-card">
                  <p className="text-duo-gray text-xs font-bold uppercase">总 XP</p>
                  <p className="text-2xl font-black">{MOCK_USER.xp}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Battle Overlay */}
      {battleState.active && battleState.opponent && (
        <BattleArena 
          opponent={battleState.opponent} 
          onFinish={finishBattle} 
        />
      )}

      {/* Result Overlay */}
      {battleState.finished && battleState.opponent && (
        <BattleResult 
          score={battleState.score} 
          opponent={battleState.opponent} 
          onRestart={resetBattle} 
        />
      )}
    </div>
  );
}
