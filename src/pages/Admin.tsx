import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Save, X, 
  Image as ImageIcon, Calendar, 
  AlertTriangle, CheckCircle 
} from 'lucide-react';
import { supabase, StoryEvent, EventStatus } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<StoryEvent> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setEvents(data || []);
    setLoading(false);
  }

  async function handleSave(e: { preventDefault: () => void }) {
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

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Đã lưu sự kiện thành công!' });
      setEditingEvent(null);
      fetchEvents();
    }
    
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.')) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tight">Hệ thống Quản trị</h1>
          <p className="text-gray-500 font-display italic mt-1 text-sm">Quản lý các chương truyện và thử thách của Khương Túc.</p>
        </div>
        <button 
          onClick={() => setEditingEvent({})}
          className="flex items-center justify-center gap-2 bg-horror-red text-white px-6 py-3 font-bold tracking-widest hover:bg-horror-red/80 transition-all uppercase"
        >
          <Plus className="w-5 h-5" /> Thêm Sự Kiện
        </button>
      </div>

      <AnimatePresence>
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

      <div className="overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
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
                    <button 
                      onClick={() => setEditingEvent(event)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-gray-400 hover:text-horror-red transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Hệ thống chưa ghi nhận sự kiện nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingEvent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-horror-dark border border-horror-red/30 p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                {editingEvent.id ? 'Cập Nhật Sự Kiện' : 'Tạo Sự Kiện Mới'}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Tiêu đề</label>
                    <input 
                      type="text" 
                      required
                      value={editingEvent.title || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Trạng thái</label>
                    <select 
                      value={editingEvent.status || 'active'}
                      onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus })}
                      className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none"
                    >
                      <option value="active" className="bg-horror-dark">Đang kích hoạt</option>
                      <option value="closed" className="bg-horror-dark">Đã đóng</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Mô tả (Tiếng Việt)</label>
                  <textarea 
                    required
                    rows={4}
                    value={editingEvent.description || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> URL Hình ảnh
                    </label>
                    <input 
                      type="url" 
                      value={editingEvent.image_url || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Thời gian
                    </label>
                    <input 
                      type="datetime-local" 
                      required
                      value={editingEvent.timestamp ? new Date(editingEvent.timestamp).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, timestamp: new Date(e.target.value).toISOString() })}
                      className="w-full bg-white/5 border border-white/10 py-2 px-3 text-white focus:border-horror-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest font-bold"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="bg-horror-red text-white px-8 py-2 font-bold tracking-widest uppercase text-sm hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> {editingEvent.id ? 'Cập Nhật' : 'Lưu Hồ Sơ'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
