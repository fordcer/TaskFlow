import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const user = await createUser({ name, email, password })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message ?? "Something went wrong" }, { status: 500 })
  }
}
