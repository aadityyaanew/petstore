import { useState, useEffect } from 'react';
import { FileText, Trash2, Plus, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../services/api';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    isPublished: true,
  });

  const fetchBlogs = async () => {
    try {
      const { data } = await api.getBlogs();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      isPublished: blog.isPublished,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', author: 'Admin', isPublished: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.updateBlog(editingId, formData);
      } else {
        await api.createBlog(formData);
      }
      handleCancelEdit();
      fetchBlogs();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.deleteBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
          <FileText size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">Manage Blogs</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? <Edit size={20} /> : <Plus size={20} />} 
              {editingId ? 'Edit Post' : 'Create Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Title</label>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="Blog post title"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Author</label>
                <Input 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[200px]"
                  placeholder="Write your blog content here..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="isPublished" 
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-pink rounded border-gray-300 focus:ring-brand-pink"
                />
                <label htmlFor="isPublished" className="text-sm font-semibold">Published</label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (editingId ? 'Update' : 'Publish')}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-accent/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Author</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-accent/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-pink truncate max-w-[200px]">{blog.title}</td>
                      <td className="px-6 py-4">{blog.author}</td>
                      <td className="px-6 py-4">
                        <Badge variant={blog.isPublished ? "success" : "secondary"}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEdit(blog)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No blogs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
