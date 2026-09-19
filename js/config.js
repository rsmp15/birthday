// Website Configuration
// You can edit any details below to customize the website!
export const config = {
  recipientName: "Yashu",
  senderName: "Om",
  birthdayDate: "20 September",
  passcode: "2009", // Birthday Date 20 Sept
  passcodeHint: "Hint: Birthday Date (20 Sept) ❤️",

  // Music configuration
  music: {
    title: "Tere Hawaale - Arijit Singh & Shilpa Rao",
    url: "assets/audio/song.m4a",
    sources: [
      "assets/audio/song.m4a",
      "assets/audio/song.webm"
    ],
    startTime: 214, // Play from 3:34 (3 * 60 + 34 = 214s)
    autoplayOnUnlock: true
  },

  // Screen 2 greeting
  greeting: {
    subtitle: "Today is all about you and all the happiness you bring into my life every single day.",
    buttonText: "Unfold Love 💖"
  },

  // Screen 3 polaroid memories (using real WhatsApp couple photos)
  memories: [
    {
      id: 1,
      image: "assets/extracted/mem1_polaroid.jpg",
      fullPhoto: "assets/extracted/WhatsApp Image 2026-09-16 at 9.14.24 PM (1).jpeg",
      caption: "Our Smile",
      rotation: -3,
      date: "Forever With You",
      note: "Every time you look at me with that radiant smile, my entire world lights up. You make every ordinary moment feel completely extraordinary."
    },
    {
      id: 2,
      image: "assets/extracted/mem2_polaroid.jpg",
      fullPhoto: "assets/extracted/WhatsApp Image 2026-09-16 at 9.14.24 PM.jpeg",
      caption: "Holding Hands",
      rotation: 2,
      date: "In Your Hands",
      note: "Holding your hand and walking through life with you is my absolute favorite feeling. In your grip, I find all the strength and comfort I need."
    },
    {
      id: 3,
      image: "assets/extracted/mem3_polaroid.jpg",
      fullPhoto: "assets/extracted/WhatsApp Image 2026-09-16 at 9.14.25 PM.jpeg",
      caption: "Together Forever",
      rotation: -2,
      date: "Floating In Love",
      note: "With you, my heart feels lighter than air. No matter where life takes us, my heart will always choose you over and over again."
    },
    {
      id: 4,
      image: "assets/extracted/mem4_polaroid.jpg",
      fullPhoto: "assets/extracted/WhatsApp Image 2026-09-16 at 9.14.25 PM (1).jpeg",
      caption: "Sweet Kisses",
      rotation: 3,
      date: "Playful Moments",
      note: "All the laughter, the playful jokes, and the endless silly moments we share are what make our love so pure and irreplaceable."
    },
    {
      id: 5,
      image: "assets/extracted/mem5_polaroid.jpg",
      fullPhoto: "assets/extracted/WhatsApp Image 2026-09-16 at 9.14.23 PM.jpeg",
      caption: "My Happy Place",
      rotation: -2,
      date: "Warmth & Peace",
      note: "Right here, wrapped in your warmth and love, is where I am happiest and most at peace. Happy Birthday to the love of my life!"
    }
  ],

  // Screen 5 letter
  letter: {
    salutation: "To the most amazing person in my life,",
    name: "Yashu,",
    paragraphs: [
      "You make every day brighter just by being you.",
      "Thank you for your love, your kindness and for being my constant happiness.",
      "I am so lucky to have you in my life.",
      "I hope this birthday brings you as much joy as you bring into mine."
    ],
    closing: "Happy Birthday, my love! ❤️",
    signoff: "Forever yours,",
    author: "Om"
  },

  // Screen 6 cake and celebration
  finale: {
    message: "Thank you for being my happiness,\nmy love and my everything.\nForever yours, Om ❤️",
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
        content: "I promise to stand beside you, to celebrate your victories, comfort you in hard times, laugh at your jokes, and love you more with every passing sunrise. Happy Birthday, Yashu!"
      }
    }
  }
};
