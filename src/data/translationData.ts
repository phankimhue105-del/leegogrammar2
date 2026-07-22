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
  id: number;
  vietnamese: string;
  correctAnswers: string[];
}

export const getTask2Questions = (revisionId: string): TranslationTask[] => {
  const data: Record<string, { vietnamese: string; correctAnswers: string[] }[]> = {
    'mini-1-3': [
      {
        vietnamese: "Những đứa trẻ đang chơi với những đồ chơi mới của chúng.",
        correctAnswers: [
          "The children are playing with their new toys.",
          "Children are playing with their new toys.",
          "The children are playing with new toys."
        ]
      },
      {
        vietnamese: "Có ba chiếc hộp và năm chiếc chìa khóa ở trên bàn.",
        correctAnswers: [
          "There are three boxes and five keys on the table.",
          "There are 3 boxes and 5 keys on the table."
        ]
      }
    ],
    'mini-4-6': [
      {
        vietnamese: "Anh ấy đang dắt con chó của anh ấy đi dạo trong công viên.",
        correctAnswers: [
          "He is walking his dog in the park.",
          "He is taking his dog for a walk in the park."
        ]
      },
      {
        vietnamese: "Họ yêu thích ngôi nhà mới của họ vì nó rất đẹp.",
        correctAnswers: [
          "They love their new house because it is very beautiful.",
          "They like their new house because it is very beautiful.",
          "They love their new house because it is beautiful."
        ]
      }
    ],
    'rev-1-6': [
      {
        vietnamese: "Chúng tôi yêu ngôi trường tiểu học của chúng tôi.",
        correctAnswers: [
          "We love our primary school.",
          "We love our elementary school."
        ]
      },
      {
        vietnamese: "Tôi nhìn thấy những con chuột nhỏ dưới giường ngủ.",
        correctAnswers: [
          "I see small mice under the bed.",
          "I see little mice under the bed.",
          "I see some small mice under the bed."
        ]
      }
    ],
    'mini-7-10': [
      {
        vietnamese: "Những con khỉ đang leo trèo trên cây lúc này.",
        correctAnswers: [
          "The monkeys are climbing the trees right now.",
          "Monkeys are climbing on trees right now.",
          "The monkeys are climbing trees at the moment."
        ]
      },
      {
        vietnamese: "Mẹ tôi đang nấu bữa tối trong bếp vào lúc này.",
        correctAnswers: [
          "My mother is cooking dinner in the kitchen at the moment.",
          "My mom is cooking dinner in the kitchen right now.",
          "My mother is cooking dinner in the kitchen right now."
        ]
      }
    ],
    'rev-7-10': [
      {
        vietnamese: "Cô ấy luôn luôn uống sữa vào buổi sáng.",
        correctAnswers: [
          "She always drinks milk in the morning.",
          "She always has milk in the morning."
        ]
      },
      {
        vietnamese: "Trời đang mưa rất to bên ngoài vào lúc này.",
        correctAnswers: [
          "It is raining very hard outside right now.",
          "It is raining heavily outside at the moment.",
          "It is raining hard outside right now."
        ]
      }
    ],
    'mini-11-13': [
      {
        vietnamese: "Họ không phải đang xem tivi trong phòng khách.",
        correctAnswers: [
          "They are not watching television in the living room.",
          "They are not watching TV in the living room.",
          "They aren't watching TV in the living room."
        ]
      },
      {
        vietnamese: "Bạn đang làm gì trong phòng của bạn thế?",
        correctAnswers: [
          "What are you doing in your room?",
          "What are you doing in your bedroom?"
        ]
      }
    ],
    'mini-14-15': [
      {
        vietnamese: "Con mèo đang ngủ ở bên cạnh cái ghế sofa.",
        correctAnswers: [
          "The cat is sleeping next to the sofa.",
          "The cat is sleeping beside the sofa."
        ]
      },
      {
        vietnamese: "Quả bóng màu đỏ nằm giữa hai chiếc hộp.",
        correctAnswers: [
          "The red ball is between the two boxes.",
          "The red ball lies between two boxes."
        ]
      }
    ],
    'rev-11-15': [
      {
        vietnamese: "Họ đang ngồi dưới một cái cây lớn trong vườn.",
        correctAnswers: [
          "They are sitting under a big tree in the garden.",
          "They are sitting under a large tree in the garden."
        ]
      },
      {
        vietnamese: "Có một chiếc xe hơi màu xanh ở đằng trước ngôi nhà.",
        correctAnswers: [
          "There is a blue car in front of the house.",
          "There is a blue car parked in front of the house."
        ]
      }
    ],
    'rev-16-18': [
      {
        vietnamese: "Hôm qua chúng tôi đã đi đến rạp chiếu phim và xem một bộ phim hay.",
        correctAnswers: [
          "Yesterday we went to the cinema and watched a good movie.",
          "We went to the movie theater and watched a good movie yesterday.",
          "We went to the cinema and saw a good film yesterday."
        ]
      },
      {
        vietnamese: "Anh ấy đã không mua món đồ chơi mới đó tuần trước.",
        correctAnswers: [
          "He did not buy that new toy last week.",
          "He didn't buy that new toy last week."
        ]
      }
    ],
    'rev-19-20': [
      {
        vietnamese: "Chúng tôi dự định sẽ đến thăm bà của chúng tôi vào cuối tuần tới.",
        correctAnswers: [
          "We are going to visit our grandmother next weekend.",
          "We are going to visit our grandma next weekend.",
          "We plan to visit our grandmother next weekend."
        ]
      },
      {
        vietnamese: "Tôi nghĩ trời sẽ mưa vào ngày mai.",
        correctAnswers: [
          "I think it will rain tomorrow.",
          "I think that it will rain tomorrow."
        ]
      }
    ],
    'rev-21': [
      {
        vietnamese: "Bạn nên ăn nhiều rau xanh và trái cây mỗi ngày.",
        correctAnswers: [
          "You should eat more green vegetables and fruits every day.",
          "You should eat lots of green vegetables and fruit daily.",
          "You should eat more vegetables and fruits every day."
        ]
      },
      {
        vietnamese: "Học sinh không được chạy ở trong hành lang trường học.",
        correctAnswers: [
          "Students must not run in the school corridor.",
          "Students mustn't run in the school corridor."
        ]
      }
    ],
    'mini-22-23': [
      {
        vietnamese: "Đây là món đồ chơi mà bố tôi đã mua cho tôi.",
        correctAnswers: [
          "This is the toy which my father bought for me.",
          "This is the toy that my father bought for me.",
          "This is the toy my dad bought for me."
        ]
      },
      {
        vietnamese: "Toby là cậu bé chơi bóng đá rất giỏi.",
        correctAnswers: [
          "Toby is the boy who plays football very well.",
          "Toby is the boy that plays football very well.",
          "Toby is the boy who plays soccer very well."
        ]
      }
    ],
    'mini-24-26': [
      {
        vietnamese: "Tôi đến thư viện để đọc sách vào mỗi Chủ Nhật.",
        correctAnswers: [
          "I go to the library to read books every Sunday.",
          "I go to the library to read books on Sundays.",
          "I visit the library to read books every Sunday."
        ]
      },
      {
        vietnamese: "Cô ấy mua bột mì để làm một chiếc bánh kem sinh nhật.",
        correctAnswers: [
          "She bought flour to make a birthday cake.",
          "She bought some flour to make a birthday cake."
        ]
      }
    ],
    'rev-22-26': [
      {
        vietnamese: "Toby là cậu bé người đã đi đến chợ để mua rau.",
        correctAnswers: [
          "Toby is the boy who went to the market to buy vegetables.",
          "Toby is the boy who went to the market to buy some vegetables.",
          "Toby is the boy that went to the market to buy vegetables."
        ]
      },
      {
        vietnamese: "Tôi đọc cuốn sách mà bạn đã mua vì nó rất hay.",
        correctAnswers: [
          "I read the book which you bought because it is very good.",
          "I read the book that you bought because it is very good.",
          "I read the book which you bought because it is interesting."
        ]
      }
    ],
    'rev-27-28': [
      {
        vietnamese: "Anh ấy chạy rất nhanh để bắt chuyến xe buýt trường học.",
        correctAnswers: [
          "He ran very quickly to catch the school bus.",
          "He ran very fast to catch the school bus."
        ]
      },
      {
        vietnamese: "Người đàn ông lớn tuổi đi bộ chậm rãi qua công viên.",
        correctAnswers: [
          "The old man walked slowly through the park.",
          "The old man walked slowly across the park."
        ]
      }
    ],
    'final-revision': [
      {
        vietnamese: "Bây giờ tôi có thể viết các câu tiếng Anh một cách cẩn thận.",
        correctAnswers: [
          "Now I can write English sentences carefully.",
          "I can write English sentences carefully now.",
          "I can write English sentences very carefully now."
        ]
      },
      {
        vietnamese: "Cô ấy đã rất vui vẻ vì cô ấy đã đỗ kỳ thi tiếng Anh.",
        correctAnswers: [
          "She was very happy because she passed the English test.",
          "She was happy because she passed the English exam."
        ]
      }
    ]
  };

  const questions = data[revisionId] || [
    {
      vietnamese: "Họ học tiếng Anh tại trung tâm LeeGo.",
      correctAnswers: [
        "They study English at LeeGo center.",
        "They learn English at LeeGo center."
      ]
    },
    {
      vietnamese: "Chúng tôi muốn thực hành nói tiếng Anh mỗi ngày.",
      correctAnswers: [
        "We want to practice speaking English every day.",
        "We want to practice speaking English daily."
      ]
    }
  ];

  return questions.map((q, idx) => ({
    ...q,
    id: 3000 + idx
  }));
};

