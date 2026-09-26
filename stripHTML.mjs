import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function stripHtml(html) {
  // Replace <p>, <h2>, <h3> etc with newlines for formatting
  let text = html.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<li>/gi, '• ');
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>?/gm, '');
  
  // Clean up excessive newlines
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  return text.trim();
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB for HTML stripping');
    const Blog = (await import('./src/lib/models/Blog.js')).default;
    
    const blogs = await Blog.find({});
    for (const blog of blogs) {
      const plainText = stripHtml(blog.content);
      blog.content = plainText;
      await blog.save();
    }
    
    console.log('HTML stripped from all blogs');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
