import type { Video } from "@/types/video";

export const videos: Video[] = [
  {
    id: "1",
    videoUrl:
      "https://www.w3schools.com/html/mov_bbb.mp4",
    authorName: "@w3schools",
    description: "Big Buck Bunny - W3Schools demo 🐰",
    likesCount: 12400,
  },
  {
    id: "2",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    authorName: "@mdnwebdocs",
    description: "Friday vibe from MDN Web Docs 🎸",
    likesCount: 89200,
  },
  {
    id: "3",
    videoUrl:
      "https://media.w3.org/2010/05/sintel/trailer.mp4",
    authorName: "@sintel",
    description: "Sintel Trailer - W3C Demo 🎬",
    likesCount: 45600,
  },
  {
    id: "4",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    authorName: "@natureclips",
    description: "Epic drone shots over mountain ranges at golden hour 🌄",
    likesCount: 32100,
  },
  {
    id: "5",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    authorName: "@speeddemons",
    description: "When the playlist hits and you forget the speed limit 🏎️",
    likesCount: 67800,
  },
];
