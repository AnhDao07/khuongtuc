import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, ShieldAlert, Skull, ArrowRight } from 'lucide-react';
import { supabase, StoryCharacter } from '@/lib/supabase';

export default function Characters() {
  const [characters, setCharacters] = useState<StoryCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChar, setSelectedChar] = useState<StoryCharacter | null>(null);

  useEffect(() => {
    async function fetchCharacters() {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching characters:', error);
      } else {
        setCharacters(data || []);
        if (data && data.length > 0) setSelectedChar(data[0]);
      }
      setLoading(false);
    }

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-horror-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter">HỒ SƠ NHÂN VẬT</h1>
        <p className="text-gray-400 font-display italic">Danh sách các học sinh.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Character List Sidebar */}
        <div className="lg:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className={`w-full text-left p-4 transition-all border ${
                selectedChar?.id === char.id 
                  ? 'bg-horror-red/20 border-horror-red text-white' 
                  : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl uppercase tracking-wider">{char.name}</h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">{char.role}</p>
                </div>
                {selectedChar?.id === char.id && <ArrowRight className="w-4 h-4 text-horror-red" />}
              </div>
            </button>
          ))}
          {characters.length === 0 && (
            <p className="text-gray-600 italic font-display">Dữ liệu nhân vật chưa được giải mã...</p>
          )}
        </div>

        {/* Character Detail View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedChar ? (
              <motion.div
                key={selectedChar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/60 border border-white/5 overflow-hidden flex flex-col md:flex-row"
              >
                <div className="p-8 md:p-12 flex-grow">
                  <div className="flex items-center gap-3 mb-2 text-horror-red">
                    <Users className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Hồ sơ sinh viên</span>
                  </div>
                  <h2 className="text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">
                    {selectedChar.name}
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] text-horror-red font-bold uppercase tracking-widest mb-2 px-2 border-l-2 border-horror-red">
                        Thông tin chi tiết
                      </h4>
                      <p className="text-lg text-gray-300 font-display italic leading-relaxed whitespace-pre-line">
                        {selectedChar.bio}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Chức vụ</span>
                        <span className="text-white font-display text-sm uppercase tracking-wider">{selectedChar.role}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Trạng thái</span>
                        <span className="text-horror-red font-display text-sm uppercase tracking-wider animate-pulse">Đang mất tích</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image on the right as requested */}
                <div className="md:w-1/3 h-96 md:h-auto overflow-hidden relative">
                  <img 
                    src={selectedChar.image_url || `https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2070&auto=format&fit=crop`}
                    alt={selectedChar.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/80 md:hidden" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                </div>
              </motion.div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-white/5 bg-black/20 text-gray-600">
                <Skull className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-display italic">Chọn một hồ sơ để xem chi tiết</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
