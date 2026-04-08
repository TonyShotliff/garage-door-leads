"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  zipCode: string;
  serviceType: string;
  urgency: string;
  message: string;
  photo: File | null;
}

const initialForm: FormData = {
  fullName: "",
  phone: "",
  email: "",
  zipCode: "",
  serviceType: "",
  urgency: "",
  message: "",
  photo: null,
};

export default function Home() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let photoUrl: string | null = null;

      if (form.photo) {
        const ext = form.photo.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("lead-photos")
          .upload(fileName, form.photo);

        if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from("lead-photos")
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("leads").insert({
        full_name: form.fullName,
        phone: form.phone,
        email: form.email,
        zip_code: form.zipCode,
        service_type: form.serviceType,
        urgency: form.urgency,
        message: form.message || null,
        photo_url: photoUrl,
      });

      if (insertError) throw new Error(insertError.message);

      await fetch("/api/send-lead-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          zip_code: form.zipCode,
          service_type: form.serviceType,
          urgency: form.urgency,
          message: form.message || null,
        }),
      });

      await fetch("/api/send-lead-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          phone: form.phone,
          service_type: form.serviceType,
          urgency: form.urgency,
        }),
      });

      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Received!</h2>
          <p className="text-gray-500 mb-6">
            Thank you for contacting us. We&apos;ll be in touch shortly to confirm your appointment.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm text-blue-600 hover:underline"
          >
            Submit another request
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-14 h-14 mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Garage Door Service Request</h1>
          <p className="text-gray-500 mt-2">Fill out the form below and we&apos;ll get back to you promptly.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="(555) 000-0000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Email + Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="90210"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Service Type + Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="" disabled>Select a service...</option>
                  <option>Spring Replacement</option>
                  <option>Cable Repair</option>
                  <option>Opener Repair</option>
                  <option>Panel Damage</option>
                  <option>Installation</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                >
                  <option value="" disabled>Select urgency...</option>
                  <option>Emergency - Same Day</option>
                  <option>Urgent - Within 48 Hours</option>
                  <option>Flexible - Within 2 Weeks</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Problem Details
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the issue with your garage door..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo of Problem <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <label className="flex items-center justify-center gap-3 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500 group-hover:text-blue-600 transition">
                  {form.photo ? form.photo.name : "Click to upload a photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition text-base shadow-sm"
            >
              {submitting ? "Submitting..." : "Submit Service Request"}
            </button>

            <p className="text-xs text-center text-gray-400">
              By submitting, you agree to be contacted by our team regarding your service request.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
