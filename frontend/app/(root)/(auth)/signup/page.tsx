"use client";

  import { useEffect, useRef, useState } from "react";
  import Script from "next/script";

  declare global {
    interface Window {
      google: any;
    }
  }

  export default function Page() {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [role, setRole] = useState<string>("");

    useEffect(() => {
      if (!scriptLoaded || !window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: { credential: string }) => {
          console.log("Google token:", response.credential);
          console.log("Selected role:", role);
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
      });
    }, [scriptLoaded, role]);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">LakerTracks</h1>
          <p className="text-gray-500 text-center mb-8">Sign in to continue</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                  role === "student"
                    ? "border-green-500 bg-blue-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("instructor")}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                  role === "instructor"
                    ? "border-green-500 bg-blue-50 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                Instructor
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div ref={buttonRef} />
          </div>

          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="afterInteractive"
            onLoad={() => setScriptLoaded(true)}
          />
        </div>
      </div>
    );
  }
