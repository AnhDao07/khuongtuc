import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Ghost, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, StoryLegend } from '@/lib/supabase';

export default function Legend() {
  const [legend, setLegend] = useState<StoryLegend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLegend() {
      const { data, error } = await supabase
        .from('legend')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching legend:', error);
        // Fallback or default content if table doesn't exist yet
        setLegend({
          id: '1',
          title: 'Truyền Thuyết Khương Túc',
          content: 'Đang tải dữ liệu từ thế giới song song...',
          updated_at: new Date().toISOString()
        });
      } else {
        setLegend(data);
      }
      setLoading(false);
    }

    fetchLegend();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-horror-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-horror-red transition-colors font-display italic">
            <ArrowLeft className="w-4 h-4" /> Trở về thực tại
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-horror-red/20 backdrop-blur-md overflow-hidden relative"
        >
          {legend?.image_url && (
            <div className="h-64 sm:h-96 overflow-hidden">
              <img 
                src={legend.image_url} 
                alt="Legend image" 
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-horror-dark to-transparent" />
            </div>
          )}

          <div className="p-8 sm:p-12 relative">
            <div className="flex items-center gap-3 mb-6">
              <Ghost className="w-8 h-8 text-horror-red" />
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-white uppercase tracking-tighter">
                {legend?.title || 'Truyền Thuyết Khương Túc'}
              </h1>
            </div>

            <div className="h-0.5 w-full bg-horror-red/30 mb-8" />

            <div className="prose prose-invert prose-red max-w-none">
              {legend?.content ? (
                legend.content.split('\n').map((para, i) => (
                  <p key={i} className="text-lg text-gray-300 leading-relaxed mb-6 font-display italic">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">Bản ghi này đã bị xóa hoặc chưa tồn tại.</p>
              )}
            </div>

            <div className="mt-12 p-6 border-l-4 border-horror-red bg-horror-red/5">
              <div className="flex items-center gap-2 text-horror-red mb-2">
                <ShieldAlert className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-sm text-white">Cảnh báo</span>
              </div>
              <p className="text-sm text-gray-400 italic">
                Bất cứ ai đọc được những dòng này đều đã bị đánh dấu. Đừng tin bất kỳ ai, ngay cả chính mình.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
