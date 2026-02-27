/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Edit3
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

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'ai', icon: Bot, label: 'AI 答疑' },
    { id: 'friends', icon: Users, label: '好友' },
    { id: 'profile', icon: UserIcon, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-2 border-duo-gray-light px-6 py-2 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center p-2 transition-colors ${
            activeTab === tab.id ? 'text-duo-blue' : 'text-duo-gray'
          }`}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 3 : 2} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{tab.label}</span>
        </button>
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

const AIQuestionPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: '你好！我是你的金蝉助教。有什么金融备考难题需要我帮你解答吗？' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `关于“${userMsg}”，这是一个非常经典的考点。在 CFA 一级中，我们通常需要关注其核心定义和计算公式...` }]);
    }, 1000);
  };

  const suggestions = [
    "什么是 CAPM 模型？",
    "如何理解有效前沿？",
    "夏普比率的意义是什么？",
    "久期和利率的关系？"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] bg-duo-bone/30">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl font-bold shadow-sm border-2 ${
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
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-white border-t-2 border-duo-gray-light space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {suggestions.map((s, i) => (
            <button 
              key={i}
              onClick={() => setInput(s)}
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
          />
          <button 
            onClick={handleSend}
            className="bg-duo-blue p-3 rounded-xl text-white shadow-sm border-b-4 border-duo-blue-dark active:border-b-0 active:translate-y-1 transition-all"
          >
            <Send size={20} />
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
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <AIQuestionPage />
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
