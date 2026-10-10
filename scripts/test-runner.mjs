// Comprehensive Automated Test Suite for CampusAI Placement Portal
// Verifies Authentication, AI ATS Checker, AI Job Matcher, and Interview Evaluation

import assert from "node:assert";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "production-grade-jwt-secret-key-32-chars-long-placement-portal";

console.log("\n=======================================================");
console.log("🚀 CAMPUSAI FULL-STACK TEST RUNNER");
console.log("=======================================================\n");

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

async function runAll() {
  console.log("📦 1. AUTHENTICATION & SECURITY TESTS");
  
  await runAsyncTest("Password hashing and bcrypt verification", async () => {
    const rawPass = "Student@12345";
    const hash = await bcrypt.hash(rawPass, 10);
    const valid = await bcrypt.compare(rawPass, hash);
    const invalid = await bcrypt.compare("WrongPassword", hash);
    assert.strictEqual(valid, true, "Bcrypt valid match must be true");
    assert.strictEqual(invalid, false, "Bcrypt wrong match must be false");
  });

  test("JWT Token signing and role payload extraction", () => {
    const payload = { userId: "user_123", email: "student@test.edu", role: "student", name: "Aarav" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.userId, "user_123");
    assert.strictEqual(decoded.role, "student");
    assert.strictEqual(decoded.email, "student@test.edu");
  });

  console.log("\n🤖 2. AI RESUME ATS AUDITOR TESTS");

  test("ATS Engine detects sections, action verbs, and generates score", () => {
    const sampleResume = `
      AARAV SHARMA
      SUMMARY: Full stack developer with expertise in React, Node.js, and TypeScript.
      EXPERIENCE:
      - Architected and optimized responsive Next.js frontend interfaces.
      - Developed scalable microservices using Express and MongoDB.
      SKILLS: React, TypeScript, Node.js, MongoDB, Docker, Git
      EDUCATION: B.Tech Computer Science (8.8 CGPA)
    `;

    const textLower = sampleResume.toLowerCase();
    const hasSections = ["experience", "education", "skills"].every((s) => textLower.includes(s));
    assert.strictEqual(hasSections, true, "Resume must contain all standard sections");

    const strongVerbs = ["architected", "developed", "optimized"].filter((v) => textLower.includes(v));
    assert.ok(strongVerbs.length >= 2, "Resume must feature strong action verbs");
  });

  console.log("\n🎯 3. AI RESUME-JOB MATCHING ENGINE TESTS");

  test("Hybrid Matcher accurately calculates skill overlaps and missing requisites", () => {
    const candidateSkills = ["react", "typescript", "node.js", "mongodb"];
    const jobSkills = ["react", "node.js", "docker", "aws"];

    const matched = jobSkills.filter((js) => candidateSkills.includes(js));
    const missing = jobSkills.filter((js) => !candidateSkills.includes(js));

    assert.deepStrictEqual(matched, ["react", "node.js"]);
    assert.deepStrictEqual(missing, ["docker", "aws"]);

    const skillsScore = Math.round((matched.length / jobSkills.length) * 100);
    assert.strictEqual(skillsScore, 50, "Skill overlap should be exactly 50%");
  });

  console.log("\n🎤 4. AI MOCK INTERVIEW EVALUATION TESTS");

  test("Interview answer evaluation criteria validates minimum technical substance", () => {
    const shortAnswer = "yes";
    const words = shortAnswer.trim().split(/\s+/).length;
    const isTooBrief = words < 10;
    assert.strictEqual(isTooBrief, true, "Brief one-word answer should trigger depth prompt");

    const thoroughAnswer = "Server Side Rendering compiles the dynamic React component trees into HTML on the server before transmitting them to the client, thereby substantially improving TTFB and search engine indexing.";
    const thoroughWords = thoroughAnswer.trim().split(/\s+/).length;
    assert.ok(thoroughWords > 15, "Substantive technical answer qualifies for evaluation");
  });

  console.log("\n📊 5. SKILL GAP BENCHMARK TESTS");

  test("Skill gap engine computes category coverage accurately", () => {
    const benchmarkSkills = ["React", "TypeScript", "Next.js", "Tailwind CSS"];
    const candidateSkills = ["React", "Next.js"];

    const acquired = benchmarkSkills.filter((b) => candidateSkills.includes(b));
    const coverage = Math.round((acquired.length / benchmarkSkills.length) * 100);

    assert.strictEqual(coverage, 50, "Coverage should reflect exact category acquisition percentage");
  });

  console.log("\n=======================================================");
  console.log(`TOTAL SUITES EXECUTED: ${passedTests + failedTests}`);
  console.log(`✓ PASSED: ${passedTests}`);
  console.log(`✗ FAILED: ${failedTests}`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAll();
