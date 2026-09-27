import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      try {
        const { data } = await api.getBlogs();
        const blogs = data.blogs || [];
        const currentPost = blogs.find(p => p._id === id);
        setPost(currentPost);
        setRelatedPosts(blogs.filter(p => p._id !== id).slice(0, 3));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin"></div></div>;
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF8F5]">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Article Not Found</h1>
        <button 
          onClick={() => navigate('/blog')}
          className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-neutral-800 transition-colors"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 selection:bg-[#E050D0]/20 selection:text-[#E050D0]">
      {/* Hero Header */}
      <section className="relative w-full h-[40vh] min-h-[350px] bg-gray-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-12">
          <button 
            onClick={() => navigate('/blog')}
            className="self-start mb-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} /> Back to all articles
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#E050D0] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {post.tag}
            </span>
            <span className="text-white/80 text-sm font-medium flex items-center gap-1.5">
              <Calendar size={14} /> {post.date}
            </span>
            <span className="text-white/80 text-sm font-medium hidden sm:block">
              &bull; {post.readTime}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 font-bold">
              {post.author.charAt(0)}
            </div>
            <div className="text-white font-medium">{post.author}</div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-lg prose-pink max-w-none text-gray-600 whitespace-pre-wrap">
          {post.content}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <h4 className="font-bold text-gray-900">Share this article</h4>
          <div className="flex gap-2">
            {['Twitter', 'Facebook', 'Copy Link'].map(social => (
              <button key={social} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-semibold text-gray-700 transition-colors">
                {social}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="bg-[#FAF8F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Read Next
            </h3>
            <button 
              onClick={() => navigate('/blog')}
              className="text-[#E050D0] font-bold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {relatedPosts.map((relatedPost) => (
              <div 
                key={relatedPost._id}
                onClick={() => navigate(`/blog/${relatedPost._id}`)}
                className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {relatedPost.tag}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-extrabold text-lg text-gray-900 group-hover:text-[#E050D0] transition-colors leading-snug mb-3 line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <User size={14} className="text-[#E050D0]"/> {relatedPost.author}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#E050D0]">
                      Read <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
