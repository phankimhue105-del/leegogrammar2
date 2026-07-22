import { WritingChallengeTask } from './syllabus';

export interface ShuffledWord {
  id: string;
  text: string;
}

// Helper to extract first sentence
export const getTargetSentence = (sampleAnswer: string): string => {
  const match = sampleAnswer.match(/^[^.!?]+[.!?]?/);
  return match ? match[0].trim() : sampleAnswer.trim();
};

export const getTask1Questions = (revisionId: string, baseTask: WritingChallengeTask): Array<WritingChallengeTask> => {
  const extra: Record<string, Array<{ prompt: string; helperWords?: string[]; sampleAnswer: string }>> = {
    'mini-1-3': [
      {
        prompt: "Write a sentence using the plural form of 'man' and 'woman'.",
        helperWords: ["men", "women", "talk"],
        sampleAnswer: "The men and women are talking in the meeting room."
      },
      {
        prompt: "Write a sentence using the plural form of 'box' and 'key'.",
        helperWords: ["boxes", "keys", "table"],
        sampleAnswer: "There are many boxes and keys on the table."
      }
    ],
    'mini-4-6': [
      {
        prompt: "Write a sentence using 'he' and 'his' to describe a boy and his dog.",
        helperWords: ["he", "his", "dog", "play"],
        sampleAnswer: "He is playing with his small dog in the park."
      },
      {
        prompt: "Write a sentence using 'they' and 'their' to describe children and their house.",
        helperWords: ["they", "their", "house", "big"],
        sampleAnswer: "They are painting their big house together."
      }
    ],
    'rev-1-6': [
      {
        prompt: "Write a sentence using singular 'child' and plural 'mice'.",
        helperWords: ["child", "mice", "afraid"],
        sampleAnswer: "The little child is afraid of the wild mice."
      },
      {
        prompt: "Write a sentence using 'we' and 'our' to describe friends.",
        helperWords: ["we", "our", "school", "go"],
        sampleAnswer: "We go to our school together every morning."
      }
    ],
    'mini-7-10': [
      {
        prompt: "Write a sentence using 'this' and Present Continuous to describe what you are doing now.",
        helperWords: ["this book", "reading"],
        sampleAnswer: "I am reading this book in the library now."
      },
      {
        prompt: "Write a sentence using 'these' and 'are playing' to describe monkeys.",
        helperWords: ["these monkeys", "playing", "tree"],
        sampleAnswer: "These monkeys are playing on the tall tree."
      }
    ],
    'rev-7-10': [
      {
        prompt: "Write a sentence using Present Simple to describe a habit.",
        helperWords: ["every day", "eat", "apple"],
        sampleAnswer: "I eat a fresh apple every day for breakfast."
      },
      {
        prompt: "Write a sentence using Present Continuous to describe what is happening right now.",
        helperWords: ["at the moment", "rain", "outside"],
        sampleAnswer: "It is raining heavily outside at the moment."
      }
    ],
    'mini-11-13': [
      {
        prompt: "Write a negative Present Continuous sentence about what they are NOT doing.",
        helperWords: ["they", "not watching", "TV"],
        sampleAnswer: "They are not watching TV in the bedroom right now."
      },
      {
        prompt: "Write a Present Continuous question about what someone is doing.",
        helperWords: ["what", "she", "cooking"],
        sampleAnswer: "What is she cooking in the kitchen?"
      }
    ],
    'mini-14-15': [
      {
        prompt: "Write a sentence using 'next to' to describe where a cat is.",
        helperWords: ["cat", "next to", "sofa"],
        sampleAnswer: "The sleeping cat is sitting next to the warm sofa."
      },
      {
        prompt: "Write a sentence using 'between' to describe where a ball is.",
        helperWords: ["ball", "between", "boxes"],
        sampleAnswer: "The red ball is lying between the two large boxes."
      }
    ],
    'rev-11-15': [
      {
        prompt: "Write a sentence using 'in front of' to describe where a car is parked.",
        helperWords: ["car", "in front of", "house"],
        sampleAnswer: "There is a blue car parked in front of our house."
      },
      {
        prompt: "Write a sentence using Present Continuous and a preposition of place.",
        helperWords: ["sitting", "under", "tree"],
        sampleAnswer: "They are sitting under the big tree in the garden."
      }
    ],
    'rev-16-18': [
      {
        prompt: "Write a sentence using Past Simple of 'go' and 'see'.",
        helperWords: ["went", "saw", "yesterday"],
        sampleAnswer: "We went to the zoo and saw a big tiger yesterday."
      },
      {
        prompt: "Write a negative Past Simple sentence using 'did not'.",
        helperWords: ["did not buy", "last week"],
        sampleAnswer: "She did not buy the new toy car last week."
      }
    ],
    'rev-19-20': [
      {
        prompt: "Write a sentence using 'will' to make a prediction about tomorrow.",
        helperWords: ["will rain", "tomorrow"],
        sampleAnswer: "I think it will rain tomorrow afternoon."
      },
      {
        prompt: "Write a sentence using 'be going to' to describe a future plan.",
        helperWords: ["going to visit", "grandmother"],
        sampleAnswer: "We are going to visit our grandmother next weekend."
      }
    ],
    'rev-21': [
      {
        prompt: "Write a sentence using 'mustn't' to describe a rule.",
        helperWords: ["mustn't run", "corridor"],
        sampleAnswer: "Students mustn't run in the school corridor."
      },
      {
        prompt: "Write a sentence using 'should' to give advice.",
        helperWords: ["should eat", "vegetables"],
        sampleAnswer: "You should eat more green vegetables every day."
      }
    ],
    'mini-22-23': [
      {
        prompt: "Write a sentence using 'which' to describe a toy.",
        helperWords: ["toy which", "bought"],
        sampleAnswer: "This is the cool toy which my father bought for me."
      },
      {
        prompt: "Write a sentence using 'who' to describe a boy.",
        helperWords: ["boy who", "plays"],
        sampleAnswer: "Toby is the happy boy who plays football very well."
      }
    ],
    'mini-24-26': [
      {
        prompt: "Write a sentence using 'to' + base verb to describe why you go to the library.",
        helperWords: ["go to library", "to read"],
        sampleAnswer: "I go to the library to read quiet books on Sundays."
      },
      {
        prompt: "Write a sentence using 'to' + base verb to describe why she bought flour.",
        helperWords: ["bought flour", "to make", "cake"],
        sampleAnswer: "She bought flour to make a tasty birthday cake."
      }
    ],
    'rev-22-26': [
      {
        prompt: "Write a sentence using 'who' and 'to' + base verb.",
        helperWords: ["boy who", "went to market", "to buy"],
        sampleAnswer: "Toby is the boy who went to the market to buy food."
      },
      {
        prompt: "Write a sentence using 'which' and 'because'.",
        helperWords: ["book which", "bought", "because"],
        sampleAnswer: "I read the book which you bought because it is interesting."
      }
    ],
    'rev-27-28': [
      {
        prompt: "Write a sentence using the adverb 'quickly'.",
        helperWords: ["ran quickly", "catch", "bus"],
        sampleAnswer: "He ran quickly to catch the school bus this morning."
      },
      {
        prompt: "Write a sentence using the adverb 'slowly'.",
        helperWords: ["walked slowly", "park"],
        sampleAnswer: "The old man walked slowly through the quiet park."
      }
    ],
    'final-revision': [
      {
        prompt: "Write a sentence using Present Continuous and an adverb of manner.",
        helperWords: ["writing carefully", "now"],
        sampleAnswer: "I am writing my English sentences carefully now."
      },
      {
        prompt: "Write a sentence using Past Simple and 'because'.",
        helperWords: ["happy because", "passed", "test"],
        sampleAnswer: "She was very happy because she passed her math test."
      }
    ]
  };

  const extraQuestions = extra[revisionId] || [
    {
      prompt: "Write another sentence related to the grammar of this unit.",
      helperWords: ["practice", "more"],
      sampleAnswer: "We want to practice more English every day."
    },
    {
      prompt: "Write one more sentence related to the grammar of this unit.",
      helperWords: ["study", "hard"],
      sampleAnswer: "Students should study hard to get good grades."
    }
  ];

  return [
    { ...baseTask },
    { id: baseTask.id + 100, type: baseTask.type, title: baseTask.title + " (Q2)", ...extraQuestions[0] },
    { id: baseTask.id + 200, type: baseTask.type, title: baseTask.title + " (Q3)", ...extraQuestions[1] }
  ];
};

