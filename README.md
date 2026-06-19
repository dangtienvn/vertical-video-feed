# Vertical Video Feed Test

Dự án này là bài kiểm tra đầu vào xây dựng giao diện xem video cuộn dọc (Vertical Scroll Feed) tương tự như TikTok, sử dụng **Next.js (App Router)** và **TypeScript**.

## Các tính năng chính

- **Giao diện cuộn dọc:** Responsive (toàn màn hình trên mobile, tỷ lệ 9:16 ở giữa màn hình trên PC). Hiệu ứng cuộn `snap-scroll` mượt mà cho từng video.
- **Auto-play on scroll (Bonus):** Tự động phát video khi cuộn tới và nằm trong tầm nhìn (từ 60% diện tích trở lên), tự động dừng khi bị cuộn qua.
- **Thao tác thủ công:** Click vào màn hình video để Play/Pause.
- **State Mạng Xã Hội (Bonus):** Tương tác với nút Like để thả tim và thay đổi số lượng.
- **Thanh điều hướng (Bonus):** Có Sidebar cho màn hình lớn (PC) và Bottom Navigation cho màn hình di động.

## Giải thích logic Play/Pause khi cuộn trang (Yêu cầu bài test)

Logic tự động Play/Pause khi cuộn trang được xử lý thông qua **Intersection Observer API** kết hợp với **React hooks (`useEffect`, `useRef`)** trong component `VideoCard`:

1. **Khởi tạo Observer:** Một Intersection Observer được thiết lập để theo dõi `cardRef` (container của video).
2. **Threshold:** Sử dụng `threshold: [0, 0.6, 1]`. Tức là callback sẽ được kích hoạt khi phần trăm diện tích của video hiển thị trên viewport đạt 0%, 60% và 100%.
3. **Điều kiện Play:** Nếu `entry.isIntersecting` là true VÀ `entry.intersectionRatio >= 0.6` (video chiếm ít nhất 60% viewport), video sẽ tự động gọi hàm `.play()`.
4. **Điều kiện Pause:** Khi video trượt ra khỏi viewport (tỷ lệ hiển thị giảm xuống dưới 60%), nó sẽ gọi `.pause()`.
5. **Đồng bộ hóa các video (Video Registry):** Component cha `VideoFeed` quản lý một danh sách (`Map`) các video đang tồn tại. Khi một video bắt đầu phát, hàm `handlePlay` sẽ được gọi để pause tất cả các video khác trong danh sách, đảm bảo chỉ có tối đa 1 video chạy tại một thời điểm.
6. **Bảo vệ thao tác người dùng:** Nếu người dùng chủ động click để Pause, cờ `userPausedRef` sẽ được bật lên để ngăn Intersection Observer tự động phát lại (cho đến khi cuộn hẳn sang video khác).

## Hướng dẫn cài đặt & chạy thử

Cài đặt dependencies:

```bash
npm install
```

Chạy development server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn để xem kết quả.
