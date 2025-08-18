import fs from "fs/promises"
import path from "path"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  name: string
  login: string
  password: string
  isAdmin: boolean
  createdAt: string
}

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function createDefaultAdmin(): Promise<User[]> {
  const hashedPassword = await bcrypt.hash("adminrcs2025", 10)

  const defaultAdmin: User = {
    id: "default-admin",
    name: "Administrator",
    login: "admin@rcs.uz",
    password: hashedPassword,
    isAdmin: true,
    createdAt: new Date().toISOString(),
  }

  const users = [defaultAdmin]
  await saveUsers(users)
  return users
}

export async function getUsers(): Promise<User[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(USERS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return await createDefaultAdmin()
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function createUser(name: string, login: string, password: string, isAdmin = false): Promise<User> {
  const users = await getUsers()

  // Check if login already exists
  if (users.some((user) => user.login === login)) {
    throw new Error("Login already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser: User = {
    id: Date.now().toString(),
    name,
    login,
    password: hashedPassword,
    isAdmin,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  await saveUsers(users)

  return newUser
}

export async function deleteUser(userId: string): Promise<void> {
  const users = await getUsers()
  const filteredUsers = users.filter((user) => user.id !== userId)
  await saveUsers(filteredUsers)
}

export async function findUserByLogin(login: string): Promise<User | null> {
  const users = await getUsers()
  return users.find((user) => user.login === login) || null
}

export async function validateUser(login: string, password: string): Promise<User | null> {
  const user = await findUserByLogin(login)

  if (!user) {
    return null
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    return null
  }

  return user
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, "id" | "createdAt">>,
): Promise<User | null> {
  const users = await getUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return null
  }

  // Hash password if it's being updated
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10)
  }

  users[userIndex] = { ...users[userIndex], ...updates }
  await saveUsers(users)

  return users[userIndex]
}
