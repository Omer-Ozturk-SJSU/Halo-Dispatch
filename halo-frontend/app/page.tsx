"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  Heart,
  Shield,
  User,
  Brain,
  ChevronDown,
  ChevronRight,
  Activity,
  Navigation,
  Plus,
  MessageSquare,
  Lightbulb,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Users,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  PlayCircle,
} from "lucide-react"

interface TranscriptEntry {
  time: string
  speaker: "CALLER" | "DISPATCHER"
  text: string
  keywords?: string[]
}

interface AgentSuggestion {
  id: string
  type: "question" | "action" | "safety"
  title: string
  response: string
}

interface PoliceUnit {
  id: string
  lat: number
  lng: number
  status: "En Route" | "Dispatched" | "Available"
  eta: number
}

export default function LandingPage() {
  const [currentPage, setCurrentPage] = useState<"landing" | "signin" | "dashboard">("landing")

  if (currentPage === "signin") {
    return <SignInPage onSignIn={() => setCurrentPage("dashboard")} onBackToLanding={() => setCurrentPage("landing")} />
  }

  if (currentPage === "dashboard") {
    return <Dashboard onSignOut={() => setCurrentPage("landing")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-[#FFD700]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFD700] rounded-full animate-pulse opacity-60"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#111827]">Halo Dispatch</h1>
                <p className="text-xs text-[#111827]/60">The Guardian in Every Crisis</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-[#111827] hover:text-[#FFD700] transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-[#111827] hover:text-[#FFD700] transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-[#111827] hover:text-[#FFD700] transition-colors">
                Testimonials
              </a>
              <Button
                onClick={() => setCurrentPage("signin")}
                className="bg-[#FFD700] hover:bg-[#FFA500] text-[#111827] font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-[#FFD700]/20 text-[#111827] border-[#FFD700]/30">
                    AI-Powered Emergency Response
                  </Badge>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-[#111827] font-serif leading-tight">
                  Your AI-Powered
                  <span className="block text-[#FFD700]">Guardian Angel</span>
                  for Every Crisis
                </h1>
                <p className="text-xl text-[#111827]/70 leading-relaxed">
                  Halo Dispatch is your AI-powered angel for emergency triage — understanding both the problem and the
                  person in real-time, ensuring every call gets the right response at the right time.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setCurrentPage("signin")}
                  className="bg-[#FFD700] hover:bg-[#FFA500] text-[#111827] font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="border-[#FFD700] text-[#111827] hover:bg-[#FFD700]/10 px-8 py-4 text-lg"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#111827]">99.9%</div>
                  <div className="text-sm text-[#111827]/60">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#111827]">2.3s</div>
                  <div className="text-sm text-[#111827]/60">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#111827]">500+</div>
                  <div className="text-sm text-[#111827]/60">Agencies</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-[#FFD700]/20">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFD700] rounded-full animate-pulse"></div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#111827]">Live Emergency Call</h3>
                    <Badge className="bg-[#DC2626] text-white">CRITICAL</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#DC2626] rounded-full animate-pulse"></div>
                      <span className="text-sm text-[#111827]/70">Domestic violence detected</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Brain className="h-4 w-4 text-[#FFD700]" />
                      <span className="text-sm text-[#111827]/70">AI analyzing emotional state...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-[#FFD700]" />
                      <span className="text-sm text-[#111827]/70">Location confirmed: Berkeley, CA</span>
                    </div>
                  </div>
                  <div className="bg-[#FFD700]/10 p-3 rounded-lg">
                    <p className="text-sm text-[#111827] font-medium">AI Suggestion:</p>
                    <p className="text-sm text-[#111827]/70">"Ask about immediate safety and injuries"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#111827] font-serif">How Halo Dispatch Works</h2>
            <p className="text-xl text-[#111827]/70 max-w-3xl mx-auto">
              Our AI guardian watches over every call, providing real-time insights and guidance to ensure the best
              possible outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-[#FFD700]/20 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#FFD700]/30 transition-colors">
                  <MessageSquare className="h-8 w-8 text-[#FFD700]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">AI Listens & Analyzes</h3>
                <p className="text-[#111827]/70">
                  Real-time transcription and emotional analysis of every emergency call, understanding both words and
                  tone.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#FFD700]/20 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#FFD700]/30 transition-colors">
                  <Brain className="h-8 w-8 text-[#FFD700]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Smart Triage & Routing</h3>
                <p className="text-[#111827]/70">
                  Intelligent classification and routing to the right responders - police, fire, EMS, or mental health
                  professionals.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[#FFD700]/20 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#FFD700]/30 transition-colors">
                  <Shield className="h-8 w-8 text-[#FFD700]" />
                </div>
                <h3 className="text-xl font-semibold text-[#111827]">Guardian Assistance</h3>
                <p className="text-[#111827]/70">
                  Continuous support for dispatchers and first responders with real-time guidance and documentation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-[#FAF9F6] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#111827] font-serif">Guardian Features</h2>
            <p className="text-xl text-[#111827]/70 max-w-3xl mx-auto">
              Every feature designed to protect and serve, powered by AI that understands the human element in every
              crisis.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#111827] mb-2">Real-Time Call Transcription</h3>
                    <p className="text-[#111827]/70">
                      Live speech-to-text with keyword highlighting and confidence scoring for every emergency call.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FBCFE8]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-[#FBCFE8]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#111827] mb-2">Emotional Intelligence</h3>
                    <p className="text-[#111827]/70">
                      Advanced emotion detection to identify stress, panic, and mental health crises in real-time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#FB923C]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-[#FB923C]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#111827] mb-2">Intelligent Suggestions</h3>
                    <p className="text-[#111827]/70">
                      AI-powered recommendations for questions to ask, actions to take, and protocols to follow.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#DC2626]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-[#DC2626]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#111827] mb-2">Live Location Tracking</h3>
                    <p className="text-[#111827]/70">
                      Real-time GPS tracking of callers and responding units with intelligent routing optimization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-[#FFD700]/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#111827]">AI Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-[#111827]/60">Live</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FFD700]/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-[#111827]">94%</div>
                      <div className="text-xs text-[#111827]/60">AI Confidence</div>
                    </div>
                    <div className="bg-[#DC2626]/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-[#111827]">9/10</div>
                      <div className="text-xs text-[#111827]/60">Urgency Level</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-[#111827]/70">Location confirmed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-[#111827]/70">Units dispatched</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#FFD700]" />
                      <span className="text-sm text-[#111827]/70">ETA: 2 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#111827] font-serif">Trusted by Heroes</h2>
            <p className="text-xl text-[#111827]/70 max-w-3xl mx-auto">
              Real stories from dispatchers and first responders who trust Halo Dispatch to guide them through every
              crisis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-[#FFD700]/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-[#111827]/70 italic">
                  "Halo Dispatch has transformed how we handle emergency calls. The AI suggestions are incredibly
                  accurate and have helped us save precious seconds in critical situations."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827]">Sarah Martinez</div>
                    <div className="text-sm text-[#111827]/60">Lead Dispatcher, Berkeley PD</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#FFD700]/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-[#111827]/70 italic">
                  "The emotional intelligence feature is a game-changer. It helps us identify mental health crises early
                  and respond with the appropriate resources."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827]">Dr. Michael Chen</div>
                    <div className="text-sm text-[#111827]/60">Emergency Medicine Director</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#FFD700]/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-[#111827]/70 italic">
                  "Having real-time location tracking and AI-powered routing has reduced our response times by 30%. It's
                  like having a guardian angel watching over every call."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827]">Captain Lisa Rodriguez</div>
                    <div className="text-sm text-[#111827]/60">Fire Department Chief</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-[#111827] font-serif">Ready to Transform Emergency Response?</h2>
          <p className="text-xl text-[#111827]/70">
            Join hundreds of agencies already using Halo Dispatch to save lives and protect communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setCurrentPage("signin")}
              className="bg-[#FFD700] hover:bg-[#FFA500] text-[#111827] font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Start Your Demo
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="border-[#FFD700] text-[#111827] hover:bg-[#FFD700]/10 px-8 py-4 text-lg"
            >
              Contact Sales
            </Button>
          </div>
          <div className="pt-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-[#111827]/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free 30-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#111827]" />
                </div>
                <div>
                  <h3 className="font-bold font-serif">Halo Dispatch</h3>
                  <p className="text-xs text-gray-400">The Guardian in Every Crisis</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered emergency response technology that understands both the problem and the person.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>Security</div>
                <div>Integrations</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>About</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Documentation</div>
                <div>Help Center</div>
                <div>Training</div>
                <div>Status</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; 2024 Halo Dispatch. All rights reserved. Protecting communities with AI-powered emergency response.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sign In Page Component
function SignInPage({ onSignIn, onBackToLanding }: { onSignIn: () => void; onBackToLanding: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSignIn()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <Card className="border-[#FFD700]/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFD700] rounded-full animate-pulse opacity-60"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Halo Dispatch</h1>
              <p className="text-sm text-[#111827]/60">The Guardian in Every Crisis</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#111827]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#FFD700]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  placeholder="dispatcher@agency.gov"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#111827]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#FFD700]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FFD700] hover:bg-[#FFA500] text-[#111827] font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In to Dashboard
              </Button>
            </form>
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FFD700]/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#111827]/60">or</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onBackToLanding}
                className="w-full border-[#FFD700]/30 text-[#111827] hover:bg-[#FFD700]/10"
              >
                Back to Home
              </Button>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#111827]/60">Demo credentials: any email/password combination</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Dashboard Component (Updated with Halo Dispatch branding)
function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0)
  const [callDuration, setCallDuration] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [mapZoom, setMapZoom] = useState(15)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    transcript: true,
    suggestions: true,
    map: true,
    analysis: false,
    medical: false,
    units: false,
  })

  // Sarah Johnson's location (near UC Berkeley Student Union)
  const callerLocation = {
    lat: 37.8697,
    lng: -122.2601,
    address: "2495 Bancroft Way, Berkeley, CA",
    accuracy: 25, // meters
  }

  // Police units with live positions around Berkeley
  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>([
    { id: "Unit 23", lat: 37.872, lng: -122.259, status: "En Route", eta: 2 },
    { id: "Unit 45", lat: 37.868, lng: -122.262, status: "Dispatched", eta: 3 },
    { id: "Unit 12", lat: 37.871, lng: -122.258, status: "Available", eta: 5 },
  ])

  // Hardcoded scenario data
  const callerInfo = {
    phone: "(510) 555-4567",
    name: "Sarah Johnson",
    location: "2495 Bancroft Way, Berkeley, CA",
    urgency: 9,
    type: "Domestic Violence + Medical",
    emotion: "Severe Fear",
  }

  const fullTranscript = [
    {
      time: "2:34:12 AM",
      speaker: "CALLER" as const,
      text: "911, please help me...",
      keywords: ["help"],
    },
    {
      time: "2:34:15 AM",
      speaker: "DISPATCHER" as const,
      text: "911, what's your emergency?",
    },
    {
      time: "2:34:17 AM",
      speaker: "CALLER" as const,
      text: "He hit me again... I think I'm bleeding. I'm hiding in the bathroom closet.",
      keywords: ["hit", "bleeding", "hiding"],
    },
    {
      time: "2:34:23 AM",
      speaker: "DISPATCHER" as const,
      text: "I'm sending help right now. Are you safe where you are?",
    },
    {
      time: "2:34:26 AM",
      speaker: "CALLER" as const,
      text: "I don't know... he's still in the house somewhere. I can hear him yelling.",
      keywords: ["house", "yelling"],
    },
  ]

  const getAgentSuggestions = () => {
    const suggestions = []
    if (currentTranscriptIndex >= 2) {
      suggestions.push({
        id: "medical",
        type: "question" as const,
        title: "Check head injury",
        response: "Are you feeling dizzy or nauseous?",
      })
    }
    if (currentTranscriptIndex >= 4) {
      suggestions.push({
        id: "safety",
        type: "safety" as const,
        title: "Keep caller quiet",
        response: "Please whisper your answers to me.",
      })
    }
    if (currentTranscriptIndex >= 3) {
      suggestions.push({
        id: "location",
        type: "question" as const,
        title: "Confirm apartment",
        response: "Can you confirm you're near the UC Berkeley campus?",
      })
    }
    if (currentTranscriptIndex >= 5) {
      suggestions.push({
        id: "dispatch",
        type: "action" as const,
        title: "Dispatch additional units",
        response: "Consider sending mental health crisis team",
      })
    }
    return suggestions.slice(0, 3)
  }

  const responseUnits = [
    { id: "Unit 23", type: "Police", eta: 2, status: "En Route" },
    { id: "Unit 45", type: "Police", eta: 3, status: "Dispatched" },
    { id: "Ambulance 12", type: "EMS", eta: 4, status: "Dispatched" },
  ]

  // Simulate real-time transcript progression
  useEffect(() => {
    if (currentTranscriptIndex < fullTranscript.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTranscriptIndex((prev) => prev + 1)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [currentTranscriptIndex, fullTranscript.length])

  // Simulate unit movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPoliceUnits((prev) =>
        prev.map((unit) => {
          if (unit.status === "En Route") {
            // Move units slightly towards caller location
            const deltaLat = (callerLocation.lat - unit.lat) * 0.02
            const deltaLng = (callerLocation.lng - unit.lng) * 0.02
            return {
              ...unit,
              lat: unit.lat + deltaLat,
              lng: unit.lng + deltaLng,
              eta: Math.max(1, unit.eta - 0.1),
            }
          }
          return unit
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [callerLocation.lat, callerLocation.lng])

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const getUrgencyColor = (level: number) => {
    if (level >= 9) return "bg-red-100 text-red-800 border-red-200"
    if (level >= 7) return "bg-orange-100 text-orange-800 border-orange-200"
    if (level >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case "En Route":
        return "bg-orange-500"
      case "Dispatched":
        return "bg-blue-500"
      case "Available":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const zoomToUnits = () => {
    setMapZoom(12)
  }

  const zoomToLocation = () => {
    setMapZoom(18)
  }

  const themeClasses = darkMode
    ? "min-h-screen bg-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-[#FAF9F6] via-white to-[#FAF9F6] text-[#111827]"

  const cardClasses = darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-[#FFD700]/20 shadow-lg"

  const headerClasses = darkMode ? "bg-gray-800 border-gray-700" : "bg-white/90 backdrop-blur-sm border-[#FFD700]/20"

  return (
    <div className={themeClasses}>
      {/* Updated Header with Halo Dispatch branding */}
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
                <p className="text-sm opacity-70">Active Emergency Call</p>
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
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(callDuration)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className={darkMode ? "border-gray-600 hover:bg-gray-700" : "border-[#FFD700]/30 hover:bg-[#FFD700]/10"}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Emergency Overview Card with Halo branding */}
        <Card className={`mb-6 border-l-4 border-l-[#DC2626] ${cardClasses}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#DC2626]" />
                  <div>
                    <h2 className="text-lg font-semibold">{callerInfo.name}</h2>
                    <p className="text-sm opacity-70">{callerInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 opacity-70" />
                  <span className="text-sm">{callerInfo.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className="px-3 py-1 bg-[#DC2626] text-white">Priority {callerInfo.urgency}/10</Badge>
                <Badge variant="outline" className="px-3 py-1 border-[#FFD700] text-[#FFD700]">
                  {callerInfo.type}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Conversation & Suggestions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Live Transcript with Halo styling */}
            <Card className={cardClasses}>
              <CardHeader
                className="cursor-pointer hover:bg-[#FFD700]/5 transition-colors"
                onClick={() => toggleSection("transcript")}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-[#FFD700]" />
                    <span>Live Conversation</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  {expandedSections.transcript ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedSections.transcript && (
                <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                  {fullTranscript.slice(0, currentTranscriptIndex + 1).map((entry, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-70 font-medium">{entry.time}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            entry.speaker === "CALLER"
                              ? "bg-[#DC2626]/20 text-[#DC2626]"
                              : "bg-[#FFD700]/20 text-[#FFD700]"
                          }`}
                        >
                          {entry.speaker}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${
                          entry.speaker === "CALLER"
                            ? darkMode
                              ? "bg-red-900/30 border-red-800"
                              : "bg-[#DC2626]/5 border-[#DC2626]/20"
                            : darkMode
                              ? "bg-yellow-900/30 border-yellow-800"
                              : "bg-[#FFD700]/5 border-[#FFD700]/20"
                        }`}
                      >
                        <p className="text-sm">
                          {entry.keywords
                            ? entry.text.split(" ").map((word, i) => (
                                <span
                                  key={i}
                                  className={
                                    entry.keywords?.some((keyword) =>
                                      word.toLowerCase().includes(keyword.toLowerCase()),
                                    )
                                      ? "bg-[#FFD700] text-[#111827] px-1 rounded font-medium"
                                      : ""
                                  }
                                >
                                  {word}{" "}
                                </span>
                              ))
                            : entry.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {currentTranscriptIndex < fullTranscript.length - 1 && (
                    <div className="flex items-center space-x-2 opacity-70 py-2">
                      <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">AI Guardian is listening...</span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* AI Suggestions with Halo styling */}
            {getAgentSuggestions().length > 0 && (
              <Card className={`border-l-4 border-l-[#FFD700] ${cardClasses}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-[#FFD700]/5 transition-colors"
                  onClick={() => toggleSection("suggestions")}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-[#FFD700]" />
                      <span>Guardian AI Suggestions</span>
                      <Badge variant="outline" className="text-xs border-[#FFD700] text-[#FFD700]">
                        {getAgentSuggestions().length}
                      </Badge>
                    </div>
                    {expandedSections.suggestions ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CardTitle>
                </CardHeader>
                {expandedSections.suggestions && (
                  <CardContent className="space-y-4">
                    {getAgentSuggestions().map((suggestion, index) => (
                      <div key={suggestion.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs opacity-70 font-medium">Guardian Recommendation {index + 1}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              suggestion.type === "question"
                                ? "bg-[#FFD700]/20 text-[#FFD700]"
                                : suggestion.type === "safety"
                                  ? "bg-[#DC2626]/20 text-[#DC2626]"
                                  : "bg-[#FB923C]/20 text-[#FB923C]"
                            }`}
                          >
                            {suggestion.type.toUpperCase()}
                          </span>
                        </div>
                        <div
                          className={`p-3 rounded-lg border ${
                            darkMode ? "bg-yellow-900/30 border-yellow-800" : "bg-[#FFD700]/5 border-[#FFD700]/20"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {suggestion.type === "question" && <MessageSquare className="h-3 w-3 text-[#FFD700]" />}
                                {suggestion.type === "action" && <Lightbulb className="h-3 w-3 text-[#FB923C]" />}
                                {suggestion.type === "safety" && <AlertTriangle className="h-3 w-3 text-[#DC2626]" />}
                                <span className="text-sm font-medium">{suggestion.title}</span>
                              </div>
                              <p className="text-sm opacity-90">"{suggestion.response}"</p>
                            </div>
                            <Button
                              size="sm"
                              className="ml-3 text-xs h-6 px-2 bg-[#FFD700] hover:bg-[#FFA500] text-[#111827]"
                            >
                              Use
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Right Sidebar with updated styling */}
          <div className="space-y-6">
            {/* Compact Square Live Location Map */}
            <Card className={`border-l-4 border-l-green-500 ${cardClasses}`}>
              <CardHeader
                className="cursor-pointer hover:bg-green-500/5 transition-colors"
                onClick={() => toggleSection("map")}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>Guardian Tracking</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">GPS Active</Badge>
                  </div>
                  {expandedSections.map ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
              {expandedSections.map && (
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/berkeley-map.png')",
                        transform: `scale(${1 + (mapZoom - 15) * 0.1})`,
                        transition: "transform 0.3s ease",
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Sarah's Location */}
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: "60%",
                        top: "45%",
                        transform: `translate(-50%, -50%) scale(${Math.min(1.5, mapZoom / 12)})`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-2 border-[#DC2626] rounded-full animate-ping opacity-30"></div>
                        <div className="absolute w-8 h-8 border-2 border-[#DC2626] rounded-full animate-pulse opacity-50"></div>
                        <div className="absolute w-4 h-4 bg-[#DC2626] rounded-full animate-pulse shadow-lg"></div>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#DC2626] text-white px-2 py-1 rounded text-xs font-medium shadow-lg whitespace-nowrap">
                          Sarah Johnson
                        </div>
                      </div>
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 hover:bg-white text-gray-800 border-gray-300 h-6 w-6 p-0"
                        onClick={() => setMapZoom(Math.min(20, mapZoom + 2))}
                      >
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 hover:bg-white text-gray-800 border-gray-300 h-6 w-6 p-0"
                        onClick={() => setMapZoom(Math.max(10, mapZoom - 2))}
                      >
                        <ZoomOut className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className={`p-2 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-[#FFD700]/20"}`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-[#DC2626] rounded-full"></div>
                          <span>Caller</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                          <span>Units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* AI Analysis */}
            <Card className={cardClasses}>
              <CardHeader
                className="cursor-pointer hover:opacity-80 transition-colors"
                onClick={() => toggleSection("analysis")}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-[#FFD700]" />
                    <span>AI Analysis</span>
                  </div>
                  {expandedSections.analysis ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedSections.analysis && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Caller Emotion</span>
                      <Badge className="bg-red-100 text-red-800">{callerInfo.emotion}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Urgency Level</span>
                        <span className="font-semibold">{callerInfo.urgency}/10</span>
                      </div>
                      <Progress value={callerInfo.urgency * 10} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Concerns</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-xs">Active domestic violence</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span className="text-xs">Potential head injury</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-xs">Perpetrator on scene</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Medical Info */}
            <Card className={cardClasses}>
              <CardHeader
                className="cursor-pointer hover:opacity-80 transition-colors"
                onClick={() => toggleSection("medical")}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-green-600" />
                    <span>Medical History</span>
                  </div>
                  {expandedSections.medical ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedSections.medical && (
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Conditions</h4>
                    <p className="text-xs opacity-70">Anxiety disorder, Previous concussion</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Medications</h4>
                    <p className="text-xs opacity-70">Sertraline, Rescue inhaler</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Allergies</h4>
                    <p className="text-xs text-red-600">Penicillin</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                    <p className="text-xs opacity-70">Linda Johnson (510) 555-6543</p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Response Units */}
            <Card className={cardClasses}>
              <CardHeader
                className="cursor-pointer hover:opacity-80 transition-colors"
                onClick={() => toggleSection("units")}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <span>Response Units</span>
                  </div>
                  {expandedSections.units ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
              {expandedSections.units && (
                <CardContent className="space-y-3">
                  {responseUnits.map((unit) => (
                    <div
                      key={unit.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {unit.type === "Police" && <Shield className="h-4 w-4 text-blue-600" />}
                        {unit.type === "EMS" && <Heart className="h-4 w-4 text-red-600" />}
                        <div>
                          <p className="text-sm font-medium">{unit.id}</p>
                          <p className="text-xs opacity-70">ETA: {unit.eta} min</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          unit.status === "En Route"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                      >
                        {unit.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Action Bar with Halo styling */}
        <div className={`mt-6 p-4 rounded-lg border ${cardClasses}`}>
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Alert
              </Button>
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10">
                <Plus className="h-4 w-4 mr-2" />
                Add Unit
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Guardian Online</span>
              </div>
              <Button variant="outline" className="border-[#FFD700]/30 hover:bg-[#FFD700]/10">
                End Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
