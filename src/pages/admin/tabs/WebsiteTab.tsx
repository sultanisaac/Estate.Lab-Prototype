import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MessageSquareQuote, Save, Plus, Trash2, Edit3, 
  Star, Check, Sparkles, AlertCircle, RefreshCw, Upload
} from 'lucide-react';
import { 
  getWebsiteContent, saveWebsiteContent, 
  type WebsiteContent, type Testimonial, type Milestone 
} from '../../../data/websiteContent';
import { ImageCropperModal } from '../../../components/admin/ImageCropperModal';

export function WebsiteTab() {
  const [activeTab, setActiveTab] = useState<'about' | 'testimonials'>('about');
  const [content, setContent] = useState<WebsiteContent>(getWebsiteContent());
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // 9:16 Portrait Cropper state
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
  }>({
    isOpen: false,
    imageSrc: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Testimonials state
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | number | null }>({
    isOpen: false,
    id: null
  });
  const [isDeletePortraitModalOpen, setIsDeletePortraitModalOpen] = useState(false);

  // New Milestone inline state
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone>({ year: '', title: '', desc: '' });
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);

  useEffect(() => {
    setContent(getWebsiteContent());
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 3500);
  };

  // Save full About Me content
  const handleSaveAboutMe = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      saveWebsiteContent(content);
      setIsSaving(false);
      triggerToast('About Me content successfully saved and published!');
    }, 400);
  };

  // 9:16 Portrait Upload & Crop Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCropperModal({
        isOpen: true,
        imageSrc: result,
      });
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = (_blob: Blob, _previewUrl: string) => {
    setCropperModal({ isOpen: false, imageSrc: null });

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const updated = {
        ...content,
        aboutMe: {
          ...content.aboutMe,
          portraitUrl: base64data
        }
      };
      setContent(updated);
      saveWebsiteContent(updated);
      triggerToast('9:16 Portrait photo cropped and updated!');
    };
    reader.readAsDataURL(_blob);
  };

  const handleDeletePortrait = () => {
    if (!content.aboutMe.portraitUrl) return;
    setIsDeletePortraitModalOpen(true);
  };

  const handleConfirmDeletePortrait = () => {
    const updated = {
      ...content,
      aboutMe: {
        ...content.aboutMe,
        portraitUrl: ''
      }
    };
    setContent(updated);
    saveWebsiteContent(updated);
    setIsDeletePortraitModalOpen(false);
    triggerToast('Portrait image removed.');
  };

  // Testimonial Form Handlers
  const handleOpenAddTestimonial = () => {
    setEditingTestimonial({
      id: Date.now(),
      name: '',
      role: '',
      rating: 5,
      text: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial({ ...t });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonialModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name.trim() || !editingTestimonial.text.trim()) {
      alert('Please provide client name and testimonial text.');
      return;
    }

    const exists = content.testimonials.some(t => t.id === editingTestimonial.id);
    let updatedList: Testimonial[];

    if (exists) {
      updatedList = content.testimonials.map(t => 
        t.id === editingTestimonial.id ? editingTestimonial : t
      );
    } else {
      updatedList = [editingTestimonial, ...content.testimonials];
    }

    const updatedContent = {
      ...content,
      testimonials: updatedList
    };

    setContent(updatedContent);
    saveWebsiteContent(updatedContent);
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
    triggerToast('Testimonials updated and synchronized live!');
  };

  const handleDeleteTestimonial = () => {
    if (deleteConfirmation.id === null) return;
    const updatedList = content.testimonials.filter(t => t.id !== deleteConfirmation.id);
    const updatedContent = {
      ...content,
      testimonials: updatedList
    };
    setContent(updatedContent);
    saveWebsiteContent(updatedContent);
    setDeleteConfirmation({ isOpen: false, id: null });
    triggerToast('Testimonial removed successfully.');
  };

  // Milestone Handlers
  const handleAddMilestone = () => {
    if (!newMilestone.year.trim() || !newMilestone.title.trim()) {
      alert('Please fill in year and milestone title.');
      return;
    }
    const updatedMilestones = [...content.aboutMe.milestones, newMilestone];
    const updated = {
      ...content,
      aboutMe: { ...content.aboutMe, milestones: updatedMilestones }
    };
    setContent(updated);
    saveWebsiteContent(updated);
    setNewMilestone({ year: '', title: '', desc: '' });
    setIsAddingMilestone(false);
    triggerToast('Milestone added to timeline.');
  };

  const handleUpdateMilestone = (index: number, updatedItem: Milestone) => {
    const updatedMilestones = [...content.aboutMe.milestones];
    updatedMilestones[index] = updatedItem;
    const updated = {
      ...content,
      aboutMe: { ...content.aboutMe, milestones: updatedMilestones }
    };
    setContent(updated);
    saveWebsiteContent(updated);
    setEditingMilestoneIndex(null);
    triggerToast('Milestone updated.');
  };

  const handleDeleteMilestone = (index: number) => {
    const updatedMilestones = content.aboutMe.milestones.filter((_, i) => i !== index);
    const updated = {
      ...content,
      aboutMe: { ...content.aboutMe, milestones: updatedMilestones }
    };
    setContent(updated);
    saveWebsiteContent(updated);
    triggerToast('Milestone deleted.');
  };

  // Standard update handler
  const handleUpdateStandard = (index: number, field: 'title' | 'desc', val: string) => {
    const updatedStandards = [...content.aboutMe.standards];
    updatedStandards[index] = { ...updatedStandards[index], [field]: val };
    setContent({
      ...content,
      aboutMe: { ...content.aboutMe, standards: updatedStandards }
    });
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-brand-accent/70 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-secondary mb-1">
            <Sparkles size={14} className="text-brand-secondary" />
            <span>Frontend Content Manager</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary">
            Website Content & Editorial
          </h1>
          <p className="text-sm text-brand-text/70 mt-1">
            Manage live editorial copy for the About Me advisory page and the Home page Testimonials carousel.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center p-1.5 bg-brand-background rounded-xl border border-brand-accent self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'about'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-primary/70 hover:text-brand-primary hover:bg-white/60'
            }`}
          >
            <User size={16} />
            <span>About Me Page</span>
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-brand-primary/70 hover:text-brand-primary hover:bg-white/60'
            }`}
          >
            <MessageSquareQuote size={16} />
            <span>Testimonials ({content.testimonials.length})</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-brand-primary text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-brand-secondary animate-bounce">
          <Check className="w-5 h-5 text-brand-secondary" />
          <span className="text-sm font-medium">{saveToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: ABOUT ME EDITOR */}
      {/* ======================================================== */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAboutMe} className="space-y-8">
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-brand-background p-4 rounded-xl border border-brand-accent">
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
              Editing: /about-me & Home Advisor Spotlight
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-brand-primary hover:bg-[#135d70] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all border border-brand-primary"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-brand-secondary" />}
              <span>Save About Me Changes</span>
            </button>
          </div>

          {/* Core Profile Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-accent/70 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-brand-primary border-b border-brand-accent/60 pb-3">
              Principal Profile & Hero Narrative
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 9:16 Photo Upload & Preview */}
              <div className="lg:col-span-4 space-y-4">
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileSelect}
                />

                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider">
                    Advisor Portrait
                  </label>
                  <span className="text-[11px] font-semibold text-brand-secondary bg-brand-secondary/15 px-2.5 py-0.5 rounded-full border border-brand-secondary/30">
                    9:16 Strict Ratio
                  </span>
                </div>

                {content.aboutMe.portraitUrl ? (
                  <div className="space-y-3">
                    {/* 9:16 Aspect Ratio Frame */}
                    <div className="w-full max-w-[260px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden border-2 border-brand-secondary shadow-lg bg-brand-background relative group">
                      <img 
                        src={content.aboutMe.portraitUrl} 
                        alt={content.aboutMe.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      {/* Gradient & Overlay Info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-secondary block">
                          9:16 Aspect Ratio
                        </span>
                        <p className="text-xs font-serif font-bold truncate">{content.aboutMe.name || 'Advisor Portrait'}</p>
                      </div>
                    </div>

                    {/* Upload / Replace & Delete Buttons directly on/under image */}
                    <div className="flex gap-2 max-w-[260px] mx-auto">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 px-3 py-2.5 bg-brand-primary hover:bg-[#135d70] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all border border-brand-primary"
                      >
                        <Upload size={14} className="text-brand-secondary" />
                        <span>Upload / Replace</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDeletePortrait}
                        className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-red-200 transition-colors"
                        title="Delete Portrait Image"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty state dropzone when no image exists */
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-[260px] mx-auto aspect-[9/16] rounded-2xl border-2 border-dashed border-brand-secondary/60 bg-brand-background/60 hover:bg-brand-background hover:border-brand-secondary cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all group shadow-sm"
                  >
                    <div className="w-14 h-14 rounded-full bg-brand-secondary/20 text-brand-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-brand-secondary/30">
                      <Upload size={24} className="text-brand-secondary" />
                    </div>
                    <p className="text-xs font-serif font-bold text-brand-primary mb-1">
                      Upload 9:16 Portrait
                    </p>
                    <p className="text-[11px] text-brand-text/60 leading-relaxed mb-4">
                      Click to choose an image from your device. Opens the 9:16 zoom & crop modal.
                    </p>
                    <span className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-brand-primary">
                      <Upload size={13} className="text-brand-secondary" />
                      <span>Choose File</span>
                    </span>
                  </div>
                )}

                <p className="text-[11px] text-center text-brand-text/60 max-w-[260px] mx-auto leading-relaxed">
                  Only 9:16 ratio images are supported. File selection automatically launches the zoom & crop framing tool.
                </p>
              </div>

              {/* Bio & Headlines */}
              <div className="lg:col-span-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                      Advisor Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={content.aboutMe.name}
                      onChange={(e) => setContent({
                        ...content,
                        aboutMe: { ...content.aboutMe, name: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                      Role Badge Tag
                    </label>
                    <input
                      type="text"
                      value={content.aboutMe.roleTag}
                      onChange={(e) => setContent({
                        ...content,
                        aboutMe: { ...content.aboutMe, roleTag: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                      placeholder="e.g. Principal Advisor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                    Professional Sub-Title & Credentials
                  </label>
                  <input
                    type="text"
                    value={content.aboutMe.title}
                    onChange={(e) => setContent({
                      ...content,
                      aboutMe: { ...content.aboutMe, title: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                    Philosophy Headline Quote
                  </label>
                  <input
                    type="text"
                    value={content.aboutMe.headlineQuote}
                    onChange={(e) => setContent({
                      ...content,
                      aboutMe: { ...content.aboutMe, headlineQuote: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all font-serif text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                    Bio Paragraph 1 (Introduction)
                  </label>
                  <textarea
                    rows={3}
                    value={content.aboutMe.bio1}
                    onChange={(e) => setContent({
                      ...content,
                      aboutMe: { ...content.aboutMe, bio1: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                    Bio Paragraph 2 (Fiduciary Philosophy)
                  </label>
                  <textarea
                    rows={3}
                    value={content.aboutMe.bio2}
                    onChange={(e) => setContent({
                      ...content,
                      aboutMe: { ...content.aboutMe, bio2: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                      Floating Badge Status
                    </label>
                    <input
                      type="text"
                      value={content.aboutMe.statusBadge.status}
                      onChange={(e) => setContent({
                        ...content,
                        aboutMe: {
                          ...content.aboutMe,
                          statusBadge: { ...content.aboutMe.statusBadge, status: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                      Status Subtext
                    </label>
                    <input
                      type="text"
                      value={content.aboutMe.statusBadge.subtext}
                      onChange={(e) => setContent({
                        ...content,
                        aboutMe: {
                          ...content.aboutMe,
                          statusBadge: { ...content.aboutMe.statusBadge, subtext: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advisory Standards (4 Cards) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-accent/70 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-brand-primary border-b border-brand-accent/60 pb-3">
              The 4 Advisory Standards (Metric Cards)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.aboutMe.standards.map((std, idx) => (
                <div key={std.id || idx} className="p-5 rounded-xl border border-brand-accent bg-brand-background space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                      Standard #{idx + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={std.title}
                    onChange={(e) => handleUpdateStandard(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-accent/80 text-sm font-serif font-bold text-brand-primary bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                  />
                  <textarea
                    rows={2}
                    value={std.desc}
                    onChange={(e) => handleUpdateStandard(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-accent/80 text-xs text-brand-text/80 bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Career Timeline Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-accent/70 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-brand-accent/60 pb-3">
              <h2 className="text-xl font-serif font-bold text-brand-primary">
                Career Milestones Timeline
              </h2>
              <button
                type="button"
                onClick={() => setIsAddingMilestone(true)}
                className="px-4 py-2 bg-brand-secondary/20 hover:bg-brand-secondary/30 text-brand-primary font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-brand-secondary/30"
              >
                <Plus size={14} />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Inline Add Milestone Form */}
            {isAddingMilestone && (
              <div className="p-5 rounded-xl border border-brand-secondary/50 bg-brand-background space-y-4 shadow-sm">
                <h4 className="text-sm font-serif font-bold text-brand-primary">New Career Milestone</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={newMilestone.year}
                      onChange={(e) => setNewMilestone({ ...newMilestone, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-brand-accent/80 text-sm text-brand-text bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-brand-primary mb-1">Milestone Title</label>
                    <input
                      type="text"
                      placeholder="e.g. International Advisory Expansion"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-brand-accent/80 text-sm text-brand-text bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-primary mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Details about this achievement or milestone..."
                    value={newMilestone.desc}
                    onChange={(e) => setNewMilestone({ ...newMilestone, desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-brand-accent/80 text-xs text-brand-text bg-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingMilestone(false)}
                    className="px-4 py-2 text-xs font-medium text-brand-text/70 hover:text-brand-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-4 py-2 bg-brand-primary hover:bg-[#135d70] text-white text-xs font-semibold rounded-lg shadow-sm border border-brand-primary"
                  >
                    Save Milestone
                  </button>
                </div>
              </div>
            )}

            {/* Milestones List */}
            <div className="space-y-4">
              {content.aboutMe.milestones.map((m, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-brand-accent/70 bg-brand-background/60 hover:border-brand-secondary/40 transition-colors flex items-start justify-between gap-4"
                >
                  {editingMilestoneIndex === index ? (
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <input
                          type="text"
                          value={m.year}
                          onChange={(e) => {
                            const updated = { ...m, year: e.target.value };
                            const list = [...content.aboutMe.milestones];
                            list[index] = updated;
                            setContent({ ...content, aboutMe: { ...content.aboutMe, milestones: list } });
                          }}
                          className="px-3 py-1.5 text-sm font-bold rounded-lg border border-brand-accent/80 bg-white text-brand-primary"
                        />
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => {
                            const updated = { ...m, title: e.target.value };
                            const list = [...content.aboutMe.milestones];
                            list[index] = updated;
                            setContent({ ...content, aboutMe: { ...content.aboutMe, milestones: list } });
                          }}
                          className="sm:col-span-3 px-3 py-1.5 text-sm font-serif font-bold rounded-lg border border-brand-accent/80 bg-white text-brand-primary"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={m.desc}
                        onChange={(e) => {
                          const updated = { ...m, desc: e.target.value };
                          const list = [...content.aboutMe.milestones];
                          list[index] = updated;
                          setContent({ ...content, aboutMe: { ...content.aboutMe, milestones: list } });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-accent/80 bg-white text-brand-text"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateMilestone(index, m)}
                        className="px-4 py-1.5 bg-brand-primary hover:bg-[#135d70] text-white text-xs font-semibold rounded-lg"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-secondary/20 text-brand-primary border border-brand-secondary/30">
                          {m.year}
                        </span>
                        <h4 className="font-serif font-bold text-base text-brand-primary">{m.title}</h4>
                      </div>
                      <p className="text-xs text-brand-text/75 mt-1 leading-relaxed">{m.desc}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingMilestoneIndex(editingMilestoneIndex === index ? null : index)}
                      className="p-2 text-brand-text/50 hover:text-brand-primary hover:bg-white rounded-lg transition-colors"
                      title="Edit Milestone"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      title="Delete Milestone"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: TESTIMONIALS CRUD */}
      {/* ======================================================== */}
      {activeTab === 'testimonials' && (
        <div className="space-y-8">
          {/* Action Bar & Metrics */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-brand-accent/70 shadow-sm">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-brand-primary/70 uppercase tracking-wider font-semibold">Total Testimonials</p>
                <p className="text-2xl font-serif font-bold text-brand-primary">{content.testimonials.length}</p>
              </div>
              <div className="border-l border-brand-accent/60 pl-6">
                <p className="text-xs text-brand-primary/70 uppercase tracking-wider font-semibold">Average Rating</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-5 h-5 fill-brand-secondary text-brand-secondary" />
                  <span className="text-2xl font-serif font-bold text-brand-primary">5.0</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenAddTestimonial}
              className="px-6 py-3 bg-brand-primary hover:bg-[#135d70] text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md transition-all border border-brand-primary"
            >
              <Plus size={18} className="text-brand-secondary" />
              <span>Add New Testimonial</span>
            </button>
          </div>

          {/* Testimonials Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.testimonials.map((t) => (
              <div 
                key={t.id}
                className="bg-white p-6 rounded-2xl border border-brand-accent/70 hover:border-brand-secondary/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-secondary text-brand-secondary" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditTestimonial(t)}
                        className="p-1.5 text-brand-text/40 hover:text-brand-primary rounded-lg transition-colors"
                        title="Edit Review"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation({ isOpen: true, id: t.id })}
                        className="p-1.5 text-brand-text/40 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-serif italic text-brand-text/90 leading-relaxed mb-6 line-clamp-4">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-brand-accent/50 mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-brand-secondary"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm text-brand-primary truncate">{t.name}</h4>
                    <p className="text-xs text-brand-text/60 truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT TESTIMONIAL */}
      {/* ======================================================== */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-brand-accent">
            <h3 className="font-serif text-2xl font-bold text-brand-primary mb-6">
              {content.testimonials.some(t => t.id === editingTestimonial.id) ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>

            <form onSubmit={handleSaveTestimonialModal} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  placeholder="e.g. Andi & Sarah"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                  Client Role / Location *
                </label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                  placeholder="e.g. Type 60 Owners, Jakarta"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingTestimonial.rating}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                    Client Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editingTestimonial.avatar}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-xs text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                  Testimonial Quote / Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.text}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                  placeholder="Share their experience finding or buying an architectural residence..."
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-accent/80 bg-brand-background/40 text-sm text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all leading-relaxed"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-brand-primary text-white space-y-2 border border-brand-secondary/40 shadow-inner">
                <span className="text-[10px] uppercase font-bold text-brand-secondary tracking-widest block">
                  Live Home Carousel Preview
                </span>
                <p className="text-xs text-white/90 font-serif italic">
                  "{editingTestimonial.text || 'Your review text will appear here...'}"
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <img
                    src={editingTestimonial.avatar}
                    alt={editingTestimonial.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-secondary"
                  />
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{editingTestimonial.name || 'Client Name'}</p>
                    <p className="text-[10px] text-brand-secondary mt-0.5">{editingTestimonial.role || 'Property Role'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-brand-accent text-sm font-medium text-brand-primary hover:bg-brand-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-[#135d70] text-white text-sm font-semibold shadow-md border border-brand-primary"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-brand-accent">
            <div className="w-12 h-12 bg-red-50 text-red-600 border border-red-200 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h4 className="font-serif text-xl font-bold text-brand-primary">Delete Testimonial?</h4>
            <p className="text-xs text-brand-text/70 leading-relaxed">
              Are you sure you want to remove this client review? It will immediately disappear from the Home page carousel.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation({ isOpen: false, id: null })}
                className="px-4 py-2 rounded-xl border border-brand-accent text-xs font-semibold text-brand-primary hover:bg-brand-background transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTestimonial}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PORTRAIT DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {isDeletePortraitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-brand-accent">
            <div className="w-12 h-12 bg-red-50 text-red-600 border border-red-200 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <h4 className="font-serif text-xl font-bold text-brand-primary">Remove Portrait?</h4>
            <p className="text-xs text-brand-text/70 leading-relaxed">
              Are you sure you want to remove the advisor portrait image? You can upload and crop a new 9:16 portrait photo at any time.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeletePortraitModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-brand-accent text-xs font-semibold text-brand-primary hover:bg-brand-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePortrait}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9:16 PORTRAIT IMAGE CROPPER & ZOOM MODAL */}
      {/* ======================================================== */}
      <ImageCropperModal
        isOpen={cropperModal.isOpen}
        imageSrc={cropperModal.imageSrc}
        imageLabel="Advisor Portrait (9:16)"
        aspectRatio="9:16"
        onClose={() => setCropperModal({ isOpen: false, imageSrc: null })}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
