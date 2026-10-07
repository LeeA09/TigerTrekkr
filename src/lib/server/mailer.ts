import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '$app/env/private'
import nodemailer from 'nodemailer'

interface SendEmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
        user: SMTP_USER,
	    pass: SMTP_PASS,
    },
})


export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
    const mailOptions = {
        from: `"TigerTrekkr" <${SMTP_USER}>`,
        to,
        replyTo: SMTP_USER,
        subject,
        text,
        html,
    }

    return await transporter.sendMail(mailOptions)
}
