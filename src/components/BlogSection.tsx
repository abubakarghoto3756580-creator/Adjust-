import React, { useState } from 'react';
import { BLOG_POSTS_DATA } from '../data';
import { BlogPost } from '../types';
import { Calendar, Clock, User, ChevronRight, X, BookOpen, Tag, Share2, Check } from 'lucide-react';

interface BlogSectionProps {
  onBookNowClick: () => void;
}

export default function BlogSection({ onBookNowClick }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="blog" className="relative py-24 bg-void-black border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase">TUNER INSIGHTS & ARTICLES</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-steel-white tracking-wider uppercase">
              GARAGE <span className="text-blood-red">BLOG</span>
            </h2>
          </div>
          <p className="text-sm text-chrome-silver max-w-md leading-relaxed">
            Technical breakdowns, tuning guides, and performance engineering insights directly from the master technicians at Dreamville Auto.
          </p>
        </div>

        {/* BLOG POST CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {BLOG_POSTS_DATA.map((post) => (
            <div
              key={post.id}
              className="bg-carbon-gray border border-neutral-900 hover:border-blood-red/40 rounded-none overflow-hidden flex flex-col md:flex-row transition-all duration-300 group shadow-lg"
            >
              {/* Post Cover Image */}
              <div className="md:w-1/2 relative min-h-[260px] md:min-h-[340px] overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-gray via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-carbon-gray" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-blood-red text-steel-white px-3 py-1 rounded-none text-[10px] font-mono font-bold tracking-widest uppercase shadow-md">
                  {post.category}
                </div>
              </div>

              {/* Post Info & Summary */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-chrome-silver">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-blood-red" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-blood-red" />
                      {post.readTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User size={13} className="text-blood-red" />
                      {post.author}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-rajdhani text-2xl md:text-3xl font-bold text-steel-white group-hover:text-blood-red transition-colors leading-tight">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs md:text-sm text-chrome-silver leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-950 border border-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded-none text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Read Full Article Button */}
                <div className="border-t border-neutral-900/80 pt-6 mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="inline-flex items-center gap-2 bg-neutral-950 border border-neutral-800 hover:border-blood-red text-steel-white hover:text-blood-red px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group-hover:translate-x-1 duration-200"
                  >
                    <BookOpen size={14} className="text-blood-red" />
                    <span>READ FULL ARTICLE</span>
                    <ChevronRight size={14} />
                  </button>

                  <button
                    onClick={onBookNowClick}
                    className="hidden sm:inline-flex text-[11px] font-mono text-blood-red hover:underline tracking-wider uppercase"
                  >
                    BOOK TUNING SESSION &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ARTICLE READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-void-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-fade-in">
          <div className="relative bg-carbon-gray border border-neutral-800 rounded-none w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
            
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 bg-carbon-gray/95 border-b border-neutral-800 p-4 md:px-8 flex items-center justify-between backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blood-red animate-pulse" />
                <span className="font-mono text-xs text-chrome-silver uppercase tracking-widest">
                  DREAMVILLE ARTICLE READER
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-chrome-silver text-xs font-mono px-3 py-1.5 rounded-none transition-colors"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                  <span>{copied ? 'COPIED LINK' : 'SHARE'}</span>
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 rounded-none bg-neutral-900 hover:bg-neutral-800 text-steel-white border border-neutral-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Article Content */}
            <div className="p-6 md:p-10 flex flex-col gap-6">
              
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-chrome-silver">
                <span className="bg-blood-red text-steel-white px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-blood-red" />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-blood-red" />
                  {selectedPost.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-rajdhani text-3xl md:text-5xl font-extrabold text-steel-white leading-tight">
                {selectedPost.title}
              </h1>

              {/* Author Box */}
              <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-900 rounded-none p-4">
                <div className="w-10 h-10 rounded-full bg-carbon-gray border border-blood-red flex items-center justify-center font-bebas text-lg text-steel-white">
                  MV
                </div>
                <div className="flex flex-col">
                  <span className="font-rajdhani text-sm font-bold text-steel-white">{selectedPost.author}</span>
                  <span className="font-mono text-[10px] text-blood-red uppercase tracking-wider">{selectedPost.authorTitle}</span>
                </div>
              </div>

              {/* Hero Image */}
              <div className="rounded-none overflow-hidden border border-neutral-800 max-h-[400px]">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Paragraphs */}
              <div className="flex flex-col gap-4 text-sm md:text-base text-chrome-silver leading-relaxed font-sans pt-2">
                {selectedPost.content.map((paragraph, i) => (
                  <p key={i} className="bg-neutral-950/40 border-l-2 border-blood-red/60 pl-4 py-1">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-900">
                <Tag size={14} className="text-blood-red" />
                {selectedPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-950 border border-neutral-800 text-chrome-silver px-3 py-1 rounded-none text-xs font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Call To Action Box */}
              <div className="bg-gradient-to-r from-neutral-950 via-carbon-gray to-neutral-950 border border-blood-red/40 rounded-none p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <h4 className="font-rajdhani text-xl font-bold text-steel-white uppercase tracking-wider">
                    READY TO UNLOCK YOUR CAR'S POTENTIAL?
                  </h4>
                  <p className="text-xs text-chrome-silver">
                    Schedule a custom dyno session or diagnostic remapping with our calibration engineers today.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    onBookNowClick();
                  }}
                  className="bg-blood-red hover:bg-red-700 text-steel-white px-8 py-3 text-xs font-rajdhani font-bold tracking-widest uppercase rounded-none cursor-pointer transition-all hover:scale-105 shrink-0 shadow-[0_0_15px_rgba(196,30,30,0.4)]"
                >
                  BOOK TUNING SESSION
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
