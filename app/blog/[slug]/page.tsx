import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Eye, Tag, Share2 } from "lucide-react";

interface BlogArticlePageProps {
  params: {
    slug: string;
  };
}

const articlesData: Record<string, any> = {
  "ui-ux-designers": {
    title: "Top 10 UI/UX Designers To Follow For Better Product Thinking",
    category: "Tutorial",
    date: "Feb 14, 2025",
    readTime: "5 min read",
    views: 240,
    image: "/assets/img/blog/1.jpg",
    tags: ["UI/UX", "Product Design", "Tutorial"],
    content: `
      <p>Following exceptional UI/UX designers is one of the fastest ways to improve your design judgment, layout hierarchy, and product taste.</p>
      <p>The best designers teach through systems, user flows, and thoughtful decision-making, not only through polished final screens.</p>
      <blockquote style="border-left: 4px solid #00E5FF; padding-left: 16px; margin: 24px 0; color: #00E5FF; font-style: italic;">
        “Great design is about making product complexity feel calm, clear, and purposeful.”
      </blockquote>
      <h3 style="font-size: 1.5rem; font-weight: bold; color: white; margin-top: 24px; margin-bottom: 12px;">Why Strong UI/UX Designers Are Worth Following</h3>
      <p>Their case studies usually reveal more than visual taste. They expose hierarchy, spacing, onboarding logic, and the reasoning behind every interaction.</p>
    `,
  },
  "app-development-guides": {
    title: "App Development Guides For Teams Building Better Products",
    category: "Tips",
    date: "Apr 09, 2025",
    readTime: "4 min read",
    views: 185,
    image: "/assets/img/blog/2.jpg",
    tags: ["App Development", "Architecture"],
    content: `
      <p>Strong app development does not begin with features. It begins with deciding what the product must do clearly, reliably, and fast for the user.</p>
      <p>Good development guides help teams move from idea to release with fewer surprises by giving structure to planning, architecture, testing, and iteration.</p>
    `,
  },
  "learn-graphic-design-free": {
    title: "Learn Graphic Design Free With Smarter Practice Habits",
    category: "Freebies",
    date: "Jun 21, 2025",
    readTime: "6 min read",
    views: 310,
    image: "/assets/img/blog/3.jpg",
    tags: ["Graphic Design", "Freebies"],
    content: `
      <p>Learning graphic design for free is realistic if your practice is focused. The internet has more than enough resources, but progress depends on how intentionally you use them.</p>
    `,
  },
};

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const article = articlesData[params.slug] || {
    title: (params.slug || "Article").replace(/-/g, " ").toUpperCase(),
    category: "Engineering",
    date: "July 2026",
    readTime: "5 min read",
    views: 120,
    image: "/assets/img/blog/1.jpg",
    tags: ["Software", "Development"],
    content: "<p>Welcome to our engineering article. Discover product design, scalable architecture, and full stack Node.js best practices.</p>",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-wider mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 inline-block mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 border-b border-white/10 pb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#00E5FF]" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {article.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-[#00E5FF]" />
              {article.views} Views
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden mb-10 border border-white/10">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div
          className="p-8 sm:p-10 rounded-3xl bg-[#0A0A0A] border border-white/10 text-slate-300 leading-relaxed text-base space-y-4 mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#00E5FF]" />
            <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">Tags:</span>
            {article.tags.map((t: string) => (
              <span
                key={t}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] font-semibold cursor-pointer">
            <Share2 className="w-4 h-4" />
            <span>Share Article</span>
          </div>
        </div>
      </div>
    </main>
  );
}
