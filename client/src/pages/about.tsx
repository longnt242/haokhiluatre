import { Mail, MessageCircle, Twitter } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Giới Thiệu</h2>
          <p className="text-xl text-muted-foreground">Về dự án và team The Weakened Team</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="font-display text-2xl font-semibold mb-6">Về Trò Chơi</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              "Hào Khí Lửa Tre" là một dự án game indie tham vọng, kể về hành trình của một chiến binh 
              trong thế giới võ thuật cổ đại Việt Nam. Được phát triển trên nền tảng Unreal Engine 5, 
              trò chơi mang đến trải nghiệm cinematic với đồ họa tuyệt đẹp và gameplay sâu sắc.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Câu chuyện xoay quanh những giá trị truyền thống về danh dự, lòng dũng cảm và tinh thần 
              bất khuất của dân tộc Việt Nam, được thể hiện qua hành trình của nhân vật chính.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Concept art game Hào Khí Lửa Tre" 
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-lg"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Team The Weakened đang phát triển game" 
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="font-display text-2xl font-semibold mb-6">Team The Weakened Team</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Chúng tôi là một nhóm nhỏ các nhà phát triển game độc lập tại Việt Nam, đam mê tạo ra 
              những trải nghiệm game độc đáo mang đậm dấu ấn văn hóa bản địa. Với kinh nghiệm trong 
              ngành game và sự say mê với công nghệ hiện đại.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Mục tiêu của chúng tôi là đưa những câu chuyện và giá trị Việt Nam đến với cộng đồng 
              game thế giới thông qua những sản phẩm chất lượng cao.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Liên Hệ</h4>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <span>theweakened.team@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MessageCircle className="w-5 h-5" />
                <span>TheWeakened#1234</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Twitter className="w-5 h-5" />
                <span>@TheWeakenedStudio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional sections */}
        <div className="mt-20 pt-20 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <h4 className="font-semibold mb-2">Game Development</h4>
              <p className="text-muted-foreground text-sm">
                Phát triển game với công nghệ Unreal Engine 5 hiện đại
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇻🇳</span>
              </div>
              <h4 className="font-semibold mb-2">Văn Hóa Việt Nam</h4>
              <p className="text-muted-foreground text-sm">
                Tôn vinh và quảng bá văn hóa truyền thống Việt Nam
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold mb-2">Nghệ Thuật</h4>
              <p className="text-muted-foreground text-sm">
                Tạo ra những tác phẩm nghệ thuật digital chất lượng cao
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
