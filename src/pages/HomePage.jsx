import { useApp } from '../context/AppContext';
import Stories from '../components/Stories';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import FriendSuggestions from '../components/FriendSuggestions';
import IslamicEventCard from '../components/IslamicEventCard';

function BismillahBanner() {
  return (
    <div className="card mb-3 p-4 text-center pattern-bg rounded-xl">
      <p className="arabic text-white text-[22px] font-bold leading-loose">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>
      <p className="text-green-100 text-[12px] mt-1">শুরু করছি আল্লাহর নামে, যিনি পরম দয়ালু, অসীম করুণাময়</p>
    </div>
  );
}

export default function HomePage() {
  const { posts } = useApp();

  return (
    <div className="space-y-3">
      <BismillahBanner />
      <Stories />
      <CreatePost />
      {posts.map(post => <Post key={post.id} post={post} />)}
      <FriendSuggestions />
      <IslamicEventCard />
      <div className="card p-4 text-center text-[13px] text-green-600">
        <p className="arabic text-[16px] mb-1">وَاللَّهُ خَيْرٌ وَأَبْقَى</p>
        <p>আল্লাহই সর্বোত্তম এবং চিরস্থায়ী · UmmahBook © 2025</p>
      </div>
    </div>
  );
}
