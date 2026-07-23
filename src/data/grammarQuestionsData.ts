import { Question } from './syllabus';

export const grammarQuestionsDatabase: Record<number, Omit<Question, 'id'>[]> = {
  7: [
    {
      question: "I ______ a student at LeeGo Center.",
      options: ["am", "is", "are", "be"],
      answer: "am",
      hint: "Chủ ngữ 'I' luôn đi kèm động từ to be 'am' ở hiện tại đơn."
    },
    {
      question: "They ______ very happy today.",
      options: ["am", "is", "are", "be"],
      answer: "are",
      hint: "'They' là chủ ngữ số nhiều, ta dùng động từ to be 'are' nhé."
    },
    {
      question: "______ she your sister? - Yes, she is.",
      options: ["Am", "Is", "Are", "Be"],
      answer: "Is",
      hint: "Chủ ngữ 'she' số ít, dùng 'Is' để đặt câu hỏi ở hiện tại."
    },
    {
      question: "He ______ not a doctor. He is a teacher.",
      options: ["am", "is", "are", "be"],
      answer: "is",
      hint: "Chủ ngữ 'He' số ít, đi kèm 'is not' (isn't)."
    },
    {
      question: "We ______ in the classroom now.",
      options: ["am", "is", "are", "be"],
      answer: "are",
      hint: "Chủ ngữ 'We' số nhiều, dùng động từ to be 'are' con nhé."
    },
    {
      question: "It ______ a beautiful white cat.",
      options: ["am", "is", "are", "be"],
      answer: "is",
      hint: "Chủ ngữ 'It' số ít, dùng động từ to be 'is'."
    },
    {
      question: "______ you ready? - Yes, I am.",
      options: ["Am", "Is", "Are", "Be"],
      answer: "Are",
      hint: "Chủ ngữ 'you' luôn đi kèm động từ to be 'Are' trong câu hỏi."
    },
    {
      question: "My parents ______ at home today.",
      options: ["is", "are", "am", "be"],
      answer: "are",
      hint: "'My parents' (bố mẹ tớ) là danh từ số nhiều, dùng 'are'."
    },
    {
      question: "The weather ______ very nice today.",
      options: ["am", "is", "are", "be"],
      answer: "is",
      hint: "'Weather' là danh từ không đếm được, ta dùng động từ số ít 'is'."
    },
    {
      question: "______ I in the right room? - Yes, you are.",
      options: ["Am", "Is", "Are", "Be"],
      answer: "Am",
      hint: "Đặt câu hỏi với chủ ngữ 'I' thì dùng động từ to be 'Am'."
    }
  ],
  8: [
    {
      question: "I ______ a new schoolbag.",
      options: ["have got", "has got", "having got", "is got"],
      answer: "have got",
      hint: "Chủ ngữ 'I' đi với cấu trúc sở hữu 'have got' nha."
    },
    {
      question: "She ______ blue eyes and blonde hair.",
      options: ["have got", "has got", "having got", "is got"],
      answer: "has got",
      hint: "Chủ ngữ 'She' số ít, ta dùng cấu trúc 'has got'."
    },
    {
      question: "______ you got any brothers or sisters?",
      options: ["Have", "Has", "Are", "Do"],
      answer: "Have",
      hint: "Đặt câu hỏi với cấu trúc 'have got' cho chủ ngữ 'you' dùng 'Have'."
    },
    {
      question: "Toby ______ got a pet dog.",
      options: ["have", "has", "is", "does"],
      answer: "has",
      hint: "Toby là danh từ riêng số ít, dùng 'has got'."
    },
    {
      question: "They ______ got a big garden.",
      options: ["haven't", "hasn't", "don't", "isn't"],
      answer: "haven't",
      hint: "Phủ định của 'have got' cho chủ ngữ số nhiều 'They' là 'haven't got'."
    },
    {
      question: "He ______ a toy car. (Negative)",
      options: ["hasn't got", "haven't got", "doesn't got", "isn't got"],
      answer: "hasn't got",
      hint: "Chủ ngữ 'He' đi với phủ định 'hasn't got'."
    },
    {
      question: "______ she got a bicycle? - No, she hasn't.",
      options: ["Have", "Has", "Does", "Is"],
      answer: "Has",
      hint: "Câu hỏi 'have got' cho chủ ngữ số ít 'she' dùng 'Has'."
    },
    {
      question: "We ______ a lot of toys in our room.",
      options: ["have got", "has got", "are got", "do got"],
      answer: "have got",
      hint: "Chủ ngữ số nhiều 'We' đi với cấu trúc 'have got'."
    },
    {
      question: "The puppy ______ got a short tail.",
      options: ["have", "has", "is", "are"],
      answer: "has",
      hint: "'The puppy' là số ít, dùng 'has got'."
    },
    {
      question: "Have they got a red ball? - Yes, they ______.",
      options: ["have", "has", "got", "have got"],
      answer: "have",
      hint: "Câu trả lời ngắn của 'Have they got...?' là 'Yes, they have'."
    }
  ],
  9: [
    {
      question: "I love ______ in the swimming pool.",
      options: ["swimming", "to swimming", "swim", "swimmed"],
      answer: "swimming",
      hint: "Sau động từ chỉ sở thích 'love', ta dùng động từ dạng V-ing."
    },
    {
      question: "He wants ______ a doctor in the future.",
      options: ["to become", "becoming", "become", "becomes"],
      answer: "to become",
      hint: "Sau động từ chỉ mong muốn 'want', ta dùng 'to + động từ nguyên mẫu'."
    },
    {
      question: "They enjoy ______ English together.",
      options: ["learning", "to learn", "learn", "learns"],
      answer: "learning",
      hint: "Sau động từ 'enjoy', ta luôn dùng động từ đuôi V-ing."
    },
    {
      question: "She decided ______ a new book yesterday.",
      options: ["to buy", "buying", "buy", "bought"],
      answer: "to buy",
      hint: "Sau động từ 'decide', ta dùng 'to + động từ nguyên mẫu'."
    },
    {
      question: "We hope ______ you again soon.",
      options: ["to see", "seeing", "see", "saw"],
      answer: "to see",
      hint: "Sau động từ 'hope', ta dùng 'to + động từ nguyên mẫu'."
    },
    {
      question: "Do you like ______ cartoons on TV?",
      options: ["watching", "to watching", "watch", "watches"],
      answer: "watching",
      hint: "Sau 'like' khi nói về sở thích lâu dài, ta dùng động từ V-ing."
    },
    {
      question: "She hates ______ early in the morning.",
      options: ["getting up", "to getting up", "get up", "got up"],
      answer: "getting up",
      hint: "Sau 'hate', ta dùng động từ đuôi V-ing để chỉ sự ghét việc gì."
    },
    {
      question: "He wants ______ pizza for lunch.",
      options: ["to eat", "eating", "eat", "eats"],
      answer: "to eat",
      hint: "Cấu trúc chỉ ý muốn: want + to + động từ nguyên mẫu."
    },
    {
      question: "My friends enjoy ______ soccer in the park.",
      options: ["playing", "to play", "play", "plays"],
      answer: "playing",
      hint: "Sau 'enjoy', ta dùng động từ đuôi V-ing."
    },
    {
      question: "They decided ______ home early.",
      options: ["to go", "going", "go", "went"],
      answer: "to go",
      hint: "Cấu trúc: decide + to + động từ nguyên mẫu."
    }
  ],
  10: [
    {
      question: "______ your books to page 10, please.",
      options: ["Open", "Opening", "Opens", "To open"],
      answer: "Open",
      hint: "Câu mệnh lệnh khẳng định bắt đầu bằng động từ ở dạng nguyên mẫu."
    },
    {
      question: "______ make noise! The baby is sleeping.",
      options: ["Don't", "Not", "No", "Doesn't"],
      answer: "Don't",
      hint: "Câu mệnh lệnh phủ định (cấm đoán) bắt đầu bằng 'Don't + V-base'."
    },
    {
      question: "It is very hot. ______ open the window.",
      options: ["Let's", "Let", "We let", "Don't"],
      answer: "Let's",
      hint: "Dùng 'Let's + động từ nguyên mẫu' để đề nghị cùng thực hiện hành động."
    },
    {
      question: "______ touch that glass! It is very hot.",
      options: ["Don't", "Not", "Doesn't", "No"],
      answer: "Don't",
      hint: "Mệnh lệnh phủ định cảnh báo nguy hiểm dùng 'Don't + V-base'."
    },
    {
      question: "______ quietly in the classroom, please.",
      options: ["Sit", "Sitting", "Sits", "To sit"],
      answer: "Sit",
      hint: "Yêu cầu lịch sự dùng động từ nguyên mẫu ở đầu câu."
    },
    {
      question: "______ eat too many candies. It is bad for your teeth.",
      options: ["Don't", "Not", "No", "Doesn't"],
      answer: "Don't",
      hint: "Mệnh lệnh khuyên bảo phủ định dùng 'Don't'."
    },
    {
      question: "______ go to the park and play football!",
      options: ["Let's", "Let", "We", "Don't"],
      answer: "Let's",
      hint: "Đề nghị cùng làm gì đó dùng 'Let's + V-base'."
    },
    {
      question: "______ up, please. The teacher is entering.",
      options: ["Stand", "Standing", "Stands", "To stand"],
      answer: "Stand",
      hint: "Mệnh lệnh đứng dậy dùng động từ nguyên mẫu 'Stand'."
    },
    {
      question: "______ run in the school corridor. It is dangerous.",
      options: ["Don't", "Not", "No", "Doesn't"],
      answer: "Don't",
      hint: "Cấm đoán nội quy dùng 'Don't'."
    },
    {
      question: "______ learn English grammar with LeeGo!",
      options: ["Let's", "Let", "We", "Us"],
      answer: "Let's",
      hint: "Lời đề xuất cùng học tiếng Anh dùng 'Let's'."
    }
  ],
  11: [
    {
      question: "He ______ to school by bus every day.",
      options: ["goes", "go", "going", "went"],
      answer: "goes",
      hint: "Chủ ngữ số ít 'He' đi với động từ thêm đuôi -es ở hiện tại đơn."
    },
    {
      question: "They ______ like eating fish.",
      options: ["don't", "doesn't", "isn't", "not"],
      answer: "don't",
      hint: "Chủ ngữ số nhiều 'They' dùng trợ động từ phủ định 'don't'."
    },
    {
      question: "______ you study English at LeeGo Center?",
      options: ["Do", "Does", "Are", "Is"],
      answer: "Do",
      hint: "Câu hỏi ở hiện tại đơn với chủ ngữ 'you' dùng trợ động từ 'Do'."
    },
    {
      question: "She ______ reading books in her free time.",
      options: ["likes", "like", "liking", "liked"],
      answer: "likes",
      hint: "Chủ ngữ số ít 'She' yêu cầu động từ 'like' thêm 's'."
    },
    {
      question: "My father ______ work on Sundays.",
      options: ["doesn't", "don't", "isn't", "not"],
      answer: "doesn't",
      hint: "Chủ ngữ ngôi thứ ba số ít 'My father' dùng trợ động từ 'doesn't' trong câu phủ định."
    },
    {
      question: "What time ______ they get up in the morning?",
      options: ["do", "does", "are", "is"],
      answer: "do",
      hint: "Đặt câu hỏi với chủ ngữ 'they' dùng trợ động từ 'do'."
    },
    {
      question: "We ______ milk every morning.",
      options: ["drink", "drinks", "drinking", "drank"],
      answer: "drink",
      hint: "Chủ ngữ số nhiều 'We' dùng động từ nguyên mẫu ở hiện tại đơn."
    },
    {
      question: "Where ______ she live? - In Hải Phòng.",
      options: ["does", "do", "is", "are"],
      answer: "does",
      hint: "Đặt câu hỏi với chủ ngữ số ít 'she' dùng trợ động từ 'does'."
    },
    {
      question: "Water ______ at 100 degrees Celsius.",
      options: ["boils", "boil", "boiling", "boiled"],
      answer: "boils",
      hint: "Sự thật hiển nhiên: danh từ không đếm được 'Water' dùng động từ số ít 'boils'."
    },
    {
      question: "I ______ my homework before dinner.",
      options: ["usually do", "usually does", "do usually", "does usually"],
      answer: "usually do",
      hint: "Trạng từ chỉ tần suất 'usually' đứng trước động từ thường 'do' (I usually do)."
    }
  ],
  12: [
    {
      question: "Look! The children ______ football in the park.",
      options: ["are playing", "is playing", "play", "playing"],
      answer: "are playing",
      hint: "Look! chỉ hành động đang diễn ra, 'The children' số nhiều dùng 'are playing'."
    },
    {
      question: "Listen! She ______ a beautiful song.",
      options: ["is singing", "are singing", "sing", "sings"],
      answer: "is singing",
      hint: "Listen! chỉ hành động đang diễn ra, 'She' số ít dùng 'is singing'."
    },
    {
      question: "I ______ studying English at the moment.",
      options: ["am", "is", "are", "be"],
      answer: "am",
      hint: "Hiện tại tiếp diễn với chủ ngữ 'I' dùng động từ to be 'am'."
    },
    {
      question: "They ______ watching TV right now. They are sleeping.",
      options: ["aren't", "isn't", "don't", "not"],
      answer: "aren't",
      hint: "Phủ định của tiếp diễn với chủ ngữ số nhiều 'They' dùng 'aren't'."
    },
    {
      question: "______ you doing your homework now?",
      options: ["Are", "Is", "Am", "Do"],
      answer: "Are",
      hint: "Câu hỏi tiếp diễn với chủ ngữ 'you' dùng động từ to be 'Are'."
    },
    {
      question: "What ______ she cooking in the kitchen?",
      options: ["is", "are", "am", "does"],
      answer: "is",
      hint: "Câu hỏi tiếp diễn with chủ ngữ số ít 'she' dùng động từ to be 'is'."
    },
    {
      question: "My kitten ______ with a toy mouse now.",
      options: ["is playing", "are playing", "plays", "playing"],
      answer: "is playing",
      hint: "'My kitten' số ít, dùng cấu trúc tiếp diễn 'is playing'."
    },
    {
      question: "We ______ not going to the zoo today.",
      options: ["are", "is", "am", "do"],
      answer: "are",
      hint: "Phủ định tiếp diễn số nhiều: We are not going."
    },
    {
      question: "Why ______ they running so fast?",
      options: ["are", "is", "does", "do"],
      answer: "are",
      hint: "Câu hỏi tiếp diễn với chủ ngữ 'they' dùng 'are'."
    },
    {
      question: "He ______ writing an essay at the moment.",
      options: ["is", "are", "am", "be"],
      answer: "is",
      hint: "Chủ ngữ số ít 'He' đi kèm to be 'is' trong thì tiếp diễn."
    }
  ],
  13: [
    {
      question: "Every Sunday, I play tennis, but today I ______ my room.",
      options: ["am cleaning", "clean", "cleans", "is cleaning"],
      answer: "am cleaning",
      hint: "Vế đầu nói về thói quen (Simple), vế sau chỉ hành động hôm nay (Continuous) dùng 'am cleaning'."
    },
    {
      question: "Listen! Someone ______ at the door.",
      options: ["is knocking", "knocks", "knock", "are knocking"],
      answer: "is knocking",
      hint: "Hành động đang diễn ra tại thời điểm nói ('Listen!') dùng tiếp diễn."
    },
    {
      question: "I ______ a big cup of milk every morning.",
      options: ["drink", "am drinking", "drinks", "drank"],
      answer: "drink",
      hint: "Thói quen hàng ngày ('every morning') dùng hiện tại đơn."
    },
    {
      question: "She ______ to become an English teacher.",
      options: ["wants", "is wanting", "want", "wants to"],
      answer: "wants",
      hint: "'Want' là động từ trạng thái chỉ ý muốn, không dùng ở dạng tiếp diễn."
    },
    {
      question: "He usually watches TV, but right now he ______ a book.",
      options: ["is reading", "reads", "read", "is reading"],
      answer: "is reading",
      hint: "Hành động đang diễn ra ngay lúc này ('right now') dùng tiếp diễn."
    },
    {
      question: "My sister ______ chocolate cake very much.",
      options: ["likes", "is liking", "like", "liking"],
      answer: "likes",
      hint: "Động từ cảm xúc 'like' là động từ trạng thái, ta dùng hiện tại đơn."
    },
    {
      question: "Where ______ you usually go on Saturdays?",
      options: ["do", "are", "does", "did"],
      answer: "do",
      hint: "Hỏi về thói quen có trạng từ 'usually' dùng trợ động từ hiện tại đơn 'do'."
    },
    {
      question: "Look! Toby ______ his bicycle in the garden.",
      options: ["is riding", "rides", "ride", "riding"],
      answer: "is riding",
      hint: "'Look!' báo hiệu hành động đang diễn ra trước mắt dùng tiếp diễn."
    },
    {
      question: "I ______ the answer to this question.",
      options: ["know", "am knowing", "knows", "knowed"],
      answer: "know",
      hint: "'Know' (biết) là động từ trạng thái chỉ nhận thức, dùng hiện tại đơn."
    },
    {
      question: "They ______ video games at the moment.",
      options: ["are playing", "play", "plays", "playing"],
      answer: "are playing",
      hint: "Dấu hiệu 'at the moment' yêu cầu dùng hiện tại tiếp diễn."
    }
  ],
  14: [
    {
      question: "I ______ at school yesterday.",
      options: ["was", "were", "am", "been"],
      answer: "was",
      hint: "Chủ ngữ 'I' đi với động từ to be quá khứ là 'was'."
    },
    {
      question: "They ______ very happy at the picnic last Sunday.",
      options: ["were", "was", "are", "been"],
      answer: "were",
      hint: "Chủ ngữ số nhiều 'They' đi với to be quá khứ 'were'."
    },
    {
      question: "______ she sick last night?",
      options: ["Was", "Were", "Is", "Did"],
      answer: "Was",
      hint: "Chủ ngữ số ít 'she', câu hỏi to be quá khứ dùng 'Was'."
    },
    {
      question: "We ______ in Hanoi last year. We were in Hải Phòng.",
      options: ["weren't", "wasn't", "aren't", "didn't"],
      answer: "weren't",
      hint: "Phủ định số nhiều của to be quá khứ dùng 'weren't'."
    },
    {
      question: "Where ______ you yesterday afternoon?",
      options: ["were", "was", "are", "did"],
      answer: "were",
      hint: "Chủ ngữ 'you' đi với to be quá khứ 'were'."
    },
    {
      question: "The weather ______ very cold last winter.",
      options: ["was", "were", "is", "been"],
      answer: "was",
      hint: "'The weather' là số ít không đếm được dùng to be quá khứ 'was'."
    },
    {
      question: "______ they at the zoo yesterday? - No, they weren't.",
      options: ["Were", "Was", "Are", "Did"],
      answer: "Were",
      hint: "Chủ ngữ số nhiều 'they' dùng 'Were' ở câu hỏi quá khứ."
    },
    {
      question: "He ______ at home yesterday. He was in the park.",
      options: ["wasn't", "weren't", "isn't", "didn't"],
      answer: "wasn't",
      hint: "Phủ định số ít của to be quá khứ dùng 'wasn't'."
    },
    {
      question: "My friends ______ at the birthday party last night.",
      options: ["were", "was", "are", "been"],
      answer: "were",
      hint: "'My friends' số nhiều dùng to be quá khứ 'were'."
    },
    {
      question: "Was it a good movie? - Yes, it ______.",
      options: ["was", "were", "is", "did"],
      answer: "was",
      hint: "Trả lời ngắn quá khứ với chủ ngữ 'it' dùng 'Yes, it was'."
    }
  ],
  15: [
    {
      question: "Yesterday evening, I ______ a cartoon on TV.",
      options: ["watched", "watch", "watching", "watches"],
      answer: "watched",
      hint: "Động từ có quy tắc 'watch' thêm đuôi -ed ở quá khứ đơn."
    },
    {
      question: "They ______ to the zoo last Sunday.",
      options: ["went", "go", "going", "goed"],
      answer: "went",
      hint: "Động từ bất quy tắc của 'go' ở quá khứ đơn là 'went'."
    },
    {
      question: "He ______ buy the new toy car yesterday.",
      options: ["didn't", "don't", "doesn't", "wasn't"],
      answer: "didn't",
      hint: "Phủ định quá khứ dùng trợ động từ 'didn't + động từ nguyên mẫu'."
    },
    {
      question: "______ you eat pizza last night?",
      options: ["Did", "Do", "Were", "Was"],
      answer: "Did",
      hint: "Câu hỏi quá khứ với động từ hành động dùng trợ động từ 'Did'."
    },
    {
      question: "She ______ a tasty cake for my birthday last week.",
      options: ["made", "make", "makes", "making"],
      answer: "made",
      hint: "Động từ bất quy tắc 'make' đổi thành 'made' ở quá khứ."
    },
    {
      question: "They ______ soccer in the school yard yesterday.",
      options: ["played", "play", "playing", "plays"],
      answer: "played",
      hint: "Động từ 'play' có quy tắc, thêm -ed."
    },
    {
      question: "I ______ a nice book in the shop two days ago.",
      options: ["bought", "buy", "buying", "buys"],
      answer: "bought",
      hint: "Động từ bất quy tắc 'buy' đổi thành 'bought' ở quá khứ."
    },
    {
      question: "Did he pass the test? - Yes, he ______.",
      options: ["did", "passed", "was", "does"],
      answer: "did",
      hint: "Câu trả lời ngắn quá khứ: Yes, S + did."
    },
    {
      question: "We ______ not see the movie yesterday.",
      options: ["did", "do", "were", "was"],
      answer: "did",
      hint: "Chúng tôi không thấy: We did not see."
    },
    {
      question: "She ______ her homework quickly last night.",
      options: ["did", "do", "does", "done"],
      answer: "did",
      hint: "Động từ bất quy tắc 'do' đổi thành 'did' ở quá khứ."
    }
  ],
  16: [
    {
      question: "______ is that boy standing by the door? - He is Nick.",
      options: ["Who", "Whose", "What", "Which"],
      answer: "Who",
      hint: "Hỏi về danh tính một người dùng từ để hỏi 'Who'."
    },
    {
      question: "______ book is this on the floor? - It's Lily's.",
      options: ["Whose", "Who", "What", "Which"],
      answer: "Whose",
      hint: "Hỏi về chủ sở hữu (của ai) đi kèm trực tiếp danh từ dùng 'Whose'."
    },
    {
      question: "______ are you doing now? - I am studying.",
      options: ["What", "Who", "Whose", "Which"],
      answer: "What",
      hint: "Hỏi về sự vật, hoạt động đang làm dùng 'What'."
    },
    {
      question: "______ made this delicious cake? - My mother.",
      options: ["Who", "Whose", "What", "Where"],
      answer: "Who",
      hint: "Hỏi về chủ thể là người thực hiện hành động dùng 'Who'."
    },
    {
      question: "______ is in your schoolbag? - Some books.",
      options: ["What", "Who", "Whose", "Where"],
      answer: "What",
      hint: "Hỏi vật gì bên trong cặp dùng 'What'."
    },
    {
      question: "______ crayons are these? - They are Toby's.",
      options: ["Whose", "Who", "What", "Which"],
      answer: "Whose",
      hint: "Hỏi bút màu của ai dùng 'Whose'."
    },
    {
      question: "______ is your English teacher? - Miss Linh.",
      options: ["Who", "Whose", "What", "When"],
      answer: "Who",
      hint: "Hỏi giáo viên là ai dùng 'Who'."
    },
    {
      question: "______ time is it? - It is 8 o'clock.",
      options: ["What", "Who", "Whose", "Which"],
      answer: "What",
      hint: "Hỏi giờ giấc dùng cụm từ 'What time'."
    },
    {
      question: "______ toy did you buy? - A model plane.",
      options: ["What", "Who", "Whose", "Where"],
      answer: "What",
      hint: "Hỏi bạn đã mua đồ chơi gì dùng 'What'."
    },
    {
      question: "______ pencil case is that? - It is mine.",
      options: ["Whose", "Who", "What", "Which"],
      answer: "Whose",
      hint: "Hỏi hộp bút của ai dùng 'Whose'."
    }
  ],
  17: [
    {
      question: "______ do you live? - In Hải Phòng.",
      options: ["Where", "When", "Why", "How"],
      answer: "Where",
      hint: "Hỏi về nơi chốn, địa điểm dùng 'Where'."
    },
    {
      question: "______ is your birthday? - It is in June.",
      options: ["When", "Where", "Why", "How"],
      answer: "When",
      hint: "Hỏi về thời gian, thời điểm dùng 'When'."
    },
    {
      question: "______ are you crying? - Because I lost my toy.",
      options: ["Why", "Where", "When", "How"],
      answer: "Why",
      hint: "Câu hỏi nguyên nhân trả lời bằng 'Because' bắt đầu bằng 'Why'."
    },
    {
      question: "______ do you go to school? - By bus.",
      options: ["How", "Where", "When", "Why"],
      answer: "How",
      hint: "Hỏi về cách thức, phương tiện đi lại dùng 'How'."
    },
    {
      question: "______ did you go last Sunday? - To the beach.",
      options: ["Where", "When", "Why", "How"],
      answer: "Where",
      hint: "Hỏi về địa điểm đã đi dùng 'Where'."
    },
    {
      question: "______ does the class start? - At 8 o'clock.",
      options: ["When", "Where", "Why", "How"],
      answer: "When",
      hint: "Hỏi về thời điểm bắt đầu dùng 'When'."
    },
    {
      question: "______ old are you? - I am ten years old.",
      options: ["How", "Why", "What", "Where"],
      answer: "How",
      hint: "Hỏi tuổi dùng cấu trúc 'How old'."
    },
    {
      question: "______ are you happy? - Because I got a good mark.",
      options: ["Why", "Where", "When", "How"],
      answer: "Why",
      hint: "Hỏi về lý do tại sao vui dùng 'Why'."
    },
    {
      question: "______ does she feel today? - She feels great.",
      options: ["How", "Where", "When", "Why"],
      answer: "How",
      hint: "Hỏi về tình trạng sức khỏe, cảm xúc dùng 'How'."
    },
    {
      question: "______ did they buy this house? - Last year.",
      options: ["When", "Where", "Why", "How"],
      answer: "When",
      hint: "Hỏi mốc thời gian quá khứ dùng 'When'."
    }
  ],
  18: [
    {
      question: "______ apples did you buy? - Five apples.",
      options: ["How many", "How much", "How", "What"],
      answer: "How many",
      hint: "Apples là danh từ số nhiều đếm được, dùng 'How many' để hỏi số lượng."
    },
    {
      question: "______ is this red cap? - It's 10 dollars.",
      options: ["How much", "How many", "What price", "How"],
      answer: "How much",
      hint: "Hỏi về giá tiền dùng 'How much + is/are'."
    },
    {
      question: "______ water is left in the bottle?",
      options: ["How much", "How many", "How", "What"],
      answer: "How much",
      hint: "'Water' là danh từ không đếm được, dùng 'How much' để hỏi lượng."
    },
    {
      question: "______ students are there in the class? - Twenty.",
      options: ["How many", "How much", "How", "Who"],
      answer: "How many",
      hint: "'Students' đếm được số nhiều dùng 'How many'."
    },
    {
      question: "______ milk do you drink every day?",
      options: ["How much", "How many", "How", "What"],
      answer: "How much",
      hint: "'Milk' không đếm được dùng 'How much'."
    },
    {
      question: "______ are those shoes? - They are 50 dollars.",
      options: ["How much", "How many", "What", "How"],
      answer: "How much",
      hint: "Hỏi giá tiền của đôi giày dùng 'How much'."
    },
    {
      question: "______ pages does this book have?",
      options: ["How many", "How much", "How", "Which"],
      answer: "How many",
      hint: "'Pages' số nhiều đếm được dùng 'How many'."
    },
    {
      question: "______ sugar do you need for the cake?",
      options: ["How much", "How many", "How", "What"],
      answer: "How much",
      hint: "'Sugar' không đếm được dùng 'How much'."
    },
    {
      question: "______ oranges are in the basket?",
      options: ["How many", "How much", "Which", "What"],
      answer: "How many",
      hint: "'Oranges' số nhiều dùng 'How many'."
    },
    {
      question: "______ is the chocolate bar? - It's 2 dollars.",
      options: ["How much", "How many", "How", "What"],
      answer: "How much",
      hint: "Hỏi giá của thanh sô-cô-la dùng 'How much'."
    }
  ],
  19: [
    {
      question: "When he was five, he ______ ride a bicycle.",
      options: ["could", "can", "is able", "could to"],
      answer: "could",
      hint: "Khả năng trong quá khứ ('When he was five') dùng 'could'."
    },
    {
      question: "Now, I ______ speak English fluently.",
      options: ["can", "could", "am", "can to"],
      answer: "can",
      hint: "Khả năng ở hiện tại ('Now') dùng 'can'."
    },
    {
      question: "Excuse me, ______ I borrow your pencil, please?",
      options: ["Could", "Must", "Should", "Would"],
      answer: "Could",
      hint: "Lời xin phép lịch sự dùng 'Could I...?'."
    },
    {
      question: "She ______ swim when she was young, but now she can.",
      options: ["couldn't", "can't", "wasn't", "didn't"],
      answer: "couldn't",
      hint: "Phủ định khả năng quá khứ dùng 'couldn't'."
    },
    {
      question: "They ______ speak French. They only speak English.",
      options: ["can't", "couldn't", "don't", "isn't"],
      answer: "can't",
      hint: "Phủ định khả năng hiện tại dùng 'can't'."
    },
    {
      question: "______ you swim fast when you were ten?",
      options: ["Could", "Can", "Did", "Were"],
      answer: "Could",
      hint: "Hỏi về khả năng trong quá khứ dùng 'Could'."
    },
    {
      question: "My grandmother is eighty, but she ______ still read well.",
      options: ["can", "could", "is", "does"],
      answer: "can",
      hint: "Khả năng ở hiện tại dùng 'can'."
    },
    {
      question: "He ______ drive a car because he is only ten years old.",
      options: ["can't", "couldn't", "isn't", "mustn't"],
      answer: "can't",
      hint: "Không thể ở hiện tại dùng 'can't'."
    },
    {
      question: "______ I have a glass of water, please?",
      options: ["Can", "Must", "Should", "Shall"],
      answer: "Can",
      hint: "Đưa ra lời yêu cầu lịch sự dùng 'Can I...?'."
    },
    {
      question: "She ______ run very fast last year because of her broken leg.",
      options: ["couldn't", "can't", "didn't", "wasn't"],
      answer: "couldn't",
      hint: "Không thể trong quá khứ dùng 'couldn't'."
    }
  ],
  20: [
    {
      question: "You ______ run inside the library. It is a strict rule.",
      options: ["mustn't", "don't have to", "shouldn't", "can't"],
      answer: "mustn't",
      hint: "Sự cấm đoán nghiêm ngặt (nội quy) dùng 'mustn't'."
    },
    {
      question: "Tomorrow is Sunday, so I ______ get up early.",
      options: ["don't have to", "mustn't", "shouldn't", "haven't to"],
      answer: "don't have to",
      hint: "Không cần thiết phải làm gì đó dùng 'don't have to'."
    },
    {
      question: "It is late. We ______ do our homework now.",
      options: ["must", "shall", "don't have to", "are"],
      answer: "must",
      hint: "Sự bắt buộc, nghĩa vụ cần thiết làm ngay dùng 'must'."
    },
    {
      question: "______ I carry this heavy bag for you? - Yes, please.",
      options: ["Shall", "Must", "Have to", "Will"],
      answer: "Shall",
      hint: "Lời đề nghị giúp đỡ lịch sự cho ngôi thứ nhất dùng 'Shall I...?'."
    },
    {
      question: "Students ______ wear uniforms at school every day.",
      options: ["have to", "mustn't", "don't have to", "shall"],
      answer: "have to",
      hint: "Bắt buộc do nội quy khách quan trường học dùng 'have to'."
    },
    {
      question: "______ we go to the park this afternoon? - Yes, let's.",
      options: ["Shall", "Must", "Have to", "Should"],
      answer: "Shall",
      hint: "Lời đề xuất rủ cùng làm gì dùng 'Shall we...?'."
    },
    {
      question: "You ______ touch that dog! It is wild and dangerous.",
      options: ["mustn't", "don't have to", "should", "shall"],
      answer: "mustn't",
      hint: "Cấm chạm vào vì nguy hiểm dùng 'mustn't'."
    },
    {
      question: "I ______ clean my room today. My mother told me to do it.",
      options: ["must", "shall", "don't have to", "mustn't"],
      answer: "must",
      hint: "Bắt buộc mang tính chủ quan hoặc từ gia đình dùng 'must'."
    },
    {
      question: "She ______ do the washing today because her sister did it.",
      options: ["doesn't have to", "mustn't", "don't have to", "hasn't to"],
      answer: "doesn't have to",
      hint: "Không cần thiết cho ngôi thứ ba số ít dùng 'doesn't have to'."
    },
    {
      question: "______ I open the door for you?",
      options: ["Shall", "Must", "Have to", "Will"],
      answer: "Shall",
      hint: "Lời đề nghị giúp đỡ dùng 'Shall I'."
    }
  ],
  21: [
    {
      question: "My birthday is ______ June.",
      options: ["in", "on", "at", "to"],
      answer: "in",
      hint: "Dùng giới từ 'in' trước tháng."
    },
    {
      question: "We have an English class ______ Mondays.",
      options: ["on", "in", "at", "for"],
      answer: "on",
      hint: "Dùng giới từ 'on' trước ngày thứ trong tuần."
    },
    {
      question: "I usually get up ______ 7 o'clock.",
      options: ["at", "in", "on", "to"],
      answer: "at",
      hint: "Dùng giới từ 'at' trước mốc giờ giấc cụ thể."
    },
    {
      question: "The book is ______ the table in my room.",
      options: ["on", "in", "at", "under"],
      answer: "on",
      hint: "Sách nằm trên mặt bàn dùng giới từ 'on'."
    },
    {
      question: "The dog is sleeping ______ the table.",
      options: ["under", "at", "on", "in"],
      answer: "under",
      hint: "Chó nằm ngủ ở phía dưới gầm bàn dùng 'under'."
    },
    {
      question: "Toby sits ______ Elsa in the classroom. They are next to each other.",
      options: ["next to", "in", "on", "between"],
      answer: "next to",
      hint: "Bên cạnh ai dùng cụm giới từ 'next to'."
    },
    {
      question: "The ball is ______ the two boxes.",
      options: ["between", "next to", "under", "in front of"],
      answer: "between",
      hint: "Ở giữa hai vật dùng giới từ 'between'."
    },
    {
      question: "He was born ______ 2016.",
      options: ["in", "on", "at", "by"],
      answer: "in",
      hint: "Dùng 'in' trước năm."
    },
    {
      question: "There is a beautiful tree ______ our house.",
      options: ["in front of", "at", "between", "on"],
      answer: "in front of",
      hint: "Ở phía trước nhà dùng cụm giới từ 'in front of'."
    },
    {
      question: "I am staying ______ home today.",
      options: ["at", "in", "on", "to"],
      answer: "at",
      hint: "Ở nhà dùng cụm cố định 'at home'."
    }
  ],
  22: [
    {
      question: "My mother gave ______ a beautiful book.",
      options: ["me", "to me", "for me", "my"],
      answer: "me",
      hint: "Cấu trúc: give + IO (tân ngữ chỉ người) + DO. Ta dùng trực tiếp 'me'."
    },
    {
      question: "She bought a new toy ______ her little brother.",
      options: ["for", "to", "with", "at"],
      answer: "for",
      hint: "Cấu trúc: buy something for someone. Mua cho ai dùng 'for'."
    },
    {
      question: "He sent a nice postcard ______ his teacher.",
      options: ["to", "for", "with", "at"],
      answer: "to",
      hint: "Cấu trúc: send something to someone. Gửi tới ai dùng 'to'."
    },
    {
      question: "Can you pass ______ the salt, please?",
      options: ["me", "to me", "for me", "I"],
      answer: "me",
      hint: "Cấu trúc: pass someone something. Chuyền cho ai dùng 'me'."
    },
    {
      question: "I made a colorful card ______ my best friend.",
      options: ["for", "to", "with", "in"],
      answer: "for",
      hint: "Cấu trúc: make something for someone. Làm gì cho ai dùng 'for'."
    },
    {
      question: "Show ______ your new drawings, please.",
      options: ["us", "to us", "for us", "our"],
      answer: "us",
      hint: "Cấu trúc: show + IO + DO. Cho chúng tôi xem dùng trực tiếp 'us'."
    },
    {
      question: "He lent his bicycle ______ Nick yesterday.",
      options: ["to", "for", "with", "by"],
      answer: "to",
      hint: "Cấu trúc: lend something to someone. Cho ai mượn dùng 'to'."
    },
    {
      question: "My dad cooked a delicious soup ______ my family.",
      options: ["for", "to", "at", "with"],
      answer: "for",
      hint: "Cấu trúc: cook something for someone. Nấu ăn cho ai dùng 'for'."
    },
    {
      question: "She gave the keys ______ her father.",
      options: ["to", "for", "at", "by"],
      answer: "to",
      hint: "Cấu trúc: give something to someone. Đưa cho ai dùng 'to'."
    },
    {
      question: "Toby bought a sweet donut ______ Bill.",
      options: ["for", "to", "with", "at"],
      answer: "for",
      hint: "Cấu trúc: buy something for someone. Mua bánh cho ai dùng 'for'."
    }
  ],
  23: [
    {
      question: "This is the boy ______ sat next to me yesterday.",
      options: ["who", "which", "whose", "whom"],
      answer: "who",
      hint: "Bổ nghĩa cho danh từ chỉ người 'the boy' đóng vai trò chủ ngữ dùng 'who'."
    },
    {
      question: "I like the book ______ you bought for me.",
      options: ["which", "who", "whose", "where"],
      answer: "which",
      hint: "Bổ nghĩa cho danh từ chỉ vật 'the book' dùng 'which'."
    },
    {
      question: "That is the girl ______ cat was lost in the park.",
      options: ["whose", "who", "which", "whom"],
      answer: "whose",
      hint: "Chỉ sở hữu (con mèo của cô bé) dùng 'whose' đứng trước danh từ."
    },
    {
      question: "The teacher ______ teaches us English is Miss Linh.",
      options: ["who", "which", "whose", "where"],
      answer: "who",
      hint: "Bổ nghĩa cho danh từ chỉ người 'The teacher' dùng 'who'."
    },
    {
      question: "The toy ______ is on the table is broken.",
      options: ["which", "who", "whose", "what"],
      answer: "which",
      hint: "Bổ nghĩa cho danh từ chỉ vật 'The toy' dùng 'which'."
    },
    {
      question: "This is the man ______ dog barked at me.",
      options: ["whose", "who", "which", "whom"],
      answer: "whose",
      hint: "Chỉ sở hữu (con chó của người đàn ông) dùng 'whose'."
    },
    {
      question: "I know a girl ______ can speak three languages.",
      options: ["who", "which", "whose", "where"],
      answer: "who",
      hint: "Thay thế cho danh từ chỉ người 'a girl' dùng 'who'."
    },
    {
      question: "The cake ______ Elsa made was delicious.",
      options: ["which", "who", "whose", "what"],
      answer: "which",
      hint: "Thay thế cho vật 'The cake' dùng 'which'."
    },
    {
      question: "He is the student ______ parents are doctors.",
      options: ["whose", "who", "which", "whom"],
      answer: "whose",
      hint: "Chỉ sở hữu (bố mẹ của học sinh) dùng 'whose'."
    },
    {
      question: "This is the school bag ______ my mother bought yesterday.",
      options: ["which", "who", "whose", "where"],
      answer: "which",
      hint: "Thay thế cho vật 'school bag' dùng 'which'."
    }
  ],
  24: [
    {
      question: "I go to LeeGo Center ______ English grammar.",
      options: ["to learn", "learning", "for learn", "learn"],
      answer: "to learn",
      hint: "Dùng 'to + V-base' để chỉ mục đích (để học)."
    },
    {
      question: "She went to the market ______ some fresh fruit.",
      options: ["to buy", "buying", "for buy", "bought"],
      answer: "to buy",
      hint: "Chỉ mục đích đi chợ để mua dùng 'to buy'."
    },
    {
      question: "He opened the window ______ some fresh air in.",
      options: ["to let", "letting", "for let", "let"],
      answer: "to let",
      hint: "Chỉ mục đích để cho không khí vào dùng 'to let'."
    },
    {
      question: "We study hard ______ our English exam.",
      options: ["to pass", "passing", "for pass", "pass"],
      answer: "to pass",
      hint: "Chỉ mục đích để vượt qua kì thi dùng 'to pass'."
    },
    {
      question: "She called her mother ______ she was okay.",
      options: ["to say", "saying", "for say", "said"],
      answer: "to say",
      hint: "Chỉ mục đích gọi điện để nói dùng 'to say'."
    },
    {
      question: "They went to the kitchen ______ a glass of water.",
      options: ["to get", "getting", "for get", "get"],
      answer: "to get",
      hint: "Chỉ mục đích đi xuống bếp để lấy nước dùng 'to get'."
    },
    {
      question: "I read books ______ my vocabulary.",
      options: ["to improve", "improving", "for improve", "improve"],
      answer: "to improve",
      hint: "Chỉ mục đích đọc sách để cải thiện dùng 'to improve'."
    },
    {
      question: "He ran quickly ______ the school bus.",
      options: ["to catch", "catching", "for catch", "catch"],
      answer: "to catch",
      hint: "Chỉ mục đích chạy để bắt kịp xe buýt dùng 'to catch'."
    },
    {
      question: "She saved money ______ a new computer.",
      options: ["to buy", "buying", "for buy", "bought"],
      answer: "to buy",
      hint: "Chỉ mục đích để mua máy tính dùng 'to buy'."
    },
    {
      question: "We use crayons ______ our pictures.",
      options: ["to color", "coloring", "for color", "color"],
      answer: "to color",
      hint: "Chỉ mục đích dùng sáp màu để tô màu dùng 'to color'."
    }
  ],
  25: [
    {
      question: "I like apples ______ I don't like bananas.",
      options: ["but", "and", "or", "because"],
      answer: "but",
      hint: "Diễn tả hai mệnh đề có ý tương phản dùng từ nối 'but'."
    },
    {
      question: "She went to bed early ______ she was very tired.",
      options: ["because", "but", "and", "or"],
      answer: "because",
      hint: "Mệnh đề chỉ nguyên nhân (vì mệt nên ngủ sớm) dùng từ nối 'because'."
    },
    {
      question: "Would you like to drink milk ______ orange juice?",
      options: ["or", "but", "and", "because"],
      answer: "or",
      hint: "Chỉ sự lựa chọn giữa hai đồ uống dùng 'or'."
    },
    {
      question: "He is smart ______ friendly to everyone.",
      options: ["and", "but", "or", "because"],
      answer: "and",
      hint: "Bổ sung thêm thông tin cùng chiều dùng từ nối 'and'."
    },
    {
      question: "I wanted to play soccer ______ it started to rain.",
      options: ["but", "and", "or", "because"],
      answer: "but",
      hint: "Ý tương phản diễn tả sự việc cản trở dùng 'but'."
    },
    {
      question: "She stays at home ______ she is sick today.",
      options: ["because", "but", "and", "or"],
      answer: "because",
      hint: "Giải thích nguyên nhân tại sao ở nhà dùng 'because'."
    },
    {
      question: "You can choose the red balloon ______ the blue one.",
      options: ["or", "but", "and", "because"],
      answer: "or",
      hint: "Chọn lựa giữa hai quả bóng dùng 'or'."
    },
    {
      question: "We went to the park ______ had a picnic.",
      options: ["and", "but", "or", "because"],
      answer: "and",
      hint: "Nối tiếp hai hành động liên tục dùng 'and'."
    },
    {
      question: "He studied hard ______ he wanted to pass the test.",
      options: ["because", "but", "and", "or"],
      answer: "because",
      hint: "Chỉ lý do nguyên nhân dùng 'because'."
    },
    {
      question: "This book is interesting ______ it is very long.",
      options: ["but", "and", "or", "because"],
      answer: "but",
      hint: "Ý tương phản dùng 'but'."
    }
  ],
  26: [
    {
      question: "______ I arrive home, I always take off my shoes.",
      options: ["When", "Because", "But", "Or"],
      answer: "When",
      hint: "Diễn tả thời điểm hành động xảy ra (Khi về nhà) dùng liên từ thời gian 'When'."
    },
    {
      question: "I feel very happy ______ I play with my dog.",
      options: ["when", "because", "but", "or"],
      answer: "when",
      hint: "Mệnh đề chỉ thời gian ở vế sau dùng liên từ 'when'."
    },
    {
      question: "When the rain stopped ______ the children ran outside.",
      options: [",", ";", "and", "but"],
      answer: ",",
      hint: "Khi mệnh đề 'When' đứng ở đầu câu, ta ngăn cách hai mệnh đề bằng dấu phẩy."
    },
    {
      question: "She always smiles when she ______ her mother.",
      options: ["sees", "see", "seeing", "saw"],
      answer: "sees",
      hint: "Thói quen hiện tại, mệnh đề 'when' chia theo chủ ngữ số ít 'she' là 'sees'."
    },
    {
      question: "When we were at the beach ______ we swam for two hours.",
      options: [",", "and", "but", "so"],
      answer: ",",
      hint: "Mệnh đề 'When' quá khứ đứng đầu câu dùng dấu phẩy ngăn cách."
    },
    {
      question: "My dog barks when someone ______ near our gate.",
      options: ["comes", "come", "coming", "came"],
      answer: "comes",
      hint: "Mệnh đề 'when' hiện tại số ít dùng động từ thêm 's': 'comes'."
    },
    {
      question: "When he ______ ten, he could speak three languages.",
      options: ["was", "were", "is", "been"],
      answer: "was",
      hint: "Mệnh đề chỉ mốc thời gian quá khứ với chủ ngữ 'he' dùng 'was'."
    },
    {
      question: "I will call you when I ______ my homework.",
      options: ["finish", "finishes", "finishing", "finished"],
      answer: "finish",
      hint: "Mệnh đề 'when' chỉ tương lai dùng thì hiện tại đơn: 'finish'."
    },
    {
      question: "We were sleeping when the phone ______.",
      options: ["rang", "ring", "rings", "ringing"],
      answer: "rang",
      hint: "Hành động xen ngang trong quá khứ dùng thì quá khứ đơn 'rang'."
    },
    {
      question: "When you ______ the street, look both ways.",
      options: ["cross", "crosses", "crossing", "crossed"],
      answer: "cross",
      hint: "Khi bạn qua đường: When you cross."
    }
  ],
  27: [
    {
      question: "Lucy is ______ than her brother.",
      options: ["taller", "tallest", "the taller", "the tallest"],
      answer: "taller",
      hint: "So sánh hơn giữa hai người dùng đuôi tính từ ngắn thêm -er đi kèm 'than'."
    },
    {
      question: "This elephant is the ______ animal in the forest.",
      options: ["heaviest", "heavier", "heavy", "heaviest than"],
      answer: "heaviest",
      hint: "So sánh nhất của danh từ đuôi -y chuyển thành -iest đi kèm 'the'."
    },
    {
      question: "A horse is ______ than a dog.",
      options: ["bigger", "biggest", "the bigger", "big"],
      answer: "bigger",
      hint: "So sánh hơn tính từ ngắn 'big' gấp đôi chữ g: 'bigger'."
    },
    {
      question: "Who is the ______ student in your class?",
      options: ["tallest", "taller", "tall", "taller than"],
      answer: "tallest",
      hint: "So sánh nhất trong tập thể dùng 'the + Adj-est'."
    },
    {
      question: "My sister is ______ than me. (happy)",
      options: ["happier", "happiest", "happyer", "the happiest"],
      answer: "happier",
      hint: "Tính từ kết thúc là -y đổi thành -ier trong so sánh hơn: 'happier'."
    },
    {
      question: "This toy car is the ______ of all.",
      options: ["smallest", "smaller", "small", "the smaller"],
      answer: "smallest",
      hint: "So sánh nhất của 'small' là 'the smallest'."
    },
    {
      question: "Gold is ______ than silver.",
      options: ["more expensive", "expensive", "expensiver", "the most expensive"],
      answer: "more expensive",
      hint: "Tính từ dài 'expensive' dùng 'more + Adj + than' trong so sánh hơn."
    },
    {
      question: "What is the ______ subject at school?",
      options: ["most difficult", "difficultest", "more difficult", "difficult"],
      answer: "most difficult",
      hint: "So sánh nhất tính từ dài dùng 'the most + Adj'."
    },
    {
      question: "A cheetah runs ______ than a horse.",
      options: ["faster", "fastest", "more fast", "fast"],
      answer: "faster",
      hint: "So sánh hơn của 'fast' là 'faster'."
    },
    {
      question: "This is the ______ movie I have ever seen.",
      options: ["best", "better", "goodest", "good"],
      answer: "best",
      hint: "So sánh nhất bất quy tắc của 'good' là 'best'."
    }
  ],
  28: [
    {
      question: "She ran ______ to catch the school bus.",
      options: ["quickly", "quick", "quickest", "more quick"],
      answer: "quickly",
      hint: "Bổ nghĩa cho động từ 'ran' dùng trạng từ chỉ cách thức 'quickly'."
    },
    {
      question: "The old man walked ______ through the park.",
      options: ["slowly", "slow", "slowest", "more slow"],
      answer: "slowly",
      hint: "Bổ nghĩa cho động từ 'walked' dùng trạng từ chỉ cách thức 'slowly'."
    },
    {
      question: "He speaks English very ______.",
      options: ["well", "good", "goodly", "best"],
      answer: "well",
      hint: "Trạng từ bất quy tắc của tính từ 'good' là 'well' để bổ nghĩa cho động từ thường."
    },
    {
      question: "Students should study ______ to get good marks.",
      options: ["hard", "hardly", "harder", "hardest"],
      answer: "hard",
      hint: "Trạng từ của 'hard' giữ nguyên là 'hard' để chỉ sự chăm chỉ."
    },
    {
      question: "The children played ______ in the garden.",
      options: ["happily", "happy", "happiest", "happyly"],
      answer: "happily",
      hint: "Trạng từ của tính từ 'happy' là 'happily' (y đổi thành i rồi thêm ly)."
    },
    {
      question: "He drives his car ______ in the street.",
      options: ["safely", "safe", "safest", "safelyer"],
      answer: "safely",
      hint: "Bổ nghĩa cho động từ 'drives' dùng trạng từ 'safely'."
    },
    {
      question: "She is a quiet girl. She speaks very ______.",
      options: ["quietly", "quiet", "quietest", "more quiet"],
      answer: "quietly",
      hint: "Nói một cách yên lặng: speaks quietly."
    },
    {
      question: "Toby runs very ______ to win the race.",
      options: ["fast", "fastly", "faster", "fastest"],
      answer: "fast",
      hint: "Trạng từ của 'fast' giữ nguyên dạng là 'fast'."
    },
    {
      question: "They listened ______ to their teacher.",
      options: ["carefully", "careful", "carefuller", "carefuly"],
      answer: "carefully",
      hint: "Lắng nghe cẩn thận: listened carefully."
    },
    {
      question: "The rain fell ______ all night.",
      options: ["heavily", "heavy", "heavyly", "heaviest"],
      answer: "heavily",
      hint: "Mưa rơi nặng hạt: fell heavily."
    }
  ]
};
