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

  return data[revisionId] || [
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
        isCorrect: true,
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
