import { motion } from 'motion/react';
import { ArrowRight, Skull, Users, Eye, Ghost } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1505634467193-78571ec88293?q=80&w=2070&auto=format&fit=crop"
            alt="Scary School Hallway"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-horror-dark via-transparent to-horror-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-horror-dark via-transparent to-horror-dark" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
  <h2 className="text-horror-red font-signature text-4xl mb-4 tracking-[0.2em]">
  Chào mừng đến với
</h2>
            <h1 className="text-7xl md:text-9xl font-madman text-white mb-6 tracking-tighter mix-blend-difference">
  KHƯƠNG TÚC
</h1>
            <p className="text-xl md:text-2xl text-gray-400 font-display italic mb-12">
              Khi ngôi trường trung học trở thành nấm mồ cho những linh hồn lạc lối.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/events" className="group relative px-8 py-4 bg-horror-red text-white font-bold tracking-widest overflow-hidden transition-all hover:pr-12">
                <span className="relative z-10 flex items-center gap-2">
                  KHÁM PHÁ SỰ KIỆN <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </Link>
              
              <button className="px-8 py-4 border border-gray-600 text-gray-300 hover:border-white hover:text-white transition-all font-display italic">
                Tìm hiểu truyền thuyết
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Story */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-display font-bold text-white">Thế Giới Không Lối Thoát</h2>
            <div className="h-1 w-24 bg-horror-red" />
            <p className="text-lg text-gray-400 leading-relaxed">
              Một lớp học bị cuốn vào chiều không gian song song tại chính ngôi trường của mình. Nhưng ngôi trường này không còn là nơi để học tập. Nó là một mê cung đầy rẫy quái vật và những cạm bẫy chết người.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Những học sinh phải chiến đấu để tồn tại, hoàn thành các nhiệm vụ bí ẩn để tìm đường trở về. Nhưng hãy cẩn thận... những người bạn thân nhất của bạn có thể chính là <span className="text-horror-red font-bold">Kẻ Phản Bội</span>.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={<Skull />} title="Sinh Tồn" desc="Đối mặt với nỗi sợ hãi tột cùng." />
            <FeatureCard icon={<Users />} title="Phản Bội" desc="Ai là người bạn đồng hành thực sự?" />
            <FeatureCard icon={<Eye />} title="Bí Ẩn" desc="Giải mã những chương truyện đen tối." />
            <FeatureCard icon={<Ghost />} title="Thực Tại" desc="Phá vỡ thế giới song song." />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:scale-105 group">
      <div className="text-horror-red mb-4 group-hover:animate-pulse">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
