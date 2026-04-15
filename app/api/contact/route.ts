import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { Resend } from "resend"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const sql = getDb()
    await sql`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject || null}, ${message})
    `

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: process.env.CONTACT_EMAIL || "chinmaydwivedi.official@gmail.com",
          subject: subject
            ? `Portfolio: ${subject}`
            : `Portfolio message from ${name}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #0d9488; margin-bottom: 4px;">New Contact Message</h2>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <p style="font-size: 12px; color: #9ca3af;">Sent from your portfolio contact form</p>
            </div>
          `,
          replyTo: email,
        })
      } catch (emailErr) {
        console.error("Email send failed (message still saved):", emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    )
  }
}
