import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, BarChart3, BookOpen, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-700 mb-6">
          Sharpen Your Coding Skills 
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Solve coding challenges, track your progress, and grow into a confident problem solver.  
          Join our community and start your journey today!
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <a href="/problem">Start Solving</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="hover:bg-indigo-100">
            <a href="/register">Join Now</a>
          </Button>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-10">How It Works ✨</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { step: "1. Explore Problems", desc: "Browse coding challenges by difficulty & topic." },
            { step: "2. Solve & Submit", desc: "Write your solution and get instant verdicts." },
            { step: "3. Track Progress", desc: "Monitor stats, streaks, and grow consistently." },
          ].map((item, idx) => (
            <Card key={idx} className="rounded-2xl shadow-md hover:shadow-xl transition">
              <CardHeader>
                <CardTitle className="text-indigo-700">{item.step}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">{item.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <Card className="rounded-2xl hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-700">
                <BookOpen /> <span>Rich Problem Library</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              Solve problems across categories & real-world scenarios.
            </CardContent>
          </Card>

          <Card className="rounded-2xl hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-700">
                <BarChart3 /> <span>Detailed Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              Track accuracy, streaks, success rate, and more.
            </CardContent>
          </Card>

          <Card className="rounded-2xl hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-700">
                <Users /> <span>AI Support </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              Get instant AI code review on submitting problems.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
  <h2 className="text-3xl font-bold text-indigo-700 mb-10">🌟 Upcoming Features</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center">
    {[
      { title: "Contests", desc: "Compete in live challenges & climb leaderboards." },
      { title: "Leaderboard", desc: "Compare progress & achievements with others." },
    ].map((item, idx) => (
      <Card
        key={idx}
        className="rounded-2xl border-dashed border-2 border-indigo-200 hover:shadow-lg transition"
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2 text-indigo-600">
            <Sparkles /> <span>{item.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">{item.desc}</CardContent>
      </Card>
    ))}
  </div>
</section>

      {/* Final CTA */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to take your coding skills to the next level?
        </h2>
        <Button asChild size="lg" variant="secondary" className="bg-white text-indigo-700 hover:bg-gray-100">
          <a href="/problem" className="flex items-center space-x-2">
            <span>Start Solving Now</span> <ArrowRight size={18} />
          </a>
        </Button>
      </section>
    </div>
  );
}