export interface TranslationTask {
  vietnamese: string;
  correctAnswers: string[];
}

export const getTranslationTask = (revisionId: string): TranslationTask => {
  const data: Record<string, TranslationTask> = {
    'mini-1-3': {
      vietnamese: "Những đứa trẻ đang chơi với những đồ chơi mới của chúng.",
      correctAnswers: [
        "The children are playing with their new toys.",
        "Children are playing with their new toys.",
        "The children are playing with new toys."
      ]
    },
    'mini-4-6': {
      vietnamese: "Anh ấy đang dắt con chó của anh ấy đi dạo trong công viên.",
      correctAnswers: [
        "He is walking his dog in the park.",
        "He is taking his dog for a walk in the park."
      ]
    },
    'rev-1-6': {
      vietnamese: "Chúng tôi yêu ngôi trường tiểu học của chúng tôi.",
      correctAnswers: [
        "We love our primary school.",
        "We love our elementary school."
      ]
    },
    'mini-7-10': {
      vietnamese: "Những con khỉ đang leo trèo trên cây lúc này.",
      correctAnswers: [
        "The monkeys are climbing the trees right now.",
        "Monkeys are climbing on trees right now.",
        "The monkeys are climbing trees at the moment."
      ]
    },
    'rev-7-10': {
      vietnamese: "Cô ấy luôn luôn uống sữa vào buổi sáng.",
      correctAnswers: [
        "She always drinks milk in the morning.",
        "She always has milk in the morning."
      ]
    },
    'mini-11-13': {
      vietnamese: "Họ không phải đang xem tivi trong phòng khách.",
      correctAnswers: [
        "They are not watching television in the living room.",
        "They are not watching TV in the living room.",
        "They aren't watching TV in the living room."
      ]
    },
    'mini-14-15': {
      vietnamese: "Con mèo đang ngủ ở bên cạnh cái ghế sofa.",
      correctAnswers: [
        "The cat is sleeping next to the sofa.",
        "The cat is sleeping beside the sofa."
      ]
    },
    'rev-11-15': {
      vietnamese: "Họ đang ngồi dưới một cái cây lớn trong vườn.",
      correctAnswers: [
        "They are sitting under a big tree in the garden.",
        "They are sitting under a large tree in the garden."
      ]
    },
    'rev-16-18': {
      vietnamese: "Hôm qua chúng tôi đã đi đến rạp chiếu phim và xem một bộ phim hay.",
      correctAnswers: [
        "Yesterday we went to the cinema and watched a good movie.",
        "We went to the movie theater and watched a good movie yesterday.",
        "We went to the cinema and saw a good film yesterday."
      ]
    },
    'rev-19-20': {
      vietnamese: "Chúng tôi dự định sẽ đến thăm bà của chúng tôi vào cuối tuần tới.",
      correctAnswers: [
        "We are going to visit our grandmother next weekend.",
        "We are going to visit our grandma next weekend.",
        "We plan to visit our grandmother next weekend."
      ]
    },
    'rev-21': {
      vietnamese: "Bạn nên ăn nhiều rau xanh và trái cây mỗi ngày.",
      correctAnswers: [
        "You should eat more green vegetables and fruits every day.",
        "You should eat lots of green vegetables and fruit daily.",
        "You should eat more vegetables and fruits every day."
      ]
    },
    'mini-22-23': {
      vietnamese: "Đây là món đồ chơi mà bố tôi đã mua cho tôi.",
      correctAnswers: [
        "This is the toy which my father bought for me.",
        "This is the toy that my father bought for me.",
        "This is the toy my dad bought for me."
      ]
    },
    'mini-24-26': {
      vietnamese: "Tôi đến thư viện để đọc sách vào mỗi Chủ Nhật.",
      correctAnswers: [
        "I go to the library to read books every Sunday.",
        "I go to the library to read books on Sundays.",
        "I visit the library to read books every Sunday."
      ]
    },
    'rev-22-26': {
      vietnamese: "Toby là cậu bé người đã đi đến chợ để mua rau.",
      correctAnswers: [
        "Toby is the boy who went to the market to buy vegetables.",
        "Toby is the boy who went to the market to buy some vegetables.",
        "Toby is the boy that went to the market to buy vegetables."
      ]
    },
    'rev-27-28': {
      vietnamese: "Anh ấy chạy rất nhanh để bắt chuyến xe buýt trường học.",
      correctAnswers: [
        "He ran very quickly to catch the school bus.",
        "He ran very fast to catch the school bus."
      ]
    },
    'final-revision': {
      vietnamese: "Bây giờ tôi có thể viết các câu tiếng Anh một cách cẩn thận.",
      correctAnswers: [
        "Now I can write English sentences carefully.",
        "I can write English sentences carefully now.",
        "I can write English sentences very carefully now."
      ]
    }
  };

  return data[revisionId] || {
    vietnamese: "Họ học tiếng Anh tại trung tâm LeeGo.",
    correctAnswers: [
      "They study English at LeeGo center.",
      "They learn English at LeeGo center."
    ]
  };
};

