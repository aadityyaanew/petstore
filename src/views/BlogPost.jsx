import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    tag: 'Care & Health',
    date: '24 May 2024',
    title: 'Top 5 Fun Foraging Toys to Keep Your Bird Entertained',
    excerpt: "Discover the best ways to stimulate your feathered friend's mind and body with these top-rated foraging toys designed for ultimate engagement.",
    author: 'Dr. Sarah Jenkins',
    image: '/assets/asset-bafedd16.jpeg',
    readTime: '5 min read',
    content: `
      <h2>Why Foraging Matters</h2>
      <p>In the wild, parrots spend up to 70% of their waking hours foraging for food. In our homes, a bowl full of seeds simply doesn't provide the mental or physical stimulation they naturally crave. Introducing foraging toys is one of the easiest ways to improve your bird's well-being and reduce behaviors like feather plucking or excessive screaming.</p>
      
      <h3>1. The Classic Foraging Wheel</h3>
      <p>Foraging wheels are excellent for beginners. You can place their favorite treats—like a piece of almond or a sunflower seed—inside the compartments. Your bird has to turn the wheel to drop the treat down to the opening.</p>
      
      <h3>2. Woven Palm Leaf Pockets</h3>
      <p>Birds love destruction! Woven palm leaf or vine pockets can be stuffed with shredded paper, wooden beads, and hidden treats. These provide a satisfying crunch and tap into their natural instinct to chew and shred while hunting for food.</p>

      <h3>3. Stainless Steel Skewers</h3>
      <p>A reusable stainless steel skewer is a staple. You can thread fresh vegetables, fruits, and wooden blocks onto it. It forces the bird to work for their food and keeps them engaged for hours.</p>

      <h3>4. Cardboard Box Puzzles</h3>
      <p>You don't always need to buy expensive toys. Simple cardboard boxes (uninked and tape-free) stuffed with crinkle paper and hidden pellets can keep a cockatiel or conure occupied for an entire afternoon.</p>

      <h3>5. Acrylic Puzzle Boxes</h3>
      <p>For advanced foragers like African Greys or Macaws, acrylic puzzles that require turning dials, pulling levers, or unscrewing bolts offer the intense mental challenge they need.</p>
      
      <p><strong>Conclusion:</strong> Start simple and slowly increase the difficulty as your bird learns how to forage. Watching them figure out a puzzle is incredibly rewarding!</p>
    `
  },
  {
    id: 2,
    tag: 'Buying Guide',
    date: '20 May 2024',
    title: 'The Ultimate Guide to Choosing the Right Perch for Your Parrot',
    excerpt: 'Not all perches are created equal. Learn how to select the perfect texture, diameter, and material to prevent bumblefoot and promote foot health.',
    author: 'Mark Wood',
    image: '/assets/asset-b7038046.jpeg',
    readTime: '8 min read',
    content: `
      <h2>The Importance of Perch Variety</h2>
      <p>Your bird spends almost its entire life on its feet. Providing the wrong type of perches can lead to a condition known as "bumblefoot" (pododermatitis) and arthritis. The key to healthy feet is variety in both diameter and texture.</p>
      
      <h3>Natural Wood Branches</h3>
      <p>These should make up the majority of the perches in your cage. Woods like Manzanita, Java wood, Ribbonwood, and Bottlebrush offer varying thicknesses along a single branch, naturally exercising your bird's feet. Make sure to choose the right diameter for your species so their toes do not completely wrap around or fail to grip the branch.</p>
      
      <h3>Rope Perches</h3>
      <p>Cotton or sisal rope perches are excellent for sleeping as they are soft on the feet. However, they must be monitored daily. If your bird is a heavy chewer, ingested cotton fibers can cause life-threatening crop impactions. Trim frayed edges immediately.</p>
      
      <h3>Pedicure / Cement Perches</h3>
      <p>These are great for keeping nails blunt, but they should NEVER be placed at the highest point in the cage where the bird sleeps. Put them near food bowls where the bird will spend a limited amount of time. Too much time on rough surfaces causes foot sores.</p>

      <h3>What to Avoid: Dowel Perches</h3>
      <p>Smooth, uniform wooden dowels (the kind that come standard with most cages) are the worst offenders for foot health. They apply pressure to the exact same part of the foot all day long. Discard them or use them sparingly!</p>
    `
  },
  {
    id: 3,
    tag: 'Wellness',
    date: '15 May 2024',
    title: "Why Wood Toys Are Essential for Your Feathered Friend's Health",
    excerpt: 'Chewing is a natural instinct for birds. Find out why providing safe, non-toxic wood toys is crucial for beak maintenance and mental well-being.',
    author: 'Emily Carter',
    image: '/assets/asset-f3942b3d.jpeg',
    readTime: '6 min read',
    content: `
      <h2>More Than Just Play</h2>
      <p>When you see your parrot turn a beautiful, expensive wooden toy into toothpicks in a matter of hours, you might feel frustrated. But you should actually be celebrating! Chewing and destroying wood is a fundamental biological need for parrots.</p>

      <h3>Beak Maintenance</h3>
      <p>A parrot's beak grows continuously throughout its life, just like human fingernails. Chewing on soft and hard woods naturally files the beak down, preventing overgrowth that could eventually hinder their ability to eat.</p>

      <h3>Mental Health and Stress Relief</h3>
      <p>In the wild, parrots use their beaks to excavate nesting cavities and strip bark from trees to find insects. Providing wood to chew gives them an outlet for this deeply ingrained instinct. Birds lacking appropriate chewing outlets often redirect this energy into destructive behaviors like feather plucking, screaming, or biting.</p>

      <h3>Safe Woods vs. Toxic Woods</h3>
      <p>Not all wood is safe. Always ensure toys are made from bird-safe woods like Pine, Balsa, Mahogany, Birch, or Apple wood. Avoid any toys made from Cedar, Oak, or treated lumber, which contain toxins or dangerous chemicals.</p>
    `
  },
  {
    id: 4,
    tag: 'Nutrition',
    date: '10 May 2024',
    title: 'Transitioning Your Bird to a Pellet Diet: A Step-by-Step Approach',
    excerpt: 'Struggling with a seed junkie? Follow our proven, stress-free method to safely transition your pet bird onto a healthy, balanced pelleted diet.',
    author: 'Dr. Sarah Jenkins',
    image: '/assets/asset-4cbbe7b6.jpeg',
    readTime: '10 min read',
    content: `
      <h2>Breaking the Seed Addiction</h2>
      <p>An all-seed diet is the leading cause of malnutrition, fatty liver disease, and shortened lifespans in pet birds. Seeds are high in fat and low in essential vitamins like Vitamin A and Calcium. A high-quality pelleted diet should make up 60-70% of your bird's intake. But how do you get a stubborn seed-junkie to switch?</p>
      
      <h3>The "Cold Turkey" Method (Not Recommended)</h3>
      <p>Never simply take away seeds and replace them with pellets. Birds are notoriously stubborn and may literally starve themselves to death rather than eat something they don't recognize as food.</p>
      
      <h3>Step 1: Introduction</h3>
      <p>Start by mixing a small amount of pellets into their regular seed mix. Let them get used to seeing and feeling the new shape. You can also pretend to eat the pellets yourself—parrots are flock eaters and want what you are eating!</p>
      
      <h3>Step 2: The Mash Method</h3>
      <p>Crush the pellets into a fine powder and sprinkle them over chopped, moist fruits and vegetables (like sweet potato or apple). As they eat their favorite fresh foods, they will inevitably ingest the pellet powder and get used to the taste.</p>

      <h3>Step 3: Gradual Reduction</h3>
      <p>Over a period of 2-4 weeks, slowly increase the ratio of pellets to seeds. Monitor your bird's droppings. If their droppings decrease in volume or turn dark and sparse, they are not eating enough and you need to slow down the transition.</p>
    `
  },
  {
    id: 5,
    tag: 'Training',
    date: '02 May 2024',
    title: 'Basic Target Training for Parrots: Building Trust and Communication',
    excerpt: "Target training is the foundation of all bird tricks. Learn how to get started with just a chopstick, a clicker, and your bird's favorite treats.",
    author: 'Avian Expert Team',
    image: '/assets/asset-bff48261.jpeg',
    readTime: '7 min read',
    content: `
      <h2>The Magic of Target Training</h2>
      <p>Target training is incredibly simple but powerful. It involves teaching your bird to touch a specific object (the target) with its beak on command. Once they know this, you can guide them anywhere—into a cage, onto a scale, or into a travel carrier—without forcing them.</p>

      <h3>What You Need</h3>
      <ul>
        <li>A target stick (a chopstick or a wooden skewer with the sharp end cut off works perfectly)</li>
        <li>A clicker (or a consistent mouth click sound)</li>
        <li>High-value treats (tiny pieces of millet, almond, or sunflower seed)</li>
      </ul>

      <h3>Step 1: The First Touch</h3>
      <p>Hold the target stick near your bird. Out of curiosity, they will likely lean over and bite or touch it. The exact second their beak makes contact with the stick, click your clicker and immediately hand them a treat.</p>

      <h3>Step 2: Repetition</h3>
      <p>Repeat this 5 to 10 times in a short session. The bird will quickly realize: <em>Touch stick = Click = Treat</em>.</p>

      <h3>Step 3: Adding Distance</h3>
      <p>Once they reliably touch the stick right in front of them, move the stick an inch away so they have to take a step to reach it. Click and reward. Gradually increase the distance until the bird is walking or flying across the room to touch the target!</p>
    `
  }
];

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const post = BLOG_POSTS.find(p => p.id === parseInt(id));

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

  // Find related posts (just next 3 posts)
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);

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
        <div className="prose prose-lg prose-pink max-w-none text-gray-600">
          {/* We inject HTML since our content has markup */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
                key={relatedPost.id}
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
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
