import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Save, X, 
  Image as ImageIcon, Calendar, 
  AlertTriangle, CheckCircle, Ghost, List, ShieldAlert, Users
} from 'lucide-react';
import { supabase, StoryEvent, EventStatus, StoryLegend, StoryCharacter } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'events' | 'legend' | 'characters' | 'branching'>('events');
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [legend, setLegend] = useState<StoryLegend | null>(null);
  const [characters, setCharacters] = useState<StoryCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<StoryEvent> | null>(null);
  const [editingLegend, setEditingLegend] = useState<StoryLegend | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Partial<StoryCharacter> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchEvents(), fetchLegend(), fetchCharacters()]);
    setLoading(false);
  }

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setEvents(data || []);
  }

  async function fetchLegend() {
    const { data, error } = await supabase
      .from('legend')
      .select('*')
      .single();
    if (error) {
      console.warn('Could not fetch legend, might be first time setup.');
    } else {
      setLegend(data);
    }
  }

  async function fetchCharacters() {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error(error);
    else setCharacters(data || []);
  }

  async function handleSaveEvent(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!editingEvent?.title) return;

    const eventData = {
      ...editingEvent,
      timestamp: editingEvent.timestamp || new Date().toISOString(),
      status: editingEvent.status || 'active',
    };

    let error;
    if (editingEvent.id) {
      const { error: err } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editingEvent.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('events')
        .insert([eventData]);
      error = err;
    }

    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Đã lưu sự kiện thành công!' });
      setEditingEvent(null);
      fetchEvents();
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSaveCharacter(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!editingCharacter?.name) return;

    const charData = {
      ...editingCharacter,
      role: editingCharacter.role || 'Học sinh',
    };

    let error;
    if (editingCharacter.id) {
      const { error: err } = await supabase
        .from('characters')
        .update(charData)
        .eq('id', editingCharacter.id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('characters')
        .insert([charData]);
      error = err;
    }

    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Đã lưu thông tin nhân vật!' });
      setEditingCharacter(null);
      fetchCharacters();
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSaveLegend(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!editingLegend?.title) return;

    const legendData = {
      ...editingLegend,
      updated_at: new Date().toISOString()
    };

    let error;
    if (editingLegend.id) {
      const { error: err } = await supabase
        .from('legend')
        .update(legendData)
        .eq('id', editingLegend.id);
      error = err;
    } else {
      // If we are creating the first legend record
      const { error: err } = await supabase
        .from('legend')
        .insert([{ ...legendData, id: '1' }]); // Standardize with ID 1
      error = err;
    }

    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Đã cập nhật truyền thuyết!' });
      setEditingLegend(null);
      fetchLegend();
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDeleteCharacter(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân vật này?')) return;
    const { error } = await supabase.from('characters').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Đã xóa nhân vật!' });
      fetchCharacters();
    }
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Đã xóa sự kiện!' });
      fetchEvents();
    }
    setTimeout(() => setMessage(null), 3000);
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-horror-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 font-display">
        <div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Hệ thống Quản trị</h1>
          <p className="text-gray-500 italic mt-1 text-sm">Kiểm soát thế giới song song Khương Túc.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 border border-white/10">
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'events' ? 'bg-horror-red text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <List className="w-4 h-4" /> Sự Kiện
          </button>
          <button 
            onClick={() => setActiveTab('legend')}
            className={`px-6 py-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'legend' ? 'bg-horror-red text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Ghost className="w-4 h-4" /> Thông Tin
          </button>
          <button 
            onClick={() => setActiveTab('characters')}
            className={`px-6 py-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'characters' ? 'bg-horror-red text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Users className="w-4 h-4" /> Nhân Vật
          </button>
          <button 
            onClick={() => setActiveTab('branching')}
            className={`px-6 py-2 text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${activeTab === 'branching' ? 'bg-horror-red text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <ShieldAlert className="w-4 h-4" /> Nhánh Truyện
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 mb-8 flex items-center gap-3 border ${
              message.type === 'success' ? 'bg-green-900/20 border-green-500/50 text-green-400' : 'bg-red-900/20 border-red-500/50 text-red-400'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {activeTab === 'events' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button 
                onClick={() => setEditingEvent({})}
                className="flex items-center gap-2 bg-horror-red text-white px-6 py-3 font-bold tracking-widest hover:bg-horror-red/80 transition-all uppercase text-sm"
              >
                <Plus className="w-5 h-5" /> Thêm Sự Kiện
              </button>
            </div>
            
            <div className="overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-widest font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Tên Sự Kiện</th>
                    <th className="px-6 py-4">Trạng Thái</th>
                    <th className="px-6 py-4">Thời Gian</th>
                    <th className="px-6 py-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-white font-display font-medium text-lg">{event.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{event.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold ${
                          event.status === 'active' ? 'bg-horror-red/20 text-horror-red border border-horror-red/30' : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {event.status === 'active' ? 'Đang kích hoạt' : 'Đã đóng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                        {new Date(event.timestamp).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingEvent(event)} className="p-2 text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-gray-400 hover:text-horror-red"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Hệ thống chưa ghi nhận sự kiện nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'characters' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button 
                onClick={() => setEditingCharacter({})}
                className="flex items-center gap-2 bg-horror-red text-white px-6 py-3 font-bold tracking-widest hover:bg-horror-red/80 transition-all uppercase text-sm"
              >
                <Plus className="w-5 h-5" /> Thêm Nhân Vật
              </button>
            </div>
            
            <div className="overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-widest font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Nhân Vật</th>
                    <th className="px-6 py-4">Vai Trò</th>
                    <th className="px-6 py-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {characters.map((char) => (
                    <tr key={char.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={char.image_url || 'https://via.placeholder.com/40'} className="w-10 h-10 object-cover grayscale" />
                          <div>
                            <div className="text-white font-display font-medium text-lg">{char.name}</div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{char.bio}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">{char.role}</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setEditingCharacter(char)} className="p-2 text-gray-400 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCharacter(char.id)} className="p-2 text-gray-400 hover:text-horror-red"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {characters.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">Chưa có hồ sơ nhân vật nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : activeTab === 'legend' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-black/50 border border-white/10 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Thông tin Truyền Thuyết</h2>
                <button 
                  onClick={() => setEditingLegend(legend || { id: '', title: '', content: '', image_url: '', updated_at: '' })}
                  className="flex items-center gap-2 bg-horror-red text-white px-6 py-2 font-bold tracking-widest hover:bg-horror-red/80 transition-all uppercase text-sm"
                >
                  <Edit2 className="w-4 h-4" /> Cập nhật nội dung
                </button>
              </div>

              {legend ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-8 text-white">
                    {legend.image_url && (
                      <div className="col-span-1 rounded-lg overflow-hidden border border-white/5 h-48">
                        <img src={legend.image_url} alt="Legend" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className={legend.image_url ? 'col-span-2' : 'col-span-3'}>
                      <h3 className="text-xl font-bold text-horror-red mb-2">{legend.title}</h3>
                      <p className="text-gray-400 italic line-clamp-6 font-display whitespace-pre-line">{legend.content}</p>
                      <p className="text-[10px] text-gray-600 uppercase mt-4 tracking-widest">Cập nhật lần cuối: {new Date(legend.updated_at).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                  <Ghost className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 italic font-display">Chưa có thông tin truyền thuyết. Hãy tạo bản ghi đầu tiên.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-black/50 border border-white/10 p-12 text-center">
              <ShieldAlert className="w-16 h-16 text-horror-red/40 mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-widest">Story Branching Logic</h2>
              <p className="text-gray-500 italic max-w-xl mx-auto font-display">
                Tính năng này cho phép quản trị viên tạo ra các lựa chọn dẫn đến nhiều kết thúc khác nhau cho mỗi chương truyện. Hệ thống đang trong quá trình phát triển cốt lõi.
              </p>
              <div className="mt-8">
                <span className="px-4 py-1 border border-horror-red/30 text-horror-red text-xs uppercase tracking-[0.3em]">Module Placeholder Enabled</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Editor Modal for Event */}
      <AnimatePresence>
        {editingEvent && (activeTab === 'events' || editingEvent.id) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingEvent(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-horror-dark border border-horror-red/30 p-8 shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-tight">{editingEvent.id ? 'Cập Nhật Sự Kiện' : 'Tạo Sự Kiện Mới'}</h2>
              <form onSubmit={handleSaveEvent} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 font-display">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tiêu đề</label>
                    <input type="text" required value={editingEvent.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Trạng thái</label>
                    <select value={editingEvent.status || 'active'} onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none">
                      <option value="active" className="bg-horror-dark">Đang kích hoạt</option>
                      <option value="closed" className="bg-horror-dark">Đã đóng</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 font-display">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Mô tả (Tiếng Việt)</label>
                  <textarea required rows={4} value={editingEvent.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-6 font-display">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3" /> URL Hình ảnh</label>
                    <input type="url" value={editingEvent.image_url || ''} onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> Thời gian</label>
                    <input type="datetime-local" required value={editingEvent.timestamp ? new Date(editingEvent.timestamp).toISOString().slice(0, 16) : ''} onChange={(e) => setEditingEvent({ ...editingEvent, timestamp: new Date(e.target.value).toISOString() })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setEditingEvent(null)} className="px-6 py-2 text-gray-400 hover:text-white uppercase text-sm tracking-widest font-bold">Hủy</button>
                  <button type="submit" className="bg-horror-red text-white px-8 py-2 font-bold tracking-widest uppercase text-sm hover:scale-105 transition-all flex items-center gap-2"><Save className="w-4 h-4" /> Lưu Hồ Sơ</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editor Modal for Legend */}
      <AnimatePresence>
        {editingLegend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingLegend(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-horror-dark border border-horror-red/30 p-8 shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-tight">Cập Nhật Truyền Thuyết</h2>
              <form onSubmit={handleSaveLegend} className="space-y-6">
                <div className="space-y-2 font-display">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tiêu đề bản ghi</label>
                  <input type="text" required value={editingLegend.title || ''} onChange={(e) => setEditingLegend({ ...editingLegend, title: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                </div>
                <div className="space-y-2 font-display">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Nội dung truyền thuyết</label>
                  <textarea required rows={8} value={editingLegend.content || ''} onChange={(e) => setEditingLegend({ ...editingLegend, content: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                </div>
                <div className="space-y-2 font-display">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3" /> URL Hình ảnh minh họa</label>
                  <input type="url" value={editingLegend.image_url || ''} onChange={(e) => setEditingLegend({ ...editingLegend, image_url: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setEditingLegend(null)} className="px-6 py-2 text-gray-400 hover:text-white uppercase text-sm tracking-widest font-bold">Hủy</button>
                  <button type="submit" className="bg-horror-red text-white px-8 py-2 font-bold tracking-widest uppercase text-sm hover:scale-105 transition-all flex items-center gap-2"><Save className="w-4 h-4" /> Cập Nhật Bản Ghi</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editor Modal for Character */}
      <AnimatePresence>
        {editingCharacter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingCharacter(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-horror-dark border border-horror-red/30 p-8 shadow-2xl text-white">
              <h2 className="text-2xl font-display font-bold mb-6 uppercase tracking-tight">{editingCharacter.id ? 'Cập Nhật Nhân Vật' : 'Tạo Nhân Vật Mới'}</h2>
              <form onSubmit={handleSaveCharacter} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 font-display">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tên nhân vật</label>
                    <input type="text" required value={editingCharacter.name || ''} onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                  </div>
                  <div className="space-y-2 font-display">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Vai trò / Chức vụ</label>
                    <input type="text" required value={editingCharacter.role || ''} onChange={(e) => setEditingCharacter({ ...editingCharacter, role: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2 font-display">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tiểu sử / Thông tin (Tiếng Việt)</label>
                  <textarea required rows={5} value={editingCharacter.bio || ''} onChange={(e) => setEditingCharacter({ ...editingCharacter, bio: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                </div>
                <div className="space-y-2 font-display">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1"><ImageIcon className="w-3 h-3" /> URL Hình ảnh (Trực diện)</label>
                  <input type="url" value={editingCharacter.image_url || ''} onChange={(e) => setEditingCharacter({ ...editingCharacter, image_url: e.target.value })} className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none" />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setEditingCharacter(null)} className="px-6 py-2 text-gray-400 hover:text-white uppercase text-sm tracking-widest font-bold">Hủy</button>
                  <button type="submit" className="bg-horror-red text-white px-8 py-2 font-bold tracking-widest uppercase text-sm hover:scale-105 transition-all flex items-center gap-2"><Save className="w-4 h-4" /> Lưu Hồ Sơ</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
