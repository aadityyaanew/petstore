import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, UploadCloud, Trash2, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import api, { BASE_URL } from '../../services/api';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('media');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', slug: '', shortDescription: '', description: '',
    category: '', subCategory: '', petType: 'parrot', brand: '',
    price: '', originalPrice: '', currency: 'INR',
    sku: '', stock: '', lowStockThreshold: 10, trackInventory: true,
    status: 'active', isFeatured: false, isNewArrival: false,
    images: [],
    variants: [],
    highlights: [''],
    specs: [{ key: '', value: '' }],
    care: '',
    feedingInstructions: { description: '', recommendedAge: '', waterRequired: false },
    faqs: [{ question: '', answer: '' }],
    shipping: { weight: '', weightUnit: 'kg', freeShipping: false, shippingCharge: '', estimatedDeliveryDays: { min: '', max: '' } },
    returnPolicy: { returnable: true, returnWindowDays: 7, conditions: '' },
    tags: '',
    seo: { metaTitle: '', metaDescription: '', keywords: '' }
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.data.categories || []);
      if (!isEditing && res.data.categories?.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: res.data.categories[0].name }));
      }
    } catch (error) { console.error('Error fetching categories:', error); }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.getProductById(id);
      const p = res.data;
      setFormData({
        ...p,
        variants: p.variants || [],
        images: p.images?.map(img => typeof img === 'string' ? { url: img, alt: p.name || '', isPrimary: false } : img) || [],
        highlights: p.highlights?.length ? p.highlights : [''],
        specs: p.specs?.length ? p.specs : [{ key: '', value: '' }],
        faqs: p.faqs?.length ? p.faqs : [{ question: '', answer: '' }],
        tags: p.tags?.join(', ') || '',
        seo: {
          metaTitle: p.seo?.metaTitle || '',
          metaDescription: p.seo?.metaDescription || '',
          keywords: p.seo?.keywords?.join(', ') || ''
        },
        shipping: {
          weight: p.shipping?.weight || '',
          weightUnit: p.shipping?.weightUnit || 'kg',
          freeShipping: p.shipping?.freeShipping || false,
          shippingCharge: p.shipping?.shippingCharge || '',
          estimatedDeliveryDays: {
            min: p.shipping?.estimatedDeliveryDays?.min || '',
            max: p.shipping?.estimatedDeliveryDays?.max || ''
          }
        },
        returnPolicy: {
          returnable: p.returnPolicy?.returnable ?? true,
          returnWindowDays: p.returnPolicy?.returnWindowDays || 7,
          conditions: p.returnPolicy?.conditions || ''
        },
        feedingInstructions: {
          description: p.feedingInstructions?.description || '',
          recommendedAge: p.feedingInstructions?.recommendedAge || '',
          waterRequired: p.feedingInstructions?.waterRequired || false
        }
      });
    } catch (error) {
      alert('Product not found');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData({ ...formData, [parts[0]]: { ...formData[parts[0]], [parts[1]]: val } });
      } else if (parts.length === 3) {
        setFormData({ ...formData, [parts[0]]: { ...formData[parts[0]], [parts[1]]: { ...formData[parts[0]][parts[1]], [parts[2]]: val } } });
      }
    } else {
      setFormData({ ...formData, [name]: val });
    }
  };

  // Image Upload Logic
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.images.length + files.length > 5) return alert('Max 5 images allowed.');

    setUploading(true);
    try {
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('image', file);
        const { data } = await api.uploadImage(uploadData);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { url: data.imageUrl, alt: prev.name, isPrimary: prev.images.length === 0 }]
        }));
      }
    } catch (error) { alert('Upload failed'); } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const removeImage = (index) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  // Array Field Handlers
  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    if (key === null) newArray[index] = value;
    else newArray[index][key] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  const addArrayItem = (field, emptyItem) => setFormData({ ...formData, [field]: [...formData[field], emptyItem] });
  const removeArrayItem = (field, index) => setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        seo: { ...formData.seo, keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) },
        highlights: formData.highlights.filter(Boolean),
        specs: formData.specs.filter(s => s.key && s.value),
        faqs: formData.faqs.filter(f => f.question && f.answer),
        images: formData.images.map(img => typeof img === 'string' ? img : img.url)
      };

      if (isEditing) await api.updateProduct(id, dataToSubmit);
      else await api.createProduct(dataToSubmit);
      
      navigate('/admin/products');
    } catch (error) { alert(error.response?.data?.message || 'Error saving product'); } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'media', label: 'Images & Media' },
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing & Inventory' },
    { id: 'variants', label: 'Variants' },
    { id: 'details', label: 'Details & Specs' },
    { id: 'shipping', label: 'Shipping & SEO' }
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><ArrowLeft size={24} /></Link>
          <div className="w-12 h-12 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center"><Package size={24} /></div>
          <h1 className="text-3xl font-extrabold text-foreground">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
        <Button onClick={handleSubmit} disabled={saving} className="gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white shadow-md">
          <CheckCircle2 size={18} /> {saving ? 'Saving...' : 'Save Product'}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-brand-pink text-white shadow-md' : 'text-muted-foreground hover:bg-accent/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-8">

            {/* TAB: MEDIA */}
            <div className={activeTab === 'media' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-bold mb-6">Product Images</h2>
              <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
                <p className="text-muted-foreground">Upload up to 5 high-quality images. The first image will be the primary one.</p>
                {uploading && <span className="text-brand-pink text-sm animate-pulse">Uploading...</span>}
              </div>
              
              <input type="file" hidden multiple ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-border aspect-square bg-gray-50">
                    <img src={img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`} alt={img.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImage(index)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"><Trash2 size={16} /></button>
                    </div>
                    {img.isPrimary && <span className="absolute top-2 left-2 bg-brand-pink text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">Primary</span>}
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <button type="button" onClick={handleUploadClick} disabled={uploading} className="border-2 border-dashed border-border hover:border-brand-pink hover:bg-brand-pink/5 rounded-xl flex flex-col items-center justify-center gap-2 aspect-square transition-all text-muted-foreground hover:text-brand-pink">
                    <UploadCloud size={28} />
                    <span className="text-sm font-medium">Add Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB: BASIC INFO */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">Basic Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="font-semibold text-sm">Product Name *</label><Input name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="space-y-2"><label className="font-semibold text-sm">Slug (URL)</label><Input name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. premium-parrot-food" /></div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm">Category *</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="" disabled>Select Category</option>
                      {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2"><label className="font-semibold text-sm">Sub-Category</label><Input name="subCategory" value={formData.subCategory} onChange={handleChange} /></div>
                  <div className="space-y-2"><label className="font-semibold text-sm">Pet Type</label><Input name="petType" value={formData.petType} onChange={handleChange} placeholder="e.g. parrot, dog, cat" /></div>
                  <div className="space-y-2"><label className="font-semibold text-sm">Brand</label><Input name="brand" value={formData.brand} onChange={handleChange} /></div>
                </div>
                <div className="space-y-2"><label className="font-semibold text-sm">Short Description</label><Textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} /></div>
                <div className="space-y-2"><label className="font-semibold text-sm">Full Description *</label><Textarea name="description" value={formData.description} onChange={handleChange} required rows={6} /></div>
                
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded text-brand-pink focus:ring-brand-pink" /> Featured Product
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="rounded text-brand-pink focus:ring-brand-pink" /> New Arrival
                  </label>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    Status: 
                    <select name="status" value={formData.status} onChange={handleChange} className="border border-border rounded-md px-2 py-1 ml-2 text-sm">
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB: PRICING & INVENTORY */}
            <div className={activeTab === 'pricing' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">Pricing & Inventory</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2"><label className="font-semibold text-sm">Selling Price *</label><Input type="number" name="price" value={formData.price} onChange={handleChange} required /></div>
                <div className="space-y-2"><label className="font-semibold text-sm">Base Price (MSRP)</label><Input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} /></div>
                <div className="space-y-2"><label className="font-semibold text-sm">Currency</label><Input name="currency" value={formData.currency} onChange={handleChange} /></div>
                
                <div className="space-y-2"><label className="font-semibold text-sm">Base SKU</label><Input name="sku" value={formData.sku} onChange={handleChange} /></div>
                <div className="space-y-2"><label className="font-semibold text-sm">Stock Quantity *</label><Input type="number" name="stock" value={formData.stock} onChange={handleChange} required /></div>
                <div className="space-y-2"><label className="font-semibold text-sm">Low Stock Alert</label><Input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} /></div>
              </div>
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input type="checkbox" name="trackInventory" checked={formData.trackInventory} onChange={handleChange} className="rounded text-brand-pink focus:ring-brand-pink" /> Track Inventory
                </label>
              </div>
            </div>

            {/* TAB: VARIANTS */}
            <div className={activeTab === 'variants' ? 'block' : 'hidden'}>
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-2xl font-bold">Product Variants</h2>
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('variants', { name: '', sku: '', price: '', originalPrice: '', stock: '' })} className="gap-2"><Plus size={16}/> Add Variant</Button>
              </div>
              <div className="space-y-4">
                {formData.variants.map((v, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-4 p-4 border border-border rounded-xl bg-gray-50/50">
                    <div className="flex-1 min-w-[150px]"><label className="text-xs font-semibold mb-1 block">Variant Name</label><Input value={v.name} onChange={e => handleArrayChange('variants', i, 'name', e.target.value)} placeholder="e.g. 500g, Large, Red" /></div>
                    <div className="w-32"><label className="text-xs font-semibold mb-1 block">SKU</label><Input value={v.sku} onChange={e => handleArrayChange('variants', i, 'sku', e.target.value)} /></div>
                    <div className="w-24"><label className="text-xs font-semibold mb-1 block">Price</label><Input type="number" value={v.price} onChange={e => handleArrayChange('variants', i, 'price', e.target.value)} /></div>
                    <div className="w-24"><label className="text-xs font-semibold mb-1 block">MSRP</label><Input type="number" value={v.originalPrice} onChange={e => handleArrayChange('variants', i, 'originalPrice', e.target.value)} /></div>
                    <div className="w-24"><label className="text-xs font-semibold mb-1 block">Stock</label><Input type="number" value={v.stock} onChange={e => handleArrayChange('variants', i, 'stock', e.target.value)} /></div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem('variants', i)}><Trash2 size={16} /></Button>
                  </div>
                ))}
                {formData.variants.length === 0 && <p className="text-muted-foreground text-sm text-center py-8 bg-gray-50 rounded-xl border border-dashed">No variants configured. Product will be sold as a single item.</p>}
              </div>
            </div>

            {/* TAB: DETAILS & SPECS */}
            <div className={activeTab === 'details' ? 'block' : 'hidden'}>
              <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">Details & Specifications</h2>
              
              {/* Specs */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3"><h3 className="font-bold">Specifications</h3><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('specs', { key: '', value: '' })}>Add Spec</Button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.specs.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={spec.key} onChange={e => handleArrayChange('specs', i, 'key', e.target.value)} placeholder="e.g. Weight" className="w-1/3" />
                      <Input value={spec.value} onChange={e => handleArrayChange('specs', i, 'value', e.target.value)} placeholder="e.g. 1 kg" className="flex-1" />
                      <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeArrayItem('specs', i)}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3"><h3 className="font-bold">Key Highlights</h3><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('highlights', '')}>Add Highlight</Button></div>
                <div className="space-y-2">
                  {formData.highlights.map((hlt, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={hlt} onChange={e => handleArrayChange('highlights', i, null, e.target.value)} placeholder="e.g. Selected natural ingredients" />
                      <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeArrayItem('highlights', i)}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3"><h3 className="font-bold">FAQs</h3><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('faqs', { question: '', answer: '' })}>Add FAQ</Button></div>
                <div className="space-y-4">
                  {formData.faqs.map((faq, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border border-border rounded-xl bg-gray-50">
                      <div className="flex-1 space-y-3">
                        <Input value={faq.question} onChange={e => handleArrayChange('faqs', i, 'question', e.target.value)} placeholder="Question" />
                        <Textarea value={faq.answer} onChange={e => handleArrayChange('faqs', i, 'answer', e.target.value)} placeholder="Answer" rows={2} />
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem('faqs', i)}><Trash2 size={16}/></Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feeding & Care */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h3 className="font-bold">Care Instructions</h3>
                  <Textarea name="care" value={formData.care} onChange={handleChange} rows={4} placeholder="Storage and care guidelines..." />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold">Feeding Instructions</h3>
                  <Textarea name="feedingInstructions.description" value={formData.feedingInstructions.description} onChange={handleChange} rows={2} placeholder="Feeding guidelines..." />
                  <div className="flex gap-4">
                    <Input name="feedingInstructions.recommendedAge" value={formData.feedingInstructions.recommendedAge} onChange={handleChange} placeholder="Rec. Age (e.g. Adult)" className="flex-1" />
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer border px-3 rounded-md bg-white">
                      <input type="checkbox" name="feedingInstructions.waterRequired" checked={formData.feedingInstructions.waterRequired} onChange={handleChange} className="rounded text-brand-pink" /> Water Reqd
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB: SHIPPING & SEO */}
            <div className={activeTab === 'shipping' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Shipping & Returns */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b border-border pb-4">Shipping & Returns</h2>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2"><label className="text-sm font-semibold">Weight</label><Input type="number" name="shipping.weight" value={formData.shipping.weight} onChange={handleChange} /></div>
                    <div className="w-24 space-y-2"><label className="text-sm font-semibold">Unit</label><Input name="shipping.weightUnit" value={formData.shipping.weightUnit} onChange={handleChange} /></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2"><label className="text-sm font-semibold">Min Days</label><Input type="number" name="shipping.estimatedDeliveryDays.min" value={formData.shipping.estimatedDeliveryDays.min} onChange={handleChange} /></div>
                    <div className="flex-1 space-y-2"><label className="text-sm font-semibold">Max Days</label><Input type="number" name="shipping.estimatedDeliveryDays.max" value={formData.shipping.estimatedDeliveryDays.max} onChange={handleChange} /></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="checkbox" name="shipping.freeShipping" checked={formData.shipping.freeShipping} onChange={handleChange} className="rounded text-brand-pink" /> Free Shipping
                    </label>
                    {!formData.shipping.freeShipping && <div className="flex-1 flex items-center gap-2"><label className="text-sm font-semibold whitespace-nowrap">Shipping Charge ₹</label><Input type="number" name="shipping.shippingCharge" value={formData.shipping.shippingCharge} onChange={handleChange} /></div>}
                  </div>
                  <div className="space-y-4 pt-4 border-t border-border">
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="checkbox" name="returnPolicy.returnable" checked={formData.returnPolicy.returnable} onChange={handleChange} className="rounded text-brand-pink" /> Eligible for Returns
                    </label>
                    {formData.returnPolicy.returnable && (
                      <>
                        <div className="space-y-2"><label className="text-sm font-semibold">Return Window (Days)</label><Input type="number" name="returnPolicy.returnWindowDays" value={formData.returnPolicy.returnWindowDays} onChange={handleChange} /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold">Return Conditions</label><Textarea name="returnPolicy.conditions" value={formData.returnPolicy.conditions} onChange={handleChange} rows={2} /></div>
                      </>
                    )}
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold border-b border-border pb-4">Search Engine Optimization</h2>
                  <div className="space-y-2"><label className="text-sm font-semibold">Meta Title</label><Input name="seo.metaTitle" value={formData.seo.metaTitle} onChange={handleChange} placeholder="Page title for search engines" /></div>
                  <div className="space-y-2"><label className="text-sm font-semibold">Meta Description</label><Textarea name="seo.metaDescription" value={formData.seo.metaDescription} onChange={handleChange} rows={3} placeholder="Brief summary for search engines" /></div>
                  <div className="space-y-2"><label className="text-sm font-semibold">SEO Keywords</label><Input name="seo.keywords" value={formData.seo.keywords} onChange={handleChange} placeholder="Comma separated keywords" /></div>
                  <div className="space-y-2 pt-4 border-t border-border"><label className="text-sm font-semibold">Product Tags (Store Search)</label><Input name="tags" value={formData.tags} onChange={handleChange} placeholder="Comma separated tags (e.g. bird food, premium)" /></div>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
