import { create } from "domain";
import React from "react";
import { redirect } from 'next/navigation';
import sgMail from '@sendgrid/mail';

export default function ContactForm() {
    // Handle form submission
    const handleSubmit = async (formData: FormData) => {
        "use server"

        // Set the SendGrid API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

        const msg = {
            to: process.env.EMAIL,
            from: formData.get("email")?.toString() || "",
            subject: `New message from ${formData.get("subject")?.toString()}`,
            text: formData.get("message")?.toString() || "",
            html: `<strong>${formData.get("message")?.toString() || ""}</strong>`,
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent');
            // Reset the form after successful submission
            redirect('/contact');
        } catch (error) {
            console.error("Error sending email:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }
            if (
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof error.response === "object" &&
                error.response !== null &&
                "body" in error.response &&
                typeof error.response.body === "object" &&
                error.response.body !== null &&
                "errors" in error.response.body
            ) {
                const sendGridError = error as {
                    response: {
                        body: {
                            errors: unknown[];
                        };
                    };
                };
                console.error("Error details:", sendGridError.response.body.errors);
            }
        }
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">get in touch</h2>
                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-black text-white border border-white rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    )
}