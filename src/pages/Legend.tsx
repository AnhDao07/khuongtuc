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
          title: ' Thông tin chung về thế giới song song',
          content: 'Tại một lớp học nằm trong ngôi trường THPT CATUCS, tất cả học sinh đang chăm chú làm bài thì bỗng những tiếng cười đùa quen thuộc và âm thanh giảng đường của giáo viên như tan biến vào hư không. Một cơn choáng ập đến khiến họ dần mất ý thức. Khi tỉnh lại, trước mắt họ không còn là lớp học quen thuộc đầy màu sắc tươi sáng nữa, mà là một không gian xám xịt, loang lổ. Vẫn là ngôi trường đó, vẫn là lớp học này, nhưng mọi thứ đã cũ kỹ, phủ đầy rêu xanh thẫm trên những bức tường gạch mục nát. \n Những học sinh này đã bị đưa đến một thế giới song song tách biệt hoàn toàn với thế giới thực. Một giọng nói vang lên, không xa cũng không gần, như thể thì thầm ngay bên tai họ: “Chào mừng các học viên đã đến, chúng ta sẽ phải thực hiện những thử thách hóc búa mà các bạn phải đối mặt. Liệu… các bạn đã sẵn sàng cho chuyến phiêu lưu này hay chưa?” \n Không một lời báo trước, họ chỉ kịp nhận ra mình đã bị cuốn vào một hiện tượng quỷ dị bí ẩn mà bản thân không thể lý giải. Và giờ đây, chính họ phải tự đối mặt để tìm ra nguyên lý của tất cả. Những con chuột bạch như họ bị đặt lên cán cân sinh tử; sai một bước đồng nghĩa với thất bại, mà thất bại tức là cái chết, nên sự cẩn trọng là điều bắt buộc. \nn Họ quyết định chia thành bốn nhóm, đi về bốn hướng Đông - Tây - Nam - Bắc. Mỗi con đường đều chứa đựng những cạm bẫy riêng biệt, đòi hỏi sự đoàn kết để vượt qua và thu thập các vật phẩm. Bốn vật phẩm này chính là chìa khóa để tìm ra nguyên nhân thực sự của tất cả. \n Mục tiêu cuối cùng ở mỗi con đường là bốn viên đá tượng trưng cho bốn vật phẩm, chúng sẽ mở ra lối thoát cho những kẻ sống sót nếu họ có thể đi đến tận cùng. Nhưng thử thách lớn nhất vẫn còn ở phía trước, nơi một con quái vật mạnh mẽ đang ẩn mình chờ đợi, như một bài kiểm tra cuối cùng cho sự sống còn. \n Sau khi thu thập đủ, họ sẽ được đưa trở lại ngôi trường ban đầu. Tại đó, họ phải đối đầu với trùm cuối để giành lấy bốn trụ chứa những viên đá. Ai giành được chúng sẽ là người có cơ hội quay về hiện thực. \n Liệu họ có thể vượt qua tất cả? Liệu có kẻ phản bội nào đẩy đồng đội mình vào chỗ chết? \ n Hãy cùng theo dõi màn kịch kinh điển này. \n \n Chắp bút \n THPT CATUCS',
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
                {legend?.title || 'Truyền Thuyết'}
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
                Đừng tin bất kỳ ai, ngay cả chính mình.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
