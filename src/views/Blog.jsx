import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Blog() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.getBlogs();
        setBlogPosts(data.blogs.filter(b => b.isPublished) || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin"></div></div>;
  }

  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null;
  const otherPosts = blogPosts.length > 1 ? blogPosts.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 selection:bg-[#E050D0]/20 selection:text-[#E050D0]">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100 pt-12 pb-12 sm:pt-16 sm:pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-[#E050D0]/10 text-[#E050D0] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            Our Journal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-5">
            Avian Care & Tips
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Expert advice, training tips, and the latest news in pet bird care to help your feathered family members thrive.
          </p>
        </div>
      </section>

      {latestPost && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div 
          onClick={() => navigate(`/blog/${latestPost._id}`)}
          className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_16px_40px_rgba(224,80,208,0.15)] hover:-translate-y-1 transition-all duration-300 border border-gray-100 grid grid-cols-1 lg:grid-cols-2"
        >
          <div className="relative h-64 sm:h-80 lg:h-full overflow-hidden bg-gray-100">
            <img 
              src={latestPost.image} 
              alt={latestPost.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-6 left-6 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Latest Post
            </div>
          </div>
          <div className="p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-4">
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-[#E050D0]"/> {latestPost.date}</span>
              <span className="flex items-center gap-1.5"><Tag size={16} className="text-[#E050D0]"/> {latestPost.tag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 group-hover:text-[#E050D0] transition-colors leading-tight mb-4">
              {latestPost.title}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 text-base sm:text-lg">
              {latestPost.excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E050D0]/10 flex items-center justify-center text-[#E050D0] font-bold">
                  {latestPost.author.charAt(0)}
                </div>
                <div className="text-sm font-semibold text-gray-900">{latestPost.author}</div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#E050D0]">
                Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* All Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          All Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {otherPosts.map((post) => (
            <div 
              key={post._id}
              onClick={() => navigate(`/blog/${post._id}`)}
              className="bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(224,80,208,0.12)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {post.tag}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-3">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h4 className="font-extrabold text-lg text-gray-900 group-hover:text-[#E050D0] transition-colors leading-snug mb-3 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <User size={14} className="text-[#E050D0]"/> {post.author}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#E050D0]">
                    Read <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
