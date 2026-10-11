import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const defaultDatasetSlug = "syedmharis/software-engineering-interview-questions-dataset";
const datasetSlug = process.argv[2] || defaultDatasetSlug;
if (!/^[\w-]+\/[\w-]+$/.test(datasetSlug)) {
  throw new Error("Pass a Kaggle dataset slug in owner/dataset format.");
}

const headers = {};
if (process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY) {
  headers.Authorization = `Basic ${Buffer.from(`${process.env.KAGGLE_USERNAME}:${process.env.KAGGLE_KEY}`).toString("base64")}`;
}

const response = await fetch(`https://www.kaggle.com/api/v1/datasets/download/${datasetSlug}`, { headers });
if (!response.ok) {
  throw new Error(`Kaggle download failed (${response.status}). Check the dataset slug and Kaggle credentials.`);
}

const zip = new AdmZip(Buffer.from(await response.arrayBuffer()));
const csvEntry = zip.getEntries().find((entry) => entry.entryName.toLowerCase().endsWith(".csv"));
if (!csvEntry) {
  throw new Error("The Kaggle archive did not contain a CSV file.");
}

const records = parse(csvEntry.getData().toString("utf8"), {
  bom: true,
  columns: true,
  skip_empty_lines: true,
  trim: true,
});
const questions = records
  .map((row, index) => ({
    id: index + 1,
    question: row.Question || row.question || row["Interview Question"] || "",
    answer: row.Answer || row.answer || row["Brief Answer"] || row["brief answer"] || "",
    category: row.Category || row.category || "General",
    difficulty: row.Difficulty || row.difficulty || "Mixed",
  }))
  .filter((row) => row.question);

if (!questions.length) {
  throw new Error("No question column was found. Expected Question, question, or Interview Question.");
}

const output = {
  sourceName: datasetSlug === defaultDatasetSlug
    ? "Software Engineering Interview Questions Dataset"
    : datasetSlug,
  sourceUrl: `https://www.kaggle.com/datasets/${datasetSlug}`,
  license: datasetSlug === defaultDatasetSlug ? "MIT" : "Verify Kaggle license before use",
  importedAt: new Date().toISOString(),
  questions,
};
const outputPath = resolve("src/data/interview-questions.json");
await mkdir(resolve("src/data"), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Imported ${questions.length} questions from ${datasetSlug} to ${outputPath}`);
