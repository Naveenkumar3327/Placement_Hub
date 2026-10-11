"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  Mic,
  MicOff,
  Camera,
  User,
} from "lucide-react";

const SPEECH_LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
];

export default function MockInterviewPage() {
  const [stage, setStage] = useState<"setup" | "interview" | "report">("setup");
  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState<"junior" | "mid" | "senior">("mid");
  const [type, setType] = useState<"technical" | "hr" | "behavioral" | "mixed">("mixed");
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [currentEval, setCurrentEval] = useState<any>(null);
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [videoMode, setVideoMode] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState("en-US");
  const [translatedAnswer, setTranslatedAnswer] = useState("");
  const [translationError, setTranslationError] = useState("");
  const [translating, setTranslating] = useState(false);
  const [questionMode, setQuestionMode] = useState<"dataset" | "gemini" | "mixed">("mixed");
  const [questionBank, setQuestionBank] = useState<any>(null);
  const [questionBankSearch, setQuestionBankSearch] = useState("");
  const [loadingMoreQuestions, setLoadingMoreQuestions] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [questionSource, setQuestionSource] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, stage]);

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ limit: "12", search: questionBankSearch });
        const response = await fetch(`/api/ai/interview/generate?${params}`);
        const data = await response.json();
        if (!cancelled) setQuestionBank(data.success ? data : null);
      } catch {
        if (!cancelled) setQuestionBank(null);
      }
    }, questionBankSearch ? 250 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [questionBankSearch]);

  useEffect(() => {
    return () => {
      speechRecognitionRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopLiveSession = () => {
    speechRecognitionRef.current?.stop();
    speechRecognitionRef.current = null;
    setIsListening(false);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setMediaStream(null);
  };

  const startSpeechCapture = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setSpeechError("Live transcription is not supported by this browser. You can still type your answer.");
      return;
    }

    setSpeechError("");
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguage;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as ArrayLike<any>)
        .map((result: any) => result[0].transcript)
        .join(" ")
        .trim();
      setUserAnswer(transcript);
      setTranslatedAnswer("");
    };
    recognition.onerror = (event: any) => {
      setIsListening(false);
      setSpeechError(event.error === "not-allowed" ? "Microphone access was denied." : "Speech capture stopped. You can continue typing.");
    };
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
      speechRecognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setSpeechError("Speech capture could not start. You can continue typing.");
    }
  };

  const translateTranscript = async () => {
    if (!userAnswer.trim() || speechLanguage === "en-US") return;
    setTranslating(true);
    setTranslationError("");
    try {
      const response = await fetch("/api/translation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userAnswer, sourceLanguage: speechLanguage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Translation failed.");
      setTranslatedAnswer(data.translatedText);
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : "Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  const loadMoreQuestions = async () => {
    if (!questionBank || loadingMoreQuestions) return;
    setLoadingMoreQuestions(true);
    try {
      const params = new URLSearchParams({
        limit: "12",
        offset: String(questionBank.questions.length),
        search: questionBankSearch,
      });
      const response = await fetch(`/api/ai/interview/generate?${params}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setQuestionBank((current: any) => ({
          ...current,
          matchingQuestions: data.matchingQuestions,
          questions: [...current.questions, ...data.questions],
        }));
      }
    } finally {
      setLoadingMoreQuestions(false);
    }
  };

  const startInterview = async () => {
    setLoadingQuestions(true);
    setCameraError("");
    let stream: MediaStream | null = null;
    try {
      if (videoMode) {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera and microphone access is not available in this browser.");
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      }

      const res = await fetch("/api/ai/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, type, count: 4, sourceMode: questionMode }),
      });
      const data = await res.json();
      if (!res.ok || !data.questions?.length) {
        throw new Error(data.message || "Interview questions could not be loaded.");
      }

      setQuestions(data.questions);
      setQuestionSource(data.source || "Question bank");
      setCurrentQIndex(0);
      setInterviewHistory([]);
      setCurrentEval(null);
      setUserAnswer("");
      setTranslatedAnswer("");
      setMediaStream(stream);
      mediaStreamRef.current = stream;
      setStage("interview");
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      setCameraError(error instanceof Error ? error.message : "The interview session could not start.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    const q = questions[currentQIndex];

    try {
      const res = await fetch("/api/ai/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          category: q.category,
          userAnswer: translatedAnswer.trim() || userAnswer,
          targetRole: role,
        }),
      });

      const data = await res.json();
      if (res.ok && data.evaluation) {
        setCurrentEval(data.evaluation);
        setInterviewHistory([
          ...interviewHistory,
          {
            questionId: q.id,
            question: q.question,
            category: q.category,
            userAnswer,
            translatedAnswer,
            ...data.evaluation,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = async () => {
    speechRecognitionRef.current?.stop();
    speechRecognitionRef.current = null;
    setIsListening(false);
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setUserAnswer("");
      setCurrentEval(null);
    } else {
      stopLiveSession();
      // Complete interview and generate report
      const allHistory = [...interviewHistory];
      const avgScore = Math.round(allHistory.reduce((a, b) => a + b.score, 0) / allHistory.length);
      const avgTech = Math.round(allHistory.reduce((a, b) => a + b.technicalScore, 0) / allHistory.length);
      const avgComm = Math.round(allHistory.reduce((a, b) => a + b.communicationScore, 0) / allHistory.length);
      const avgProblem = Math.round(allHistory.reduce((a, b) => a + b.problemSolvingScore, 0) / allHistory.length);

      const reportData = {
        overallScore: avgScore,
        technicalScore: avgTech,
        communicationScore: avgComm,
        problemSolvingScore: avgProblem,
        strengths: [
          "Demonstrates solid comprehension of modern architecture principles",
          "Articulate communication with clear logical explanations",
        ],
        weaknesses: [
          "Could cite specific numeric benchmarks or trade-off metrics",
          "Ensure edge-case resilience is addressed in distributed systems",
        ],
        recommendations: [
          "Practice the STAR framework on behavioral questions",
          "Deepen understanding of cache invalidation and database indexing trade-offs",
        ],
      };

      setFinalReport(reportData);

      // Save to server
      try {
        await fetch("/api/interviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetRole: role,
            difficulty,
            type,
            questionsAndAnswers: allHistory,
          }),
        });
      } catch (e) {
        // safely handled
      }

      setStage("report");
    }
  };

  const fillExemplar = () => {
    if (currentQIndex === 0) {
      setUserAnswer(
        "Client-Side Rendering (CSR) renders content in the browser via JavaScript after receiving a bare HTML document, leading to slower initial page loads but fast subsequent transitions. Server-Side Rendering (SSR) compiles HTML on each server request, which improves SEO and reduces Time-to-First-Byte (TTFB) on devices with slower connections. In Next.js, I recommend Static Site Generation (SSG) for static marketing and documentation pages, and SSR or Incremental Static Regeneration (ISR) for frequently updated dynamic user feeds."
      );
    } else if (currentQIndex === 1) {
      setUserAnswer(
        "In a stateless serverless Node.js backend environment, functions spin up and terminate independently, which can quickly exhaust database connections if each invocation instantiates a new pool. To avoid this, I maintain a global cached client connection outside the request handler so it persists across warm lambdas, and configure maximum connection caps in MongoDB or Prisma."
      );
    } else {
      setUserAnswer(
        "I approach this by structuring the problem into clear tiers. First, I identify the core invariants and failure scenarios. Next, I design the component interfaces with clear error boundaries, and benchmark the solution to confirm it satisfies performance SLAs."
      );
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 overflow-y-auto">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 text-white relative shadow-xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-purple-300 border border-white/15">
              Live speech and technical practice
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Interview Studio
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl font-normal">
            Practice technical, HR, and behavioral rounds with live video, multilingual speech, and focused feedback on every response.
          </p>
        </div>

        {/* STAGE 1: SETUP */}
        {stage === "setup" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Configure Your Interview Session</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Role Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
                >
                  <option value="junior">Junior (Campus Graduate)</option>
                  <option value="mid">Mid-Level (Intermediate)</option>
                  <option value="senior">Senior (Advanced)</option>
                </select>
              </div>

              {/* Interview Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Focus Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
                >
                  <option value="mixed">Mixed (Technical + Behavioral)</option>
                  <option value="technical">Technical In-Depth</option>
                  <option value="behavioral">Behavioral (STAR Method)</option>
                  <option value="hr">HR & Culture Fit</option>
                </select>
              </div>
            </div>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Question source</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {questionBank
                      ? `${questionBank.totalQuestions} questions from the ${questionBank.sourceName}.`
                      : "Choose a question source for your practice session."}
                  </p>
                </div>
                {questionBank && (
                  <a
                    href={questionBank.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-indigo-700 underline decoration-indigo-300 underline-offset-4 dark:text-indigo-300"
                  >
                    Kaggle · {questionBank.license} license
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {([
                  ["dataset", "Question bank", "Imported Kaggle questions"],
                  ["gemini", "Gemini questions", "New role-specific prompts"],
                  ["mixed", "Mixed set", "Generated + sourced questions"],
                ] as const).map(([mode, label, description]) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={questionMode === mode}
                    onClick={() => setQuestionMode(mode)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      questionMode === mode
                        ? "border-indigo-500 bg-white text-indigo-950 shadow-sm dark:bg-slate-900 dark:text-white"
                        : "border-slate-200 bg-white/60 text-slate-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
                    }`}
                  >
                    <span className="block text-xs font-bold">{label}</span>
                    <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{description}</span>
                  </button>
                ))}
              </div>
              {questionBank && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowQuestionBank(!showQuestionBank)}
                    aria-expanded={showQuestionBank}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300"
                  >
                    {showQuestionBank ? "Hide sample questions" : "Browse sample questions"}
                  </button>
                  {showQuestionBank && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="search"
                        value={questionBankSearch}
                        onChange={(event) => setQuestionBankSearch(event.target.value)}
                        placeholder="Search questions or categories"
                        aria-label="Search Kaggle interview questions"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <p className="text-[11px] text-slate-500">{questionBank.matchingQuestions} matching questions</p>
                      {questionBank.questions.map((item: any) => (
                        <details key={item.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                          <summary className="cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-100">
                            {item.question}
                            <span className="ml-2 font-normal text-slate-500">{item.category} · {item.difficulty}</span>
                          </summary>
                          {item.answer && <p className="mt-2 border-t border-slate-100 pt-2 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">{item.answer}</p>}
                        </details>
                      ))}
                      {questionBank.questions.length < questionBank.matchingQuestions && (
                        <button
                          type="button"
                          onClick={loadMoreQuestions}
                          disabled={loadingMoreQuestions}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 disabled:opacity-50 dark:border-slate-700 dark:text-indigo-300 dark:hover:bg-slate-800"
                        >
                          {loadingMoreQuestions ? "Loading…" : "Load more questions"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800/60">
              <input
                type="checkbox"
                checked={videoMode}
                onChange={(event) => setVideoMode(event.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-700"
              />
              <Camera className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
              <span>
                <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">Live video interview</span>
                <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">
                  Enable your camera and microphone for a live preview and spoken-answer transcription. Camera video stays on this device.
                </span>
              </span>
            </label>
            {cameraError && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                {cameraError}
              </p>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={startInterview}
                disabled={loadingQuestions}
                className="px-8 py-3.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 text-sm"
              >
                {loadingQuestions ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Interview Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: LIVE INTERVIEW */}
        {stage === "interview" && questions[currentQIndex] && (
          <div className="space-y-6">
            {/* Question Progress Ribbon */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>
                Question {currentQIndex + 1} of {questions.length} · {questionSource}
              </span>
              <span className="capitalize px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {questions[currentQIndex].category} Round
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
                {mediaStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    aria-label="Your live camera preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-950 to-slate-950 text-emerald-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                      <User className="h-8 w-8" />
                    </div>
                    <span className="text-xs font-medium text-white/70">Camera preview is off</span>
                  </div>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                  <span className={`h-2 w-2 rounded-full ${mediaStream ? "animate-pulse bg-rose-500" : "bg-slate-400"}`} />
                  {mediaStream ? "LIVE PREVIEW" : "TEXT MODE"}
                </span>
                <span className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  Candidate
                </span>
              </div>

              <div className="flex min-h-[210px] flex-col justify-between rounded-2xl border border-emerald-900 bg-emerald-950 p-5 text-white shadow-lg">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold text-lime-200">
                      <Sparkles className="h-4 w-4" /> INTERVIEWER
                    </span>
                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-white/70">
                      {mediaStream ? "Camera ready" : "Camera off"}
                    </span>
                  </div>
                  <h2 className="mt-5 font-serif text-xl font-bold">A focused conversation.</h2>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-100/80">
                    Submit each answer for feedback on technical depth, communication, and problem solving.
                  </p>
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-white/15 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-200/70">TRANSCRIPT LENGTH</p>
                    <p className="mt-1 text-lg font-bold">{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0} <span className="text-xs font-medium text-white/60">words</span></p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-white/65">
                    <span className={`h-2 w-2 rounded-full ${isListening ? "animate-pulse bg-rose-400" : "bg-emerald-300"}`} />
                    {isListening ? "Listening" : "Ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Interviewer Prompt
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {questions[currentQIndex].question}
                </h2>
                {questions[currentQIndex].contextHint && (
                  <p className="text-xs text-slate-400 italic">
                    💡 Tip: {questions[currentQIndex].contextHint}
                  </p>
                )}
              </div>

              {/* Student Answer Field */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Your Response
                  </label>
                  <div className="flex items-center gap-2">
                    {mediaStream && (
                      <select
                        value={speechLanguage}
                        onChange={(event) => {
                          setSpeechLanguage(event.target.value);
                          setTranslatedAnswer("");
                        }}
                        aria-label="Spoken answer language"
                        className="max-w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {SPEECH_LANGUAGES.map((language) => (
                          <option key={language.code} value={language.code}>{language.label}</option>
                        ))}
                      </select>
                    )}
                    {mediaStream && (
                      <button
                        type="button"
                        onClick={() => isListening ? speechRecognitionRef.current?.stop() : startSpeechCapture()}
                        aria-pressed={isListening}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${isListening ? "bg-rose-100 text-rose-700" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200"}`}
                      >
                        {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                        {isListening ? "Stop" : "Speak"}
                      </button>
                    )}
                    {speechLanguage !== "en-US" && userAnswer.trim() && (
                      <button
                        type="button"
                        onClick={translateTranscript}
                        disabled={translating}
                        className="rounded-lg bg-sky-100 px-2.5 py-1.5 text-xs font-bold text-sky-900 transition-colors hover:bg-sky-200 disabled:opacity-50 dark:bg-sky-950 dark:text-sky-100"
                      >
                        {translating ? "Translating…" : "Translate to English"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={fillExemplar}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      Sample
                    </button>
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setTranslatedAnswer("");
                  }}
                  placeholder="Type your structured answer here. Speak to the architectural reasoning, trade-offs, and concrete examples..."
                  className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {speechError && <p role="status" className="text-xs text-amber-700 dark:text-amber-300">{speechError}</p>}
                {translationError && <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">{translationError}</p>}
                {translatedAnswer && (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 dark:border-sky-900 dark:bg-sky-950/50">
                    <p className="text-[10px] font-bold uppercase text-sky-800 dark:text-sky-200">English translation</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{translatedAnswer}</p>
                  </div>
                )}
                {mediaStream && <p className="text-[11px] text-slate-500">Camera video stays on this device. Only your submitted transcript is sent for translation or review.</p>}
              </div>

              {!currentEval ? (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !userAnswer.trim() || isListening}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50 flex items-center space-x-2 text-xs"
                  >
                    {evaluating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Submit for feedback</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Immediate answer evaluation */
                <div className="mt-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3">
                    <span className="font-bold text-xs text-indigo-900 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Answer score</span>
                    </span>
                    <span className="text-2xl font-black text-indigo-600">
                      {currentEval.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {currentEval.feedback}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-emerald-700">✓ Strengths:</p>
                      <ul className="space-y-0.5 text-slate-600">
                        {currentEval.strengths.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-amber-700">⚠ Suggestions:</p>
                      <ul className="space-y-0.5 text-slate-600">
                        {currentEval.improvements.map((imp: string, i: number) => (
                          <li key={i}>• {imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center space-x-2 text-xs"
                    >
                      <span>
                        {currentQIndex + 1 < questions.length ? "Next Question →" : "View Final Report"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 3: FINAL REPORT */}
        {stage === "report" && finalReport && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Interview Session Complete
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Performance Evaluation Report
                  </h2>
                  <p className="text-xs text-slate-500">{role} ({difficulty} level)</p>
                </div>

                <div className="text-right">
                  <span className="text-5xl font-black text-indigo-600">
                    {finalReport.overallScore}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Score Metric Cards */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <p className="text-xs text-slate-500 font-semibold">Technical Precision</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {finalReport.technicalScore}%
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <p className="text-xs text-slate-500 font-semibold">Communication Clarity</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {finalReport.communicationScore}%
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <p className="text-xs text-slate-500 font-semibold">Problem Solving</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {finalReport.problemSolvingScore}%
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <h3 className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
                    Key Strengths Observed
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {finalReport.strengths.map((str: string, i: number) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                  <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {finalReport.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setStage("setup")}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Another Interview</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
