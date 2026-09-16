// Website Configuration
// You can edit any details below to customize the website!
export const config = {
  recipientName: "Thraveen",
  senderName: "Kamali",
  birthdayDate: "22 August",
  passcode: "2208", // Can be '2208', '22', or any 4-digit PIN
  passcodeHint: "Hint: Birthday Date (DDMM) - 22 August ❤️",

  // Music configuration
  music: {
    title: "Romantic Birthday Melody",
    // You can replace this with any audio file path or online MP3 URL:
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-love-112199.mp3",
    autoplayOnUnlock: true
  },

  // Screen 2 greeting
  greeting: {
    subtitle: "Today is all about you and all the happiness you bring into my life every single day.",
    buttonText: "Unfold Love 💖"
  },

  // Screen 3 polaroid memories
  memories: [
    {
      id: 1,
      image: "assets/extracted/polaroid_card_1.png",
      fullPhoto: "assets/extracted/photo1.png",
      caption: "Our Smile",
      rotation: -3,
      date: "The Day We Began",
      note: "Every time you look at me with that radiant smile, my entire world lights up. You make every ordinary moment feel completely extraordinary."
    },
    {
      id: 2,
      image: "assets/extracted/polaroid_card_2.png",
      fullPhoto: "assets/extracted/photo2.png",
      caption: "Our Favorite Moment",
      rotation: 2,
      date: "Under The Sunset",
      note: "This evening will forever be locked in my heart. Just you and me, the warm breeze, and conversations that felt like poetry."
    },
    {
      id: 3,
      image: "assets/extracted/polaroid_card_3.png",
      fullPhoto: "assets/extracted/photo3.png",
      caption: "Together Forever",
      rotation: -2,
      date: "Our Quiet Adventures",
      note: "Holding your hand and walking through life with you is my absolute favorite adventure. No matter where we go, with you is home."
    },
    {
      id: 4,
      image: "assets/extracted/polaroid_card_4.png",
      fullPhoto: "assets/extracted/photo4.png",
      caption: "My Happy Place",
      rotation: 3,
      date: "In Your Arms",
      note: "Right here, wrapped in your warmth and love, is where I am happiest and most at peace. Happy Birthday to the love of my life!"
    }
  ],

  // Screen 4 special video
  video: {
    title: "Our Special Video",
    thumbnail: "assets/extracted/video_preview.png",
    durationText: "02:45",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-couple-at-sunset-40294-large.mp4"
  },

  // Screen 5 letter
  letter: {
    salutation: "To the most amazing person in my life,",
    name: "Thraveen,",
    paragraphs: [
      "You make every day brighter just by being you.",
      "Thank you for your love, your kindness and for being my constant happiness.",
      "I am so lucky to have you in my life.",
      "I hope this birthday brings you as much joy as you bring into mine."
    ],
    closing: "Happy Birthday, my love! ❤️",
    signoff: "Forever yours,",
    author: "Kamali"
  },

  // Screen 6 cake and celebration
  finale: {
    message: "Thank you for being my happiness,\nmy love and my everything.\nForever yours, Kamali ❤️",
    modals: {
      story: {
        title: "Our Story 📖",
        items: [
          { date: "Chapter 1", title: "When We First Met", desc: "A spark that turned into the brightest light in my life." },
          { date: "Chapter 2", title: "First Conversation", desc: "Hours felt like minutes, and I knew right then you were someone truly special." },
          { date: "Chapter 3", title: "Falling In Love", desc: "Not all at once, but in every little gesture, kind word, and sweet glance." },
          { date: "Chapter 4", title: "Today & Always", desc: "Celebrating the amazing human being you are on your special day." }
        ]
      },
      love: {
        title: "Things I Love About You 💕",
        reasons: [
          "The genuine warmth and comfort in your smile.",
          "How patiently and deeply you listen to me.",
          "The safety and peace I feel whenever you hold my hand.",
          "Your incredible passion, ambition, and determination.",
          "The way your eyes light up when you laugh wholeheartedly.",
          "Your endless kindness and the gentle way you treat the world."
        ]
      },
      forever: {
        title: "Forever Us ♾️",
        content: "Every single day with you is a gift I cherish. Through all the laughter, the quiet sunsets, and every adventure life holds for us, my heart will always choose you. Today, tomorrow, and forever."
      },
      always: {
        title: "My Eternal Promise ✨",
        content: "I promise to stand beside you, to celebrate your victories, comfort you in hard times, laugh at your jokes, and love you more with every passing sunrise. Happy Birthday, Thraveen!"
      }
    }
  }
};