export function evaluateTranslation(
  studentAnswer: string,
  correctAnswer: string | string[]
) {
  const correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
  
  const cleanStr = (s: string) => s.trim().replace(/\s+/g, ' ');
  const stripPunctuation = (s: string) => s.replace(/[.!?]+$/, '').trim();

  const studentClean = cleanStr(studentAnswer);
  const studentLower = studentClean.toLowerCase();

  // 1. Exact match (case-insensitive)
  const matchesExact = correctAnswers.some(ans => cleanStr(ans).toLowerCase() === studentLower);
  if (matchesExact) {
    return {
      score: 100,
      feedback: "Excellent! Your translation is completely correct.",
      overallFeedback: "Excellent! Your translation is completely correct.",
      isCorrect: true,
      grammarScore: 100,
      vocabScore: 100,
      structureScore: 100,
      corrections: []
    };
  }

  // 2. Stripped match (punctuation error only)
  const studentStripped = stripPunctuation(studentClean).toLowerCase();
  const matchedAns = correctAnswers.find(ans => stripPunctuation(cleanStr(ans)).toLowerCase() === studentStripped);

  if (matchedAns) {
    const hasPunctuation = /[.!?]$/.test(studentClean);
    const correctHasPunctuation = /[.!?]$/.test(cleanStr(matchedAns));
    
    if (!hasPunctuation && correctHasPunctuation) {
      return {
        score: 99,
        feedback: "Excellent grammar and vocabulary. 1 point was deducted because the sentence is missing the final punctuation mark. Please remember to finish English sentences with appropriate punctuation.",
        overallFeedback: "Excellent grammar and vocabulary. 1 point was deducted because the sentence is missing the final punctuation mark. Please remember to finish English sentences with appropriate punctuation.",
        isCorrect: true, // Mark true for correctness, but penalize points
        grammarScore: 100,
        vocabScore: 100,
        structureScore: 100,
        corrections: []
      };
    }
  }

  // 3. Otherwise, calculate word overlap score
  const getWordOverlapScore = (stud: string, correct: string) => {
    const studWords = stud.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).filter(Boolean);
    const corrWords = correct.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).filter(Boolean);
    
    const matched = studWords.filter(w => corrWords.includes(w));
    const overlapRatio = matched.length / Math.max(studWords.length, corrWords.length);
    return Math.round(overlapRatio * 100);
  };

  let bestScore = 0;
  let bestMatch = correctAnswers[0];
  correctAnswers.forEach(ans => {
    const score = getWordOverlapScore(studentClean, ans);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = ans;
    }
  });

  const finalScore = Math.max(30, bestScore);
  
  let feedback = "Watch the word order. Try to match the grammar of the lesson.";
  if (finalScore >= 90) {
    feedback = "Almost correct. Check the spelling or word choice.";
  } else if (finalScore >= 75) {
    feedback = "Good job! Check the verb tense or article.";
  } else if (finalScore >= 50) {
    feedback = "Remember the grammar point of the lesson and check the vocabulary.";
  }

  const corrections = [
    {
      original: studentClean,
      corrected: bestMatch,
      grammarRule: "Grammar & Vocabulary Match",
      explanation: `Dịch đúng là: "${bestMatch}". Hãy đối chiếu bài viết của con để sửa các lỗi từ vựng hoặc chia động từ nhé.`,
      memoryTip: "Hãy luyện tập dịch nhiều câu tương tự để ghi nhớ cấu trúc.",
      encouragement: "Cố lên con nhé, hãy bấm nút thử lại để đạt điểm cao hơn! 💪"
    }
  ];

  const grammarScore = Math.max(35, Math.round(finalScore * 0.95));
  const vocabScore = Math.max(35, Math.round(finalScore * 1.0));
  const structureScore = Math.max(30, Math.round(finalScore * 0.9));

  return {
    score: finalScore,
    feedback: feedback,
    overallFeedback: feedback,
    isCorrect: false,
    grammarScore,
    vocabScore,
    structureScore,
    corrections
  };
}
