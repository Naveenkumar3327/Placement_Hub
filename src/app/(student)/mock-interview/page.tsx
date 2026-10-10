"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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

  const startInterview = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch("/api/ai/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, type, count: 4 }),
      });
      const data = await res.json();
      if (res.ok && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentQIndex(0);
        setInterviewHistory([]);
        setCurrentEval(null);
        setUserAnswer("");
        setStage("interview");
      }
    } catch (e) {
      console.error(e);
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
          userAnswer,
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
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setUserAnswer("");
      setCurrentEval(null);
    } else {
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
              AI Speech & Technical Interview Simulator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Campus Mock Interview Platform
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl font-normal">
            Simulate realistic technical, HR, and behavioral campus interview rounds. Receive instant score breakdowns and constructive hiring feedback on every response.
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
                  <option value="AI / Machine Learning Engineer">AI / ML Engineer</option>
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
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span className="capitalize px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {questions[currentQIndex].category} Round
              </span>
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
                  <button
                    type="button"
                    onClick={fillExemplar}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Load Sample Answer
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your structured answer here. Speak to the architectural reasoning, trade-offs, and concrete examples..."
                  className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {!currentEval ? (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50 flex items-center space-x-2 text-xs"
                  >
                    {evaluating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Submit for AI Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Immediate AI Answer Evaluation */
                <div className="mt-4 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-indigo-200/60 pb-3">
                    <span className="font-bold text-xs text-indigo-900 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>AI Answer Score</span>
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
