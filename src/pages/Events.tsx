import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase, StoryEvent } from '@/lib/supabase';

export default function Events() {
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-horror-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold text-white mb-4"
        >
          HỒ SƠ SỰ KIỆN
        </motion.h1>
        <p className="text-gray-400 font-display italic">Mỗi sự kiện là một chương mới trong cuộc chiến sinh tồn.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.length > 0 ? (
          events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-xl">
            <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-500 font-display italic">Chưa có sự kiện nào được ghi nhận... hoặc tất cả đã bị xóa sổ.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-horror-purple/10 border border-white/5 overflow-hidden hover:border-horror-red/50 transition-all flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image_url || `https://picsum.photos/seed/${event.id}/600/400?grayscale&blur=2`}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold ${
            event.status === 'active' ? 'bg-horror-red text-white' : 'bg-gray-800 text-gray-400'
          }`}>
            {event.status === 'active' ? 'ĐANG DIỄN RA' : 'ĐÃ KẾT THÚC'}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col space-y-4">
        <h3 className="text-2xl font-display font-bold text-white group-hover:text-horror-red transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
          {event.description}
        </p>
        
        <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(event.timestamp).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(event.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gradient-to-r from-transparent via-horror-red/0 to-transparent group-hover:via-horror-red transition-all duration-500" />
    </motion.div>
  );
}
