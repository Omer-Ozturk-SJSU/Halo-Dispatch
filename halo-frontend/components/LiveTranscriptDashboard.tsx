"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Phone, MapPin, Clock, RefreshCw } from "lucide-react";
import { fetchLatestCall, fetchCallByExternalId, transformTranscriptToFrontend, ApiCallWithTranscripts } from "@/lib/api";

interface TranscriptEntry {
  time: string;
  speaker: "CALLER" | "DISPATCHER";
  text: string;
  keywords?: string[];
}

interface LiveTranscriptDashboardProps {
  darkMode?: boolean;
  externalCallId?: string; // Optional: to track a specific call
}

export default function LiveTranscriptDashboard({ 
  darkMode = false, 
  externalCallId 
}: LiveTranscriptDashboardProps) {
  const [callData, setCallData] = useState<ApiCallWithTranscripts | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new transcripts arrive
  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcripts]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setError(null);
      let data: ApiCallWithTranscripts | null = null;
      
      if (externalCallId) {
        // Fetch specific call by external ID
        data = await fetchCallByExternalId(externalCallId);
      } else {
        // Fetch latest call
        data = await fetchLatestCall();
      }
      
      if (data) {
        setCallData(data);
        
        // Transform transcripts to frontend format
        const frontendTranscripts = data.transcripts.map(transformTranscriptToFrontend);
        setTranscripts(frontendTranscripts);
        setLastUpdateTime(new Date());
      } else {
        setError("No active calls found");
      }
    } catch (err) {
      setError(`Error fetching data: ${err}`);
      console.error("Error fetching transcript data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 2 seconds for live updates
  useEffect(() => {
    fetchData(); // Initial fetch
    
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [externalCallId]);

  const cardClasses = darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-[#FFD700]/20 shadow-lg";

  if (isLoading && !callData) {
    return (
      <Card className={cardClasses}>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#FFD700]" />
          <p>Loading live transcript data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !callData) {
    return (
      <Card className={cardClasses}>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Call Information Card */}
      {callData && (
        <Card className={`${cardClasses} border-l-4 border-l-[#DC2626]`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-[#DC2626]" />
                <div>
                  <h2 className="text-lg font-semibold">
                    Call #{callData.call.id}
                    {callData.call.external_call_id && (
                      <span className="text-sm ml-2 opacity-70">
                        (VAPI: {callData.call.external_call_id})
                      </span>
                    )}
                  </h2>
                  <p className="text-sm opacity-70">
                    Started: {new Date(callData.call.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`px-3 py-1 ${
                  callData.call.status === 'active' 
                    ? 'bg-[#DC2626] text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {callData.call.status.toUpperCase()}
                </Badge>
                {callData.call.current_score && (
                  <Badge variant="outline" className="px-3 py-1 border-[#FFD700] text-[#FFD700]">
                    Urgency {callData.call.current_score}/10
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Transcript Card */}
      <Card className={`${cardClasses} flex flex-col h-[600px]`}>
        <CardHeader className="border-b border-gray-200/10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-[#FFD700]" />
              <span className="font-semibold">Live Emergency Conversation</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black text-xs font-bold py-1 px-3">
                LIVE TRANSCRIPT
              </Badge>
              <div className="flex items-center space-x-2 text-sm opacity-70">
                <Clock className="h-4 w-4" />
                <span>Last update: {lastUpdateTime.toLocaleTimeString()}</span>
              </div>
              <Button 
                onClick={fetchData} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-4 space-y-4 overflow-y-auto">
          {transcripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Activity className="h-12 w-12 text-[#FFD700] mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Waiting for conversation...</p>
              <p className="text-sm opacity-70">
                {externalCallId 
                  ? `Listening for transcripts from call: ${externalCallId}`
                  : "Make a call to your VAPI number to see live transcripts here"
                }
              </p>
            </div>
          ) : (
            transcripts.map((entry, index) => (
              <div key={`transcript-${index}`}>
                <div
                  className={`p-3 rounded-lg max-w-[85%] border ${
                    entry.speaker === "CALLER"
                      ? `mr-auto ${
                          darkMode
                            ? "bg-red-500/20 border-red-500/40"
                            : "bg-red-500/10 border-red-500/30"
                        }`
                      : `ml-auto ${
                          darkMode
                            ? "bg-amber-500/20 border-amber-500/40"
                            : "bg-amber-500/10 border-amber-500/30"
                        }`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${
                      entry.speaker === "CALLER" ? "text-red-600" : "text-amber-600"
                    }`}>
                      {entry.speaker}
                    </span>
                    <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {entry.time}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {entry.keywords && entry.keywords.length > 0
                      ? entry.text.split(" ").map((word, i) => (
                          <span
                            key={i}
                            className={
                              entry.keywords?.some((keyword) =>
                                word.toLowerCase().includes(keyword.toLowerCase()),
                              )
                                ? `${
                                    darkMode ? "bg-amber-400 text-black" : "bg-amber-300 text-black"
                                  } px-1 rounded font-medium`
                                : ""
                            }
                          >
                            {word}{" "}
                          </span>
                        ))
                      : entry.text}
                  </p>
                </div>

                {/* Add AI suggestions for emergency keywords */}
                {entry.keywords && entry.keywords.length > 0 && index === transcripts.length - 1 && (
                  <div className="my-4">
                    <div className="ml-auto max-w-[85%]">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br border-2 shadow-lg ${
                          darkMode
                            ? "from-amber-500/30 to-amber-600/30 border-amber-500/50"
                            : "from-amber-400/30 to-amber-500/30 border-amber-500/40"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 pt-1">
                            <Brain className="h-5 w-5 text-[#FFD700]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-[#FFD700] mb-1">AI Guardian Alert</p>
                            <p className={`text-sm mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                              Emergency keywords detected: {entry.keywords.join(", ")}
                            </p>
                            <p className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                              Suggested response: "Can you tell me more about your current situation and if you're in immediate danger?"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </CardContent>
      </Card>
    </div>
  );
} 