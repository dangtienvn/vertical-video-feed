import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import VideoFeed from "@/components/VideoFeed";

export default function Home() {
  return (
    <div className="flex h-[100dvh] w-full bg-black">
      <Sidebar />
      <main className="flex flex-1 justify-center overflow-hidden">
        <VideoFeed />
      </main>
      <BottomNav />
    </div>
  );
}
