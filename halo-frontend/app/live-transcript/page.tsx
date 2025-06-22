"use client"

import { useState } from 'react';
import LiveTranscriptDashboard from '@/components/LiveTranscriptDashboard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Sun, Moon } from "lucide-react";

export default function LiveTranscriptPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [externalCallId, setExternalCallId] = useState<string>('');
  const [trackingCallId, setTrackingCallId] = useState<string | undefined>(undefined);

  const handleTrackCall = () => {
    if (externalCallId.trim()) {
      setTrackingCallId(externalCallId.trim());
    } else {
      setTrackingCallId(undefined);
    }
  };

  const themeClasses = darkMode
    ? "min-h-screen bg-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6] text-[#111827]";

  const headerClasses = darkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm border-[#FFD700]/20";

  return (
    <div className={themeClasses}>
      {/* Header */}
      <header className={`${headerClasses} px-6 py-4 border-b sticky top-0 z-50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full animate-pulse opacity-60"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Halo Dispatch</h1>
                <p className="text-sm opacity-70">Live Transcript Monitor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? "border-gray-600 hover:bg-gray-700" : "border-[#FFD700]/30 hover:bg-[#FFD700]/10"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Call Tracking Control */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-[#FFD700]/20 shadow-lg"}>
          <CardHeader>
            <CardTitle className="text-lg">Call Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter VAPI call ID (optional - leave empty for latest call)"
                  value={externalCallId}
                  onChange={(e) => setExternalCallId(e.target.value)}
                  className={darkMode ? "bg-gray-700 border-gray-600" : "border-[#FFD700]/30"}
                />
              </div>
              <Button 
                onClick={handleTrackCall}
                className="bg-[#FFD700] hover:bg-[#FFA500] text-black"
              >
                {externalCallId.trim() ? 'Track Call' : 'Track Latest'}
              </Button>
              {trackingCallId && (
                <Button 
                  onClick={() => {
                    setTrackingCallId(undefined);
                    setExternalCallId('');
                  }}
                  variant="outline"
                  className={darkMode ? "border-gray-600 hover:bg-gray-700" : "border-[#FFD700]/30 hover:bg-[#FFD700]/10"}
                >
                  Stop Tracking
                </Button>
              )}
            </div>
            <p className="text-sm opacity-70 mt-2">
              {trackingCallId 
                ? `Currently tracking call: ${trackingCallId}`
                : "Tracking the most recent active call"
              }
            </p>
          </CardContent>
        </Card>

        {/* Live Transcript Dashboard */}
        <LiveTranscriptDashboard 
          darkMode={darkMode} 
          externalCallId={trackingCallId}
        />

        {/* Instructions */}
        <Card className={darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-[#FFD700]/20 shadow-lg"}>
          <CardHeader>
            <CardTitle className="text-lg">How to Use Live Transcripts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">1. Make a Call</h3>
                <p className="text-sm opacity-70">
                  Call your VAPI number and the conversation will be forwarded to your dispatcher while being transcribed.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">2. View Live Transcripts</h3>
                <p className="text-sm opacity-70">
                  Transcripts appear here in real-time as the conversation happens, with emergency keywords highlighted.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">3. AI Assistance</h3>
                <p className="text-sm opacity-70">
                  The AI Guardian provides suggestions and alerts based on detected emergency keywords and patterns.
                </p>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm">
                <strong>Backend Status:</strong> Make sure your backend server is running on localhost:8000 and your ngrok tunnel is active for VAPI webhooks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 