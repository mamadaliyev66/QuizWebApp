import { promises as fs } from "fs"
import path from "path"

const QUIZ_DATA_PATH = path.join(process.cwd(), "data", "questions.json")

export async function getQuizData() {
  try {
    const data = await fs.readFile(QUIZ_DATA_PATH, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading quiz data:", error)
    throw new Error("Failed to load quiz data")
  }
}
