import { grammarQuestionsDatabase } from './grammarQuestionsData';

export interface SnapshotTableItem {
  col1: string;
  col2: string;
  col3?: string;
}

export interface GrammarSnapshot {
  formula: string;
  explanation: string;
  tableHeaders: string[];
  tableRows: SnapshotTableItem[];
  bullets: string[];
  examples: string[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string; // The exact string matching one of the options
  hint: string;
}

export interface ReadingChallenge {
  title: string;
  passage: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface WritingChallengeTask {
  id: number;
  type: 'sentence' | 'paragraph' | 'picture' | 'situation';
  title: string;
  prompt: string;
  imageUrl?: string;
  helperWords?: string[];
  sampleAnswer: string;
}

export interface SyllabusUnit {
  id: number;
  title: string;
  type: 'unit';
  snapshot: GrammarSnapshot;
  gameType: 'treasure' | 'battle' | 'space' | 'escape' | 'maze';
  gameName: string;
  questions: Question[];
}

export interface SyllabusRevision {
  id: string; // e.g. "mini-1-3", "rev-1-6"
  title: string;
  type: 'mini_revision' | 'revision' | 'final_revision';
  coveredUnits: string;
  grammarQuestions: Question[];
  readingChallenge: ReadingChallenge;
  writingChallenge: WritingChallengeTask[];
}

export type SyllabusItem = SyllabusUnit | SyllabusRevision;

export interface Mission {
  id: number;
  title: string;
  items: SyllabusItem[];
}

// Generate high quality questions for any unit as a fallback to ensure 100% playability
function getMixedQuestions(unitIds: number[], count: number): Question[] {
  const result: Question[] = [];
  let idx = 0;
  let attempts = 0;
  const maxAttempts = 1000;
  while (result.length < count && attempts < maxAttempts) {
    attempts++;
    for (const uId of unitIds) {
      if (result.length >= count) break;
      const uQs = grammarQuestionsDatabase[uId];
      if (uQs) {
        const qIndex = Math.floor(idx / unitIds.length) % uQs.length;
        const baseQ = uQs[qIndex];
        const alreadyAdded = result.some(r => r.question === baseQ.question);
        if (!alreadyAdded) {
          result.push({
            id: result.length + 1,
            question: baseQ.question,
            options: baseQ.options,
            answer: baseQ.answer,
            hint: baseQ.hint
          });
        }
      }
    }
    idx += unitIds.length;
  }
  
  if (result.length < count) {
    let duplicateIdx = 0;
    while (result.length < count) {
      for (const uId of unitIds) {
        if (result.length >= count) break;
        const uQs = grammarQuestionsDatabase[uId];
        if (uQs) {
          const baseQ = uQs[duplicateIdx % uQs.length];
          result.push({
            id: result.length + 1,
            question: baseQ.question,
            options: baseQ.options,
            answer: baseQ.answer,
            hint: baseQ.hint
          });
          duplicateIdx++;
        }
      }
    }
  }
  
  return result;
}

export function generateQuestionsForUnit(unitId: number, title: string): Question[] {
  if (unitId === 100) return getMixedQuestions([7, 8, 9, 10], 10);
  if (unitId === 200) return getMixedQuestions([7, 8, 9, 10], 20);
  if (unitId === 300) return getMixedQuestions([11, 12, 13], 10);
  if (unitId === 400) return getMixedQuestions([14, 15], 10);
  if (unitId === 500) return getMixedQuestions([11, 12, 13, 14, 15], 20);
  if (unitId === 600) return getMixedQuestions([16, 17, 18], 20);
  if (unitId === 700) return getMixedQuestions([19, 20], 20);
  if (unitId === 800) return getMixedQuestions([19, 20, 21], 20);
  if (unitId === 900) return getMixedQuestions([22, 23], 10);
  if (unitId === 1000) return getMixedQuestions([24, 25, 26], 10);
  if (unitId === 1100) return getMixedQuestions([22, 23, 24, 25, 26], 20);
  if (unitId === 1200) return getMixedQuestions([27, 28], 20);
  if (unitId === 1300) return getMixedQuestions([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], 20);

  const databaseQs = grammarQuestionsDatabase[unitId];
  if (databaseQs) {
    return databaseQs.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: q.options,
      answer: q.answer,
      hint: q.hint
    }));
  }

  const list: Question[] = [];
  const templates = [
    {
      q: "Choose the correct form for: 'The cat [be] on the mat.'",
      opts: ["is", "are", "am", "be"],
      ans: "is",
      h: "Singular subject 'The cat' takes singular verb 'is'."
    }
  ];

  for (let i = 1; i <= 10; i++) {
    const temp = templates[(unitId + i) % templates.length];
    list.push({
      id: i,
      question: `[U${unitId} Q${i}] ${temp.q.replace(/\[\w+\]/, `(${title})`)}`,
      options: [...temp.opts],
      answer: temp.ans,
      hint: temp.h
    });
  }
  return list;
}

export const officialSyllabus: Mission[] = [
  {
    id: 1,
    title: "Mission 1: Welcome to Grammar Land",
    items: [
      {
        id: 1,
        title: "Unit 1: Plurals",
        type: "unit",
        gameType: "treasure",
        gameName: "Pirate Treasure Hunt",
        snapshot: {
          formula: "Noun + -s / -es / -ies / -ves",
          explanation: "Ta dùng danh từ số nhiều (Plural) khi muốn nói về từ 2 người, con vật hay đồ vật trở lên.",
          tableHeaders: ["Rule (Quy tắc)", "Ending (Đuôi)", "Examples (Ví dụ)"],
          tableRows: [
            { col1: "Most nouns", col2: "+ s", col3: "cat ➔ cats, dog ➔ dogs" },
            { col1: "Ending in -ch, -sh, -s, -x, -z", col2: "+ es", col3: "box ➔ boxes, bus ➔ buses" },
            { col1: "Ending in consonant + -y", col2: "y ➔ -ies", col3: "baby ➔ babies, fly ➔ flies" },
            { col1: "Ending in -f / -fe", col2: "-f/-fe ➔ -ves", col3: "leaf ➔ leaves, knife ➔ knives" },
            { col1: "Irregular Plurals", col2: "No rule", col3: "child ➔ children, foot ➔ feet, mouse ➔ mice" }
          ],
          bullets: [
            "Danh từ số ít (Singular) chỉ có MỘT (a/an/one).",
            "Danh từ số nhiều (Plural) chỉ từ HAI trở lên.",
            "Chú ý các từ đặc biệt như: deer ➔ deer, sheep ➔ sheep, fish ➔ fish."
          ],
          examples: [
            "I have one apple. (Singular)",
            "He has three apples. (Plural)",
            "There are five children in the playground. (Irregular Plural)"
          ]
        },
        questions: [
          { id: 1, question: "What is the plural form of 'bus'?", options: ["buses", "buss", "busses", "buseses"], answer: "buses", hint: "Danh từ tận cùng bằng -s, ta thêm -es vào cuối nhé!" },
          { id: 2, question: "What is the plural form of 'baby'?", options: ["babys", "babies", "babyes", "babyies"], answer: "babies", hint: "Tận cùng là phụ âm + 'y', ta đổi 'y' thành 'i' rồi thêm 'es' nha." },
          { id: 3, question: "Choose the correct irregular plural for 'child':", options: ["childs", "children", "childrens", "childes"], answer: "children", hint: "Child là danh từ bất quy tắc đặc biệt, đổi thành children." },
          { id: 4, question: "What is the plural form of 'knife'?", options: ["knifes", "knives", "knifees", "knive"], answer: "knives", hint: "Tận cùng là -fe, ta đổi -fe thành -ves nhé!" },
          { id: 5, question: "Identify the plural form of 'toy':", options: ["toys", "toyes", "toies", "toyies"], answer: "toys", hint: "Vì trước 'y' là nguyên âm 'o', ta chỉ cần thêm 's' thui." },
          { id: 6, question: "Which word is an irregular plural?", options: ["cats", "dogs", "mice", "boxes"], answer: "mice", hint: "Mouse đổi thành mice, đây là dạng bất quy tắc." },
          { id: 7, question: "What is the plural form of 'tomato'?", options: ["tomatos", "tomatoes", "tomato", "tomatoies"], answer: "tomatoes", hint: "Tận cùng bằng -o (trước đó là phụ âm), ta thường thêm -es." },
          { id: 8, question: "What is the plural of 'sheep'?", options: ["sheeps", "sheepes", "sheep", "sheepies"], answer: "sheep", hint: "Con cừu là danh từ đặc biệt giữ nguyên dạng số nhiều: sheep ➔ sheep." },
          { id: 9, question: "Identify the correct plural sentence:", options: ["The leaves are falling.", "The leafes are falling.", "The leafs are falling.", "The leave are falling."], answer: "The leaves are falling.", hint: "Leaf kết thúc bằng -f, đổi thành leaves." },
          { id: 10, question: "Select the correct plural of 'man':", options: ["mans", "men", "mens", "manes"], answer: "men", hint: "Man đổi thành men ở số nhiều nha con." }
        ]
      },
      {
        id: 2,
        title: "Unit 2: There is / There are",
        type: "unit",
        gameType: "battle",
        gameName: "LeeGo Monster Battle",
        snapshot: {
          formula: "There is + Singular Noun / There are + Plural Noun",
          explanation: "Dùng để giới thiệu hoặc chỉ ra sự tồn tại của người hoặc vật ở một địa điểm nào đó.",
          tableHeaders: ["Structure (Cấu trúc)", "Noun Type (Loại danh từ)", "Example (Ví dụ)"],
          tableRows: [
            { col1: "There is (There's)", col2: "Singular / Uncountable", col3: "There is an apple on the table. There is milk in the glass." },
            { col1: "There are (There're)", col2: "Plural Countable Noun", col3: "There are four books in my backpack." },
            { col1: "Is there...?", col2: "Question (Số ít / Không đếm được)", col3: "Is there a cat under the chair?" },
            { col1: "Are there...?", col2: "Question (Số nhiều)", col3: "Are there any pencils in the box?" }
          ],
          bullets: [
            "There is viết tắt là There's. Nhưng There are không viết tắt là There're khi viết.",
            "Trong câu phủ định và nghi vấn số nhiều, ta thường dùng kèm từ 'any' (nào).",
            "Dùng 'a/an' với danh từ số ít đứng sau There is."
          ],
          examples: [
            "There is a small puppy in the garden. 🐶",
            "There are some beautiful flowers in the vase. 🌸",
            "Is there any milk left in the fridge? 🥛"
          ]
        },
        questions: [
          { id: 1, question: "Complete: '______ a cute cat under my bed.'", options: ["There is", "There are", "Is there", "Are there"], answer: "There is", hint: "'a cute cat' là danh từ số ít, dùng 'There is' nhé." },
          { id: 2, question: "Complete: '______ many students in the classroom.'", options: ["There is", "There are", "Is there", "Are there"], answer: "There are", hint: "'many students' là số nhiều, dùng 'There are'." },
          { id: 3, question: "Fill in: '______ any apples left in the basket?'", options: ["Is there", "Are there", "There is", "There are"], answer: "Are there", hint: "Đây là câu hỏi nghi vấn số nhiều ('any apples'), bắt đầu bằng 'Are there'." },
          { id: 4, question: "Fill in: 'There ______ some water in the bottle.'", options: ["is", "are", "am", "be"], answer: "is", hint: "Water là danh từ không đếm được, luôn dùng động từ số ít 'is' nha con." },
          { id: 5, question: "Choose the correct sentence:", options: ["There is three dogs.", "There are a dog.", "There are three dogs.", "There is any dogs."], answer: "There are three dogs.", hint: "'Three dogs' là danh từ số nhiều, đi kèm 'There are'." },
          { id: 6, question: "Complete: '______ a notebook on the desk?'", options: ["Is there", "Are there", "There is", "There are"], answer: "Is there", hint: "Câu hỏi số ít ('a notebook') dùng 'Is there'." },
          { id: 7, question: "Complete: 'There isn't ______ milk in the fridge.'", options: ["some", "any", "a", "an"], answer: "any", hint: "Trong câu phủ định, ta dùng 'any' trước danh từ không đếm được." },
          { id: 8, question: "Complete: 'There ______ fifteen desks in our classroom.'", options: ["is", "are", "am", "be"], answer: "are", hint: "'fifteen desks' là số nhiều, dùng 'are'." },
          { id: 9, question: "Select the correct option: '______ a beautiful rainbow in the sky.'", options: ["There's", "There're", "Is there", "Are there"], answer: "There's", hint: "There's là viết tắt của There is, rất phù hợp với danh từ số ít 'a beautiful rainbow'." },
          { id: 10, question: "Complete: '______ any pens in your bag?' - 'Yes, there are.'", options: ["Is there", "Are there", "There is", "There are"], answer: "Are there", hint: "Dựa vào câu trả lời 'there are' và 'any pens' số nhiều, câu hỏi phải là 'Are there'." }
        ]
      },
      {
        id: 3,
        title: "Unit 3: Countable and Uncountable Nouns",
        type: "unit",
        gameType: "space",
        gameName: "Galaxy Space Mission",
        snapshot: {
          formula: "Countable (1, 2, 3...) vs Uncountable (cannot count)",
          explanation: "Danh từ đếm được (Countable) có thể đếm bằng số lượng cụ thể. Danh từ không đếm được (Uncountable) là chất lỏng, hạt nhỏ, hoặc khái niệm chung.",
          tableHeaders: ["Noun Category (Loại danh từ)", "Quantifiers (Từ chỉ lượng)", "Examples (Ví dụ)"],
          tableRows: [
            { col1: "Countable Singular", col2: "a / an / one", col3: "an egg, a banana, a tomato" },
            { col1: "Countable Plural", col2: "some / any / many / few", col3: "some apples, many crayons" },
            { col1: "Uncountable", col2: "some / any / much / little", col3: "some water, some rice, some cheese" }
          ],
          bullets: [
            "Danh từ không đếm được KHÔNG bao giờ đi với 'a/an' trực tiếp hoặc ở dạng số nhiều (thêm s/es).",
            "Ta dùng các đơn vị đo lường để đếm: 'a glass of water' (một ly nước), 'a slice of bread' (một lát bánh mì).",
            "Dùng 'some' cho câu khẳng định, 'any' cho câu phủ định và câu hỏi."
          ],
          examples: [
            "An apple a day keeps the doctor away. (Countable Singular)",
            "We need to buy some bread and butter. (Uncountable)",
            "How many carrots do we have? (Countable Plural)"
          ]
        },
        questions: [
          { id: 1, question: "Which of the following is an UNCOUNTABLE noun?", options: ["orange", "milk", "cookie", "chair"], answer: "milk", hint: "Sữa là chất lỏng, chúng ta không thể đếm 'một sữa, hai sữa' nên là không đếm được!" },
          { id: 2, question: "Which of the following is a COUNTABLE noun?", options: ["water", "money", "banana", "sugar"], answer: "banana", hint: "Quả chuối có thể đếm được: 'one banana, two bananas'." },
          { id: 3, question: "Complete: 'I want to drink ______ glass of orange juice.'", options: ["a", "an", "some", "any"], answer: "a", hint: "'glass' bắt đầu bằng phụ âm, đếm được số ít, dùng 'a'." },
          { id: 4, question: "Complete: 'Would you like ______ chocolate?' (Offering)", options: ["some", "any", "a", "an"], answer: "some", hint: "Khi mời mọc lịch thiệp, ta dùng 'some' thay vì 'any' mặc dù là câu hỏi." },
          { id: 5, question: "Fill in: 'There isn't ______ cheese on my pizza.'", options: ["any", "some", "a", "many"], answer: "any", hint: "Cheese là danh từ không đếm được, dùng 'any' trong câu phủ định." },
          { id: 6, question: "Choose the correct phrase:", options: ["a bread", "a slice of bread", "two breads", "an bread"], answer: "a slice of bread", hint: "Bread là không đếm được, ta đếm qua lát: 'a slice of bread'." },
          { id: 7, question: "Complete: 'How ______ rice is there in the pot?'", options: ["much", "many", "some", "any"], answer: "much", hint: "Rice là không đếm được, hỏi lượng dùng 'How much'." },
          { id: 8, question: "Complete: 'How ______ eggs do we need for the cake?'", options: ["many", "much", "some", "any"], answer: "many", hint: "Eggs là số nhiều đếm được, hỏi lượng dùng 'How many'." },
          { id: 9, question: "Identify the countable plural noun:", options: ["sand", "children", "soup", "gold"], answer: "children", hint: "Children là danh từ số nhiều đếm được (những đứa trẻ)." },
          { id: 10, question: "Complete: 'There are ______ oranges on the tree.'", options: ["some", "a", "an", "much"], answer: "some", hint: "Oranges là danh từ số nhiều đếm được trong câu khẳng định, đi kèm 'some'." }
        ]
      },
      {
        id: "mini-1-3" as any,
        title: "Mini Revision: Units 1–3",
        type: "mini_revision",
        coveredUnits: "Units 1–3",
        grammarQuestions: [
          { id: 1, question: "Choose the correct plural form of 'glass':", options: ["glasss", "glasses", "glasser", "glassies"], answer: "glasses", hint: "Tận cùng là -ss, thêm -es." },
          { id: 2, question: "What is the plural of 'wolf'?", options: ["wolfs", "wolves", "wolfe", "wolveses"], answer: "wolves", hint: "-f đổi thành -ves." },
          { id: 3, question: "Complete: '______ two white rabbits in the garden.'", options: ["There is", "There are", "Is there", "Are there"], answer: "There are", hint: "Two rabbits là số nhiều." },
          { id: 4, question: "Complete: '______ any milk in the jug?'", options: ["Is there", "Are there", "There is", "There are"], answer: "Is there", hint: "Milk là không đếm được, dùng câu hỏi số ít." },
          { id: 5, question: "Identify the uncountable noun:", options: ["pencil", "sugar", "apple", "baby"], answer: "sugar", hint: "Đường là danh từ dạng hạt li ti không đếm được." },
          { id: 6, question: "Complete: 'I have ______ umbrella in my backpack.'", options: ["a", "an", "some", "any"], answer: "an", hint: "Umbrella bắt đầu bằng nguyên âm u." },
          { id: 7, question: "What is the plural of 'mouse'?", options: ["mouses", "mice", "mices", "mousees"], answer: "mice", hint: "Bất quy tắc: mouse thành mice." },
          { id: 8, question: "Complete: 'How ______ water do you drink every day?'", options: ["much", "many", "some", "any"], answer: "much", hint: "Water là không đếm được." },
          { id: 9, question: "Complete: 'There isn't ______ cheese in the sandwich.'", options: ["any", "some", "a", "many"], answer: "any", hint: "Phủ định dùng any." },
          { id: 10, question: "Complete: '______ a computer on your table?'", options: ["Is there", "Are there", "There is", "There are"], answer: "Is there", hint: "Câu hỏi số ít 'a computer'." }
        ],
        readingChallenge: {
          title: "The Picnic at LeeGo Park",
          passage: "Today, Nick and Lucy are having a picnic at LeeGo Park in Hai Phong. Nick has a blue backpack, and Lucy has a red bag. There is some delicious food in Nick's backpack. There are three apples, some slices of cheese, and two bottles of orange juice. Lucy has some strawberries and a big cake. Lucy says, 'There are many birds in the trees. Look, there is a small squirrel under the bench!' They are very happy.",
          questions: [
            { id: 1, question: "Where are Nick and Lucy having a picnic?", options: ["At school", "At LeeGo Park", "At home", "At the zoo"], answer: "At LeeGo Park" },
            { id: 2, question: "What colour is Nick's backpack?", options: ["Red", "Blue", "Green", "Yellow"], answer: "Blue" },
            { id: 3, question: "How many apples are there in Nick's backpack?", options: ["Two", "Three", "Four", "Five"], answer: "Three" },
            { id: 4, question: "What drink do they have?", options: ["Water", "Milk", "Orange juice", "Apple juice"], answer: "Orange juice" },
            { id: 5, question: "What uncountable food does Nick have?", options: ["Apples", "Slices of cheese", "Cake", "Strawberries"], answer: "Slices of cheese" },
            { id: 6, question: "Where are the birds?", options: ["On the bench", "Under the table", "In the trees", "In the bag"], answer: "In the trees" },
            { id: 7, question: "What is under the bench?", options: ["A bird", "A cat", "A dog", "A small squirrel"], answer: "A small squirrel" },
            { id: 8, question: "Are they happy at the picnic?", options: ["Yes, they are", "No, they aren't", "They are sad", "They are angry"], answer: "Yes, they are" }
          ]
        },
        writingChallenge: [
          {
            id: 1,
            type: "sentence",
            title: "Plurals Challenge",
            prompt: "Write a sentence using the plural form of 'child' and the plural form of 'toy'.",
            helperWords: ["children", "toys", "play"],
            sampleAnswer: "The children are playing with their toys in the living room."
          },
          {
            id: 2,
            type: "picture",
            title: "Describing a Kitchen",
            prompt: "Look at your kitchen. Write a short description using 'There is' and 'There are' to describe 3 things in the kitchen (e.g. water, bananas, a fridge).",
            helperWords: ["There is", "There are", "some", "fridge"],
            sampleAnswer: "In my kitchen, there is a big fridge. There are three yellow bananas on the table, and there is some water in the cup."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Mission 2: My Family and Belongings",
    items: [
      {
        id: 4,
        title: "Unit 4: Subject and Object Pronouns, Possessive Adjectives",
        type: "unit",
        gameType: "escape",
        gameName: "Castle Escape Adventure",
        snapshot: {
          formula: "Subject Pronoun (I) ➔ Object Pronoun (me) ➔ Possessive Adjective (my)",
          explanation: "Đại từ nhân xưng chủ ngữ đứng đầu câu làm chủ ngữ. Đại từ tân ngữ đứng sau động từ hoặc giới từ. Tính từ sở hữu đứng trước danh từ.",
          tableHeaders: ["Subject (Chủ ngữ)", "Object (Tân ngữ)", "Possessive Adj (Sở hữu)"],
          tableRows: [
            { col1: "I", col2: "me", col3: "my (my pen)" },
            { col1: "You", col2: "you", col3: "your (your cat)" },
            { col1: "He", col2: "him", col3: "his (his car)" },
            { col1: "She", col2: "her", col3: "her (her doll)" },
            { col1: "It", col2: "it", col3: "its (its bone)" },
            { col1: "We", col2: "us", col3: "our (our house)" },
            { col1: "They", col2: "them", col3: "their (their ball)" }
          ],
          bullets: [
            "Đại từ chủ ngữ thực hiện hành động: 'SHE runs fast.'",
            "Đại từ tân ngữ nhận hành động: 'Listen to ME.' hoặc 'We love THEM.'",
            "Tính từ sở hữu LUÔN LUÔN đứng trước danh từ để chỉ chủ sở hữu."
          ],
          examples: [
            "I love my mother. She helps me with my homework.",
            "We are going to school. Our teacher is waiting for us.",
            "Look at the dog. Its tail is wagging happily."
          ]
        },
        questions: [
          { id: 1, question: "Complete: 'Peter is my friend. ______ plays football with me.'", options: ["He", "Him", "His", "She"], answer: "He", hint: "Peter là con trai và đóng vai trò chủ ngữ đầu câu, dùng 'He'." },
          { id: 2, question: "Complete: 'This is Jane. I like ______ very much.'", options: ["her", "she", "him", "me"], answer: "her", hint: "Jane là nữ, đứng sau động từ 'like' làm tân ngữ nên dùng 'her'." },
          { id: 3, question: "Complete: 'We love ______ English class at LeeGo!'", options: ["our", "us", "we", "ours"], answer: "our", hint: "Trước danh từ 'English class' cần tính từ sở hữu của 'We' là 'our'." },
          { id: 4, question: "Complete: 'Give that book to ______, please. It is mine.'", options: ["me", "I", "my", "myself"], answer: "me", hint: "Đứng sau giới từ 'to' làm tân ngữ, ta dùng 'me'." },
          { id: 5, question: "Complete: 'They are doing ______ homework now.'", options: ["their", "them", "they", "theirs"], answer: "their", hint: "Sở hữu của 'They' đứng trước danh từ 'homework' là 'their'." },
          { id: 6, question: "Complete: 'The dog is hungry. Give ______ some food.'", options: ["it", "its", "it's", "him"], answer: "it", hint: "Con vật dùng tân ngữ 'it'." },
          { id: 7, question: "Complete: '______ am a student at LeeGo Center.'", options: ["I", "Me", "My", "Mine"], answer: "I", hint: "Đầu câu đứng trước động từ 'am' làm chủ ngữ, dùng 'I'." },
          { id: 8, question: "Complete: 'Can you help ______? We are lost.'", options: ["us", "our", "we", "them"], answer: "us", hint: "Tân ngữ số nhiều chỉ 'chúng tôi' đứng sau động từ 'help' là 'us'." },
          { id: 9, question: "Complete: 'Sarah has a new bicycle. ______ bicycle is red.'", options: ["Her", "She", "His", "Hers"], answer: "Her", hint: "Sở hữu của Sarah (nữ) đứng trước danh từ 'bicycle' là 'Her'." },
          { id: 10, question: "Complete: 'Where are your keys? I can't find ______.'", options: ["them", "their", "they", "it"], answer: "them", hint: "'keys' là số nhiều, làm tân ngữ nhận hành động 'find' nên dùng 'them'." }
        ]
      },
      {
        id: 5,
        title: "Unit 5: Possessive Forms",
        type: "unit",
        gameType: "maze",
        gameName: "Grammar Labyrinth",
        snapshot: {
          formula: "Noun's + Object (Sở hữu cách)",
          explanation: "Dùng để chỉ quyền sở hữu của một ai đó hoặc con vật nào đó đối với một đồ vật.",
          tableHeaders: ["Noun Type (Loại danh từ)", "Possessive Form (Cấu trúc)", "Example (Ví dụ)"],
          tableRows: [
            { col1: "Singular Noun", col2: "+ 's", col3: "Tom's book, the cat's tail" },
            { col1: "Plural Noun ending in -s", col2: "+ '", col3: "the boys' school, the parents' car" },
            { col1: "Irregular Plural Noun", col2: "+ 's", col3: "children's toys, women's bags" }
          ],
          bullets: [
            "Chỉ cần thêm dấu phẩy ' nếu danh từ số nhiều đã kết thúc bằng -s.",
            "Danh từ số ít có đuôi -s (ví dụ: James) có thể viết là James's hoặc James'.",
            "Sở hữu cách chỉ dùng cho người hoặc động vật, không dùng cho đồ vật vô tri (vô tri dùng 'of': the leg of the table)."
          ],
          examples: [
            "This is Lucy's teddy bear. 🧸",
            "The teachers' room is on the second floor. (Room for many teachers)",
            "The children's books are colorful."
          ]
        },
        questions: [
          { id: 1, question: "Complete: 'This is ______ computer. (belonging to Mary)'", options: ["Mary's", "Marys'", "Marys", "Mary'"], answer: "Mary's", hint: "Mary là danh từ số ít, thêm 's vào cuối để thể hiện sở hữu." },
          { id: 2, question: "Complete: 'The ______ toys are all over the floor.'", options: ["children's", "childrens'", "childrens", "child's"], answer: "children's", hint: "Children là danh từ số nhiều bất quy tắc (không có đuôi s sẵn), ta vẫn thêm 's nha!" },
          { id: 3, question: "Complete: 'These are the ______ bicycles. (belonging to three boys)'", options: ["boys'", "boy's", "boys", "boyes"], answer: "boys'", hint: "Ba cậu bé là 'boys' số nhiều tận cùng bằng -s, ta chỉ cần thêm dấu phẩy (') thui: boys'." },
          { id: 4, question: "Choose the correct possessive form: 'The tail of the cat'", options: ["the cat's tail", "the cats' tail", "the cat tail", "the tail's cat"], answer: "the cat's tail", hint: "Con mèo số ít, thêm 's ➔ the cat's tail." },
          { id: 5, question: "Complete: '______ room is very clean. (belonging to my parents)'", options: ["My parents'", "My parent's", "My parents's", "My parents"], answer: "My parents'", hint: "Parents là bố mẹ (số nhiều), tận cùng là -s nên chỉ thêm dấu phẩy '." },
          { id: 6, question: "Complete: 'Is this ______ pencil? (belonging to Peter)'", options: ["Peter's", "Peters'", "Peters", "Peter'es"], answer: "Peter's", hint: "Peter số ít, thêm 's." },
          { id: 7, question: "Which is correct for the car of Mr. Smith?", options: ["Mr. Smith's car", "Mr. Smiths car", "Mr. Smith' car", "Mr. Smiths' car"], answer: "Mr. Smith's car", hint: "Mr. Smith số ít, thêm 's vào cuối tên." },
          { id: 8, question: "Complete: 'The ______ uniforms are blue. (belonging to the students)'", options: ["students'", "student's", "students's", "students"], answer: "students'", hint: "Students số nhiều có s, thêm dấu '." },
          { id: 9, question: "Choose the correct phrase: 'The bags of the women'", options: ["the women's bags", "the womens' bags", "the womens bags", "the woman's bags"], answer: "the women's bags", hint: "Women là số nhiều bất quy tắc, ta thêm 's." },
          { id: 10, question: "Complete: 'I am holding my ______ hand. (belonging to my sister)'", options: ["sister's", "sisters'", "sisters", "sister"], answer: "sister's", hint: "Em gái/chị gái số ít, thêm 's." }
        ]
      },
      {
        id: 6,
        title: "Unit 6: This / That / These / Those",
        type: "unit",
        gameType: "treasure",
        gameName: "Treasure Island",
        snapshot: {
          formula: "This/That (Singular) vs These/Those (Plural)",
          explanation: "Dùng để chỉ ra các đồ vật hoặc người ở gần hoặc ở xa người nói.",
          tableHeaders: ["Distance (Khoảng cách)", "Singular (Số ít)", "Plural (Số nhiều)"],
          tableRows: [
            { col1: "Near (Gần)", col2: "This (Đây)", col3: "These (Này)" },
            { col1: "Far (Xa)", col2: "That (Kia)", col3: "Those (Kia/Đó)" }
          ],
          bullets: [
            "This và That đi kèm động từ số ít 'is'.",
            "These và Those đi kèm động từ số nhiều 'are'.",
            "Chúng cũng có thể đi trực tiếp trước danh từ để làm từ chỉ định: 'this pen' (cây bút này)."
          ],
          examples: [
            "This is my new toy car. (Near, Singular)",
            "Those are birds in the tree over there. (Far, Plural)",
            "Look at that beautiful kite in the sky! (Far, Singular)"
          ]
        },
        questions: [
          { id: 1, question: "Complete: '______ is my book here in my hand.'", options: ["This", "That", "These", "Those"], answer: "This", hint: "Sách ở trong tay (gần) và số ít ('is'), dùng 'This'." },
          { id: 2, question: "Complete: 'Look at ______ stars up in the night sky!'", options: ["those", "these", "this", "that"], answer: "those", hint: "Ngôi sao ở xa trên trời, số nhiều ('stars'), dùng 'those'." },
          { id: 3, question: "Complete: '______ apples on this plate are very sweet.'", options: ["These", "Those", "This", "That"], answer: "These", hint: "Táo nằm trên đĩa này (gần) và số nhiều, dùng 'These'." },
          { id: 4, question: "Complete: '______ is a big boat far out on the sea.'", options: ["That", "This", "These", "Those"], answer: "That", hint: "Chiếc thuyền ở xa ngoài biển (xa), số ít ('is'), dùng 'That'." },
          { id: 5, question: "Fill in: 'What are ______ over there in the garden?'", options: ["those", "these", "this", "that"], answer: "those", hint: "Vật ở ngoài vườn (xa), số nhiều ('are'), dùng 'those'." },
          { id: 6, question: "Fill in: 'Do you like ______ t-shirt I am wearing?'", options: ["this", "that", "these", "those"], answer: "this", hint: "Chiếc áo tôi đang mặc (gần), số ít, dùng 'this'." },
          { id: 7, question: "Complete: '______ are my crayons on my desk.'", options: ["These", "Those", "This", "That"], answer: "These", hint: "Màu sáp trên bàn học (gần), số nhiều ('are'), dùng 'These'." },
          { id: 8, question: "Complete: 'Who is ______ boy standing next to the gate over there?'", options: ["that", "this", "these", "those"], answer: "that", hint: "Cậu bé đứng ở cổng đằng xa, số ít, dùng 'that'." },
          { id: 9, question: "Choose the correct sentence:", options: ["These is my toys.", "These are my toys.", "This are my toys.", "Those is my toys."], answer: "These are my toys.", hint: "These là số nhiều đi kèm động từ 'are'." },
          { id: 10, question: "Complete: '______ balloons in my hand are colorful.'", options: ["These", "Those", "This", "That"], answer: "These", hint: "Bóng bay trong tay tôi (gần), số nhiều, dùng 'These'." }
        ]
      },
      {
        id: "mini-2-6" as any,
        title: "Mini Revision: Units 4–6",
        type: "mini_revision",
        coveredUnits: "Units 4–6",
        grammarQuestions: [
          { id: 1, question: "Complete: 'She plays with ______ doll. (belonging to her)'", options: ["her", "hers", "she", "him"], answer: "her", hint: "Tính từ sở hữu đứng trước danh từ." },
          { id: 2, question: "Complete: 'Peter gave a book to ______ yesterday.'", options: ["me", "I", "my", "mine"], answer: "me", hint: "Tân ngữ đứng sau giới từ to." },
          { id: 3, question: "Complete: 'The ______ bags are in the classroom.'", options: ["girls'", "girl's", "girls's", "girls"], answer: "girls'", hint: "Bao gồm nhiều cô gái." },
          { id: 4, question: "Complete: 'This is ______ computer. (belonging to Toby)'", options: ["Toby's", "Tobys'", "Tobys", "Toby'"], answer: "Toby's", hint: "Toby là số ít." },
          { id: 5, question: "Complete: '______ are clouds in the sky far away.'", options: ["Those", "These", "This", "That"], answer: "Those", hint: "Mây đằng xa, số nhiều." },
          { id: 6, question: "Complete: 'Is ______ pen in my hand yours?'", options: ["this", "that", "these", "those"], answer: "this", hint: "Bút trong tay là gần, số ít." },
          { id: 7, question: "Complete: 'They love ______ house.'", options: ["their", "them", "they", "theirs"], answer: "their", hint: "Sở hữu đứng trước danh từ house." },
          { id: 8, question: "Complete: 'My ______ names are Max and Ruby.'", options: ["dogs'", "dog's", "dogs", "dogs's"], answer: "dogs'", hint: "Names số nhiều chứng tỏ có từ 2 con chó trở lên." },
          { id: 9, question: "Complete: 'Give the bone to the puppy. ______ tail is wagging.'", options: ["Its", "It's", "It", "Their"], answer: "Its", hint: "Sở hữu của puppy là Its." },
          { id: 10, question: "Complete: 'Look at ______ balloon floating high up!'", options: ["that", "this", "these", "those"], answer: "that", hint: "Bóng bay bay cao đằng xa, số ít." }
        ],
        readingChallenge: {
          title: "My Family and Our Pets",
          passage: "Hello, my name is Toby. I live in Hải Phòng with my parents and my sister, Lily. This is our house. It is big and white. We have two dogs. Their names are Max and Toby Junior. Max is black and its tail is short. Toby Junior is white. Our dogs' toys are in the garden. Today, Lily's friend is visiting us. Her name is Elsa. Elsa has a cute cat in her bag. Elsa says, 'This cat is very quiet.' We love Elsa's cat.",
          questions: [
            { id: 1, question: "Who does Toby live with?", options: ["Parents and sister Lily", "Grandparents", "Only Elsa", "His friends"], answer: "Parents and sister Lily" },
            { id: 2, question: "What color is their house?", options: ["Red and blue", "Big and white", "Small and green", "Yellow"], answer: "Big and white" },
            { id: 3, question: "What is the name of the black dog?", options: ["Max", "Toby Junior", "Elsa", "Lily"], answer: "Max" },
            { id: 4, question: "Where are the dogs' toys?", options: ["In the living room", "In the bedroom", "In the garden", "In the bag"], answer: "In the garden" },
            { id: 5, question: "Whose friend is visiting today?", options: ["Toby's", "Lily's", "Max's", "The parent's"], answer: "Lily's" },
            { id: 6, question: "What is the name of Lily's friend?", options: ["Elsa", "Toby Junior", "Lucy", "Mary"], answer: "Elsa" },
            { id: 7, question: "What animal does Elsa have in her bag?", options: ["A dog", "A squirrel", "A cute cat", "A rabbit"], answer: "A cute cat" },
            { id: 8, question: "Is Elsa's cat loud or quiet?", options: ["Very loud", "Very quiet", "Naughty", "Angry"], answer: "Very quiet" }
          ]
        },
        writingChallenge: [
          {
            id: 1,
            type: "sentence",
            title: "Possessive Pronouns",
            prompt: "Write a sentence describing what your best friend is doing with his/her book using 'his' or 'her'.",
            helperWords: ["her book", "reading", "friend"],
            sampleAnswer: "My best friend is reading her book in the classroom."
          },
          {
            id: 2,
            type: "paragraph",
            title: "Describing My Family Pets",
            prompt: "Describe your family pets or your toys using possessive forms (e.g. sister's doll, dog's ball). Write at least 2-3 sentences.",
            helperWords: ["sister's", "dog's", "toys", "house"],
            sampleAnswer: "At home, we have a puppy. This is my dog's favorite ball. My sister's doll is sitting on the sofa next to my backpack."
          }
        ]
      },
      {
        id: "rev-1-6" as any,
        title: "Revision 1: Master of Basics (Units 1–6)",
        type: "revision",
        coveredUnits: "Units 1–6",
        grammarQuestions: [
          { id: 1, question: "What is the plural of 'man'?", options: ["men", "mans", "mens", "man"], answer: "men", hint: "Bất quy tắc." },
          { id: 2, question: "What is the plural of 'glass'?", options: ["glasses", "glass", "glassies", "glasss"], answer: "glasses", hint: "Tận cùng là -ss." },
          { id: 3, question: "Complete: '______ a sandwich and some chips on the table.'", options: ["There is", "There are", "Is there", "Are there"], answer: "There is", hint: "A sandwich là danh từ số ít quyết định động từ đầu tiên." },
          { id: 4, question: "Complete: 'There are ______ carrots in the garden.'", options: ["some", "any", "a", "an"], answer: "some", hint: "Khẳng định dùng some." },
          { id: 5, question: "Identify the uncountable noun:", options: ["cheese", "grape", "orange", "pencil"], answer: "cheese", hint: "Phô mai là danh từ khối, không đếm được." },
          { id: 6, question: "Complete: 'They love ______ teacher.'", options: ["their", "them", "they", "theirs"], answer: "their", hint: "Đứng trước danh từ." },
          { id: 7, question: "Complete: 'Can you see Peter? Tell ______ to come here.'", options: ["him", "he", "his", "himself"], answer: "him", hint: "Tân ngữ sau động từ tell." },
          { id: 8, question: "Complete: 'The ______ room is on the second floor. (belonging to my two brothers)'", options: ["brothers'", "brother's", "brothers's", "brothers"], answer: "brothers'", hint: "Brothers số nhiều có s, chỉ thêm '." },
          { id: 9, question: "Complete: '______ are stars in the sky over there.'", options: ["Those", "These", "This", "That"], answer: "Those", hint: "Stars đằng xa, số nhiều." },
          { id: 10, question: "Complete: 'Is ______ notebook in my hand yours?'", options: ["this", "that", "these", "those"], answer: "this", hint: "Vật gần, số ít." },
          { id: 11, question: "What is the plural of 'child'?", options: ["children", "childs", "childrens", "childes"], answer: "children", hint: "Bất quy tắc." },
          { id: 12, question: "What is the plural of 'butterfly'?", options: ["butterflies", "butterflys", "butterfles", "butterflyies"], answer: "butterflies", hint: "Y thành ies." },
          { id: 13, question: "Complete: 'There isn't ______ water in the glass.'", options: ["any", "some", "a", "many"], answer: "any", hint: "Phủ định không đếm được dùng any." },
          { id: 14, question: "Complete: 'How ______ eggs do we need?'", options: ["many", "much", "some", "any"], answer: "many", hint: "Eggs đếm được số nhiều." },
          { id: 15, question: "Complete: 'We live in Hải Phòng. ______ city is beautiful.'", options: ["Our", "Us", "We", "Ours"], answer: "Our", hint: "Sở hữu đứng trước city." },
          { id: 16, question: "Complete: 'This is my cat. ______ name is Meo Meo.'", options: ["Its", "It's", "It", "Their"], answer: "Its", hint: "Sở hữu cách của vật/con vật." },
          { id: 17, question: "Complete: 'This is Jane's cat. It is ______ cat.'", options: ["her", "hers", "she", "his"], answer: "her", hint: "Jane là nữ, dùng her." },
          { id: 18, question: "Complete: 'Are there ______ desks in the room?'", options: ["any", "some", "a", "an"], answer: "any", hint: "Câu hỏi dùng any." },
          { id: 19, question: "Complete: 'The ______ uniforms are clean. (belonging to children)'", options: ["children's", "childrens'", "childs'", "children"], answer: "children's", hint: "Children's là đúng quy tắc sở hữu danh từ số nhiều bất quy tắc." },
          { id: 20, question: "Complete: '______ cookies on my plate are yummy.'", options: ["These", "Those", "This", "That"], answer: "These", hint: "Cookies số nhiều gần." }
        ],
        readingChallenge: {
          title: "A Day in Hải Phòng City",
          passage: "My family lives in a beautiful apartment in Hải Phòng. In our apartment, there is a big living room and three bedrooms. My bedroom has a blue desk. On my desk, there are some school books and my sister's crayons. We have a kitten. Its name is Mimi. Mimi's toys are on the floor. Today, my cousins are visiting us. Their names are Elsa and Bill. We play in the park with Elsa's dog. Those trees in the park are very green and tall. We are having so much fun!",
          questions: [
            { id: 1, question: "Where does Toby's family live?", options: ["An apartment in Hải Phòng", "A school", "A castle", "A park"], answer: "An apartment in Hải Phòng" },
            { id: 2, question: "How many bedrooms are there in their apartment?", options: ["One", "Two", "Three", "Four"], answer: "Three" },
            { id: 3, question: "What is on the boy's desk?", options: ["A computer", "Crayons and school books", "A kitten", "A toy car"], answer: "Crayons and school books" },
            { id: 4, question: "What is the name of their kitten?", options: ["Max", "Mimi", "Elsa", "Bill"], answer: "Mimi" },
            { id: 5, question: "Where are the kitten's toys?", options: ["On the table", "On the floor", "In the bedroom", "In the park"], answer: "On the floor" },
            { id: 6, question: "Who is visiting them today?", options: ["Their cousins Elsa and Bill", "Their teachers", "Their parents", "No one"], answer: "Their cousins Elsa and Bill" },
            { id: 7, question: "What is in the park?", options: ["Mimi's cat", "Tall green trees", "Many rabbits", "Some children's bags"], answer: "Tall green trees" },
            { id: 8, question: "Are they happy playing in the park?", options: ["Yes, they are having fun", "No, they are sad", "They are bored", "They are crying"], answer: "Yes, they are having fun" }
          ]
        },
        writingChallenge: [
          {
            id: 1,
            type: "sentence",
            title: "Describing what you have",
            prompt: "Write a sentence using 'There is' or 'There are' to describe something in your bedroom.",
            helperWords: ["There is", "blue desk", "bedroom"],
            sampleAnswer: "There is a blue desk in my comfortable bedroom."
          },
          {
            id: 2,
            type: "picture",
            title: "Describe Your Family Pets",
            prompt: "Describe your pet or a friend's pet using the possessive 's (e.g., sister's dog, friend's kitten) and possessive adjectives (e.g. its, their).",
            helperWords: ["kitten", "friend's", "its", "play"],
            sampleAnswer: "This is my friend's kitten. Its name is Mimi, and it likes to play with their toys."
          }
        ]
      }
    ]
  }
];

// Fill out the rest of the 28 units with snapshots and game structures to adhere strictly to the syllabus order
const missingUnitsInfo: { id: number; title: string; gameType: 'treasure' | 'battle' | 'space' | 'escape' | 'maze'; gameName: string; formula: string; explanation: string; tableHeaders: string[]; tableRows: SnapshotTableItem[]; bullets: string[]; examples: string[] }[] = [
  {
    id: 7, title: "Unit 7: Be", gameType: "battle", gameName: "Gladiator Fight",
    formula: "S + am/is/are + Noun/Adj", explanation: "Động từ 'To Be' dùng để mô tả tính chất, đặc điểm hoặc danh tính của chủ ngữ.",
    tableHeaders: ["Subject", "Be", "Example"],
    tableRows: [
      { col1: "I", col2: "am ('m)", col3: "I am a student." },
      { col1: "He / She / It", col2: "is ('s)", col3: "She is smart." },
      { col1: "You / We / They", col2: "are ('re)", col3: "They are here." }
    ],
    bullets: ["Thêm 'not' sau 'to be' trong câu phủ định: S + be + not.", "Đưa 'be' lên trước chủ ngữ trong câu hỏi: Am/Is/Are + S...?"],
    examples: ["I am not a teacher, I am a student.", "Is she your sister? Yes, she is."]
  },
  {
    id: 8, title: "Unit 8: Have got", gameType: "treasure", gameName: "Deep Sea Treasure Hunt",
    formula: "S + have/has got + Object", explanation: "Dùng để diễn tả sở hữu, đặc điểm cơ thể hoặc mối quan hệ.",
    tableHeaders: ["Subject", "Have got", "Example"],
    tableRows: [
      { col1: "I / You / We / They", col2: "have got ('ve got)", col3: "I have got a bicycle." },
      { col1: "He / She / It", col2: "has got ('s got)", col3: "She has got blue eyes." }
    ],
    bullets: ["Phủ định: S + haven't/hasn't got.", "Câu hỏi: Have/Has + S + got...?"],
    examples: ["I haven't got any sisters.", "Have you got a pet dog? Yes, I have."]
  },
  {
    id: 9, title: "Unit 9: -ing Form or to + Base Form", gameType: "space", gameName: "Asteroid Field Run",
    formula: "Verb + -ing / Verb + to + V-inf", explanation: "Một số động từ theo sau bởi danh động từ (V-ing), một số khác bởi động từ nguyên thể (to + V).",
    tableHeaders: ["Verb Type", "Following Form", "Verbs & Examples"],
    tableRows: [
      { col1: "Love, like, hate, enjoy", col2: "Verb + -ing", col3: "I love swimming. She likes playing chess." },
      { col1: "Want, decide, hope", col2: "to + V-inf", col3: "I want to eat pizza. We hope to see you." }
    ],
    bullets: ["V-ing đóng vai trò như một hoạt động.", "To + V biểu thị ý định, mong muốn."],
    examples: ["She enjoys drawing pictures.", "Do you want to play football?"]
  },
  {
    id: 10, title: "Unit 10: Imperative, Let's", gameType: "escape", gameName: "Ancient Mummy Escape",
    formula: "Base Verb! / Let's + Base Verb", explanation: "Dùng để ra lệnh, đưa ra lời khuyên, yêu cầu hoặc đề xuất cùng làm gì đó.",
    tableHeaders: ["Type", "Structure", "Example"],
    tableRows: [
      { col1: "Imperative (Positive)", col2: "Base Verb", col3: "Open your books, please!" },
      { col1: "Imperative (Negative)", col2: "Don't + Base Verb", col3: "Don't touch the glass!" },
      { col1: "Suggestion (Đề xuất)", col2: "Let's + Base Verb", col3: "Let's go to the playground!" }
    ],
    bullets: ["Câu mệnh lệnh không có chủ ngữ (chủ ngữ ngầm hiểu là 'you').", "Let's là viết tắt của 'Let us'."],
    examples: ["Don't make noise, baby is sleeping.", "Let's learn English with LeeGo!"]
  },
  {
    id: 11, title: "Unit 11: Present Simple", gameType: "maze", gameName: "Cave of Secrets",
    formula: "S + V(-s/-es) / S + don't/doesn't + V", explanation: "Thì hiện tại đơn diễn tả thói quen, hành động lặp đi lặp lại hoặc sự thật hiển nhiên.",
    tableHeaders: ["Subject Group", "Affirmative", "Negative & Question"],
    tableRows: [
      { col1: "I / You / We / They", col2: "S + V (base)", col3: "Don't + V / Do + S + V?" },
      { col1: "He / She / It", col2: "S + V-s/es", col3: "Doesn't + V / Does + S + V?" }
    ],
    bullets: ["Thêm -es khi động từ tận cùng: o, ch, sh, s, x, z (go ➔ goes).", "Từ nhận biết: always, usually, often, everyday."],
    examples: ["She plays tennis every Saturday.", "He doesn't like milk. Does he like water?"]
  },
  {
    id: 12, title: "Unit 12: Present Continuous", gameType: "battle", gameName: "Robot Wars",
    formula: "S + am/is/are + V-ing", explanation: "Diễn tả hành động đang xảy ra ngay tại thời điểm nói hoặc xung quanh thời điểm nói.",
    tableHeaders: ["Subject", "Be + V-ing", "Example"],
    tableRows: [
      { col1: "I", col2: "am + playing", col3: "I am writing an essay now." },
      { col1: "He / She / It", col2: "is + running", col3: "Look! The cat is running." },
      { col1: "You / We / They", col2: "are + listening", col3: "They are listening to music." }
    ],
    bullets: ["Phủ định: S + be + not + V-ing.", "Câu hỏi: Be + S + V-ing...?", "Dấu hiệu: now, right now, at the moment, Look!, Listen!"],
    examples: ["We are studying English right now.", "Are you doing your homework?"]
  },
  {
    id: 13, title: "Unit 13: Present Simple vs Present Continuous", gameType: "space", gameName: "Nebula Patrol",
    formula: "Routine (Simple) vs Now (Continuous)", explanation: "Phân biệt thói quen hằng ngày với việc đang diễn ra ngay lúc này.",
    tableHeaders: ["Present Simple", "Present Continuous", "Comparison Example"],
    tableRows: [
      { col1: "Thói quen, sự thật", col2: "Hành động đang làm lúc nói", col3: "He usually walks, but today he is riding a bike." },
      { col1: "everyday, always, often", col2: "now, look, at the moment", col3: "I study English on Monday. I am studying English now." }
    ],
    bullets: ["Không dùng thì tiếp diễn với các động từ chỉ cảm xúc/nhận thức: like, love, want, know, think."],
    examples: ["He often watches TV, but now he is reading a comic book.", "Do you know her? (Not: Are you knowing her?)"]
  },
  {
    id: 14, title: "Unit 14: Past Simple Be", gameType: "escape", gameName: "Dino Swamp Escape",
    formula: "S + was / were", explanation: "Thì quá khứ đơn của động từ 'To Be' dùng để diễn tả trạng thái, tính chất trong quá khứ.",
    tableHeaders: ["Subject Group", "Was/Were", "Example"],
    tableRows: [
      { col1: "I / He / She / It", col2: "was (wasn't)", col3: "I was at home yesterday." },
      { col1: "You / We / They", col2: "were (weren't)", col3: "They were happy last night." }
    ],
    bullets: ["Phủ định thêm 'not': S + wasn't / weren't.", "Dấu hiệu: yesterday, last night, last year, ago."],
    examples: ["Were you sick yesterday? No, I wasn't.", "She was in Hai Phong last Sunday."]
  },
  {
    id: 15, title: "Unit 15: Past Simple Regular and Irregular Verbs", gameType: "maze", gameName: "Ancient Pyramid Maze",
    formula: "S + V-ed / V2 (Irregular)", explanation: "Diễn tả hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ.",
    tableHeaders: ["Verb Type", "Past Form Rule", "Examples"],
    tableRows: [
      { col1: "Regular (Có quy tắc)", col2: "V + -ed", col3: "play ➔ played, watch ➔ watched" },
      { col1: "Irregular (Bất quy tắc)", col2: "V2 (Bảng ĐT BQT)", col3: "go ➔ went, eat ➔ ate, buy ➔ bought" }
    ],
    bullets: ["Phủ định dùng trợ động từ: S + did not (didn't) + V-inf.", "Câu hỏi: Did + S + V-inf...?", "Dấu hiệu: yesterday, ago, last week."],
    examples: ["I watched a movie yesterday.", "He didn't go to school. Did they eat pizza?"]
  },
  {
    id: 16, title: "Unit 16: Questions with Who, Whose, What", gameType: "battle", gameName: "Cyberpunk Duel",
    formula: "Who/Whose/What + Auxiliary + S + V?", explanation: "Dùng từ để hỏi (Wh-words) để lấy thông tin cụ thể về người, sở hữu, hoặc sự vật.",
    tableHeaders: ["Question Word", "Used For", "Example"],
    tableRows: [
      { col1: "Who", col2: "Hỏi về người (chủ ngữ/tân ngữ)", col3: "Who is that girl? Elsa." },
      { col1: "Whose", col2: "Hỏi về sở hữu", col3: "Whose bag is this? It's Toby's." },
      { col1: "What", col2: "Hỏi về sự vật, hoạt động", col3: "What are you doing? I'm writing." }
    ],
    bullets: ["Whose luôn đi kèm danh từ trực tiếp: Whose book is this?", "What có thể đi kèm danh từ: What time is it?"],
    examples: ["Who helped you? My dad.", "Whose crayons are those? They are Lily's."]
  },
  {
    id: 17, title: "Unit 17: Questions with Where, When, Why, How", gameType: "treasure", gameName: "Jungle Treasure Quest",
    formula: "Where/When/Why/How + Aux + S + V?", explanation: "Dùng để hỏi về nơi chốn, thời gian, lý do hoặc cách thức làm việc.",
    tableHeaders: ["Question Word", "Used For", "Example"],
    tableRows: [
      { col1: "Where", col2: "Nơi chốn, địa điểm", col3: "Where do you live? Hai Phong." },
      { col1: "When", col2: "Thời gian, khi nào", col3: "When is your birthday? In June." },
      { col1: "Why", col2: "Lý do, tại sao (Trả lời với Because)", col3: "Why are you sad? Because I lost my toy." },
      { col1: "How", col2: "Cách thức, trạng thái", col3: "How do you go to school? By bus." }
    ],
    bullets: ["Câu hỏi với Why thường được trả lời bắt đầu bằng 'Because...'.", "How có thể kết hợp với tính từ: How old, How tall."],
    examples: ["Where is my school bag? On the table.", "How do they feel? They are very happy."]
  },
  {
    id: 18, title: "Unit 18: Questions with How much, How many", gameType: "space", gameName: "Meteorite Dodge",
    formula: "How much + Uncountable / How many + Plural Countable", explanation: "Dùng để hỏi về số lượng hoặc giá tiền.",
    tableHeaders: ["Structure", "Used For", "Example"],
    tableRows: [
      { col1: "How many + Plural Noun", col2: "Hỏi số lượng đếm được", col3: "How many books have you got?" },
      { col1: "How much + Uncountable Noun", col2: "Hỏi lượng không đếm được", col3: "How much milk is left?" },
      { col1: "How much + is/are...", col2: "Hỏi giá tiền", col3: "How much is this red cap?" }
    ],
    bullets: ["How many luôn đi với danh từ số nhiều.", "How much có thể hỏi giá tiền của cả đồ vật số ít lẫn số nhiều."],
    examples: ["How many apples are there? Five.", "How much is the cake? It's 10 dollars."]
  },
  {
    id: 19, title: "Unit 19: Can, Could", gameType: "escape", gameName: "Ice Fortress Escape",
    formula: "S + can / could + V-base", explanation: "Diễn tả khả năng ở hiện tại (Can) hoặc quá khứ (Could), hoặc đưa ra lời xin phép.",
    tableHeaders: ["Modal Verb", "Usage", "Example"],
    tableRows: [
      { col1: "Can", col2: "Khả năng ở hiện tại", col3: "I can swim and play football." },
      { col1: "Could", col2: "Khả năng trong quá khứ", col3: "When I was five, I could ride a bike." },
      { col1: "Can I / Could I", col2: "Xin phép lịch sự", col3: "Could I have some water, please?" }
    ],
    bullets: ["Dạng phủ định là cannot (can't) hoặc could not (couldn't).", "Động từ theo sau LUÔN ở dạng nguyên thể không chia."],
    examples: ["She can't speak French, but she can speak English.", "Could they run fast when they were young? Yes, they could."]
  },
  {
    id: 20, title: "Unit 20: Must, Have to, Shall", gameType: "maze", gameName: "Volcano Labyrinth",
    formula: "S + must / S + have to + V-base", explanation: "Diễn tả sự bắt buộc, bổn phận (Must/Have to) hoặc đưa ra lời đề nghị giúp đỡ, gợi ý (Shall).",
    tableHeaders: ["Modal Verb", "Usage", "Example"],
    tableRows: [
      { col1: "Must", col2: "Bắt buộc từ cá nhân / Quy định", col3: "You must do your homework." },
      { col1: "Have to", col2: "Bắt buộc do hoàn cảnh khách quan", col3: "I have to wear a uniform at school." },
      { col1: "Shall we / I", col2: "Gợi ý, đề xuất lịch sự", col3: "Shall I carry this heavy bag for you?" }
    ],
    bullets: ["Mustn't diễn tả sự CẤM ĐOÁN (không được làm).", "Don't have to diễn tả KHÔNG CẦN THIẾT phải làm."],
    examples: ["You mustn't run inside the classroom!", "Shall we go to the beach tomorrow?"]
  },
  {
    id: 21, title: "Unit 21: Prepositions of Place and Time", gameType: "battle", gameName: "Sky Castle Battle",
    formula: "In / On / At + Place/Time", explanation: "Giới từ chỉ vị trí (nơi chốn) hoặc thời điểm diễn ra hành động.",
    tableHeaders: ["Preposition", "Place (Nơi chốn)", "Time (Thời gian)"],
    tableRows: [
      { col1: "In", col2: "Trong hộp, phòng, thành phố", col3: "Trong tháng, năm, buổi (in June, in 2026)" },
      { col1: "On", col2: "Trên bề mặt, đường phố", col3: "Ngày trong tuần, ngày lễ cụ thể (on Monday)" },
      { col1: "At", col2: "Tại địa điểm cụ thể", col3: "Giờ giấc, lễ tết chung (at 7 o'clock, at Christmas)" }
    ],
    bullets: ["Một số giới từ nơi chốn khác: under, next to, behind, in front of, between.", "At school, at home, in bed."],
    examples: ["The cat is sitting on the rug at home.", "I go to sleep at 9 PM on Sundays."]
  },
  {
    id: 22, title: "Unit 22: Indirect Objects", gameType: "treasure", gameName: "Sunken Galleon Search",
    formula: "S + V + Indirect Object (me/him...) + Direct Object", explanation: "Tân ngữ gián tiếp chỉ người nhận được đồ vật (tân ngữ trực tiếp) từ hành động.",
    tableHeaders: ["Structure Type", "Formula", "Example"],
    tableRows: [
      { col1: "Pattern 1 (No prep)", col2: "S + V + IO + DO", col3: "My mom gave me a beautiful toy." },
      { col1: "Pattern 2 (With prep)", col2: "S + V + DO + to/for + IO", col3: "My mom gave a beautiful toy to me." }
    ],
    bullets: ["Dùng giới từ 'to' với: give, send, lend, pass, show.", "Dùng 'for' với: buy, make, cook, get."],
    examples: ["Toby sent her a nice card.", "She bought a big chocolate cake for her brother."]
  },
  {
    id: 23, title: "Unit 23: Relative Pronouns", gameType: "space", gameName: "Orbit Rescue",
    formula: "Noun + Who / Which / Whose + Clause", explanation: "Đại từ quan hệ dùng để nối hai câu hoặc bổ nghĩa cho một danh từ đứng trước.",
    tableHeaders: ["Relative Pronoun", "Replaces (Thay thế cho)", "Example"],
    tableRows: [
      { col1: "Who", col2: "Người (Chủ ngữ / Tân ngữ)", col3: "This is the teacher who teaches English." },
      { col1: "Which", col2: "Đồ vật, con vật", col3: "I like the puppy which has brown ears." },
      { col1: "Whose", col2: "Sở hữu của người / vật", col3: "That is the boy whose dog was lost." }
    ],
    bullets: ["Who chỉ dùng cho người, Which cho vật.", "Whose chỉ sở hữu và đứng trước một danh từ khác."],
    examples: ["The girl who is playing the piano is Lily.", "The toy which is on the shelf is broken."]
  },
  {
    id: 24, title: "Unit 24: To + Base Form for Purpose", gameType: "escape", gameName: "Dungeon Flight",
    formula: "S + V + to + V-base (Chỉ mục đích)", explanation: "Dùng để giải thích tại sao một người thực hiện một hành động nào đó (Để làm gì).",
    tableHeaders: ["Action Clause", "Purpose Part", "Meaning in Vietnamese"],
    tableRows: [
      { col1: "I go to LeeGo Center", col2: "to learn English", col3: "Tôi đến LeeGo để học tiếng Anh." },
      { col1: "She opened the window", col2: "to let fresh air in", col3: "Cô ấy mở cửa để đón gió lành." }
    ],
    bullets: ["Nó tương đương với cụm từ 'in order to + V'.", "Không dùng giới từ 'for' trước động từ để chỉ mục đích (không nói: 'for learn')."],
    examples: ["He went to the kitchen to get a glass of water.", "We study hard to pass the exam."]
  },
  {
    id: 25, title: "Unit 25: Conjunctions", gameType: "maze", gameName: "Garden Labyrinth",
    formula: "Clause 1 + and / but / or / because + Clause 2", explanation: "Từ nối dùng để liên kết các từ, cụm từ hoặc mệnh đề lại với nhau.",
    tableHeaders: ["Conjunction", "Function", "Example"],
    tableRows: [
      { col1: "and", col2: "Thêm thông tin (Và)", col3: "I like oranges and bananas." },
      { col1: "but", col2: "Ý trái ngược (Nhưng)", col3: "He plays chess but he doesn't play soccer." },
      { col1: "or", col2: "Sự lựa chọn (Hoặc)", col3: "Would you like tea or milk?" },
      { col1: "because", col2: "Nguyên nhân (Bởi vì)", col3: "She went to bed because she was tired." }
    ],
    bullets: ["Dùng dấu phẩy trước but khi nối hai mệnh đề độc lập.", "Không bắt đầu câu nói trang trọng bằng các từ này, nhưng giao tiếp thường dùng."],
    examples: ["He is smart and friendly.", "I wanted to go out but it started to rain."]
  },
  {
    id: 26, title: "Unit 26: When Clauses", gameType: "battle", gameName: "Space Invaders",
    formula: "When + Clause 1, Clause 2 / Clause 2 + when + Clause 1", explanation: "Mệnh đề thời gian bắt đầu bằng 'When' diễn tả thời điểm một sự việc xảy ra.",
    tableHeaders: ["Clause Placement", "Punctuation (Dấu câu)", "Example"],
    tableRows: [
      { col1: "When-clause first", col2: "Có dấu phẩy ở giữa", col3: "When I arrive home, I take off my shoes." },
      { col1: "When-clause second", col2: "Không có dấu phẩy", col3: "I feel happy when I play with my dog." }
    ],
    bullets: ["Mệnh đề chứa 'when' làm nền tảng thời gian.", "Có thể dùng cả ở hiện tại lẫn quá khứ."],
    examples: ["When the rain stopped, the children ran outside.", "She always smiles when she sees her mother."]
  },
  {
    id: 27, title: "Unit 27: Comparatives and Superlatives", gameType: "treasure", gameName: "Mountain Peak Climb",
    formula: "Short Adj: Adj-er (than) / the Adj-est", explanation: "So sánh hơn (Comparative) dùng cho 2 đối tượng. So sánh nhất (Superlative) dùng cho từ 3 đối tượng trở lên.",
    tableHeaders: ["Adjective", "Comparative (Hơn)", "Superlative (Nhất)"],
    tableRows: [
      { col1: "tall", col2: "taller (taller than)", col3: "the tallest" },
      { col1: "big (gấp đôi g)", col2: "bigger (bigger than)", col3: "the biggest" },
      { col1: "happy (y ➔ i)", col2: "happier (happier than)", col3: "the happiest" }
    ],
    bullets: ["Always use 'than' after comparatives: Lucy is taller than Nick.", "Always use 'the' before superlatives: Mimi is the smallest kitten."],
    examples: ["A horse is bigger than a dog.", "He is the tallest boy in our classroom."]
  },
  {
    id: 28, title: "Unit 28: Adverbs", gameType: "space", gameName: "Hyperdrive Race",
    formula: "Adjective + -ly ➔ Adverb", explanation: "Trạng từ chỉ cách thức mô tả rõ hơn cách một động từ hành động được thực hiện.",
    tableHeaders: ["Adjective (Tính từ)", "Adverb (Trạng từ)", "Example in Sentence"],
    tableRows: [
      { col1: "quick", col2: "quickly", col3: "She runs quickly to school." },
      { col1: "happy", col2: "happily", col3: "The baby plays happily." },
      { col1: "good (Bất quy tắc)", col2: "well", col3: "He speaks English very well." },
      { col1: "fast / hard (Giữ nguyên)", col2: "fast / hard", col3: "He runs fast. She studies hard." }
    ],
    bullets: ["Tính từ bổ nghĩa cho danh từ.", "Trạng từ bổ nghĩa cho ĐỘNG TỪ, đứng sau động từ hoặc tân ngữ."],
    examples: ["She is a quiet girl. She speaks quietly.", "My father drives safely in the street."]
  }
];

// Append missing missions/units dynamically
export const dynamicSyllabus: Mission[] = [...officialSyllabus];

// Dynamically generate the remaining units and missions to maintain a 100% complete database of all 28 units and revisions
missingUnitsInfo.forEach(info => {
  const unit: SyllabusUnit = {
    id: info.id,
    title: info.title,
    type: "unit",
    gameType: info.gameType,
    gameName: info.gameName,
    snapshot: {
      formula: info.formula,
      explanation: info.explanation,
      tableHeaders: info.tableHeaders,
      tableRows: info.tableRows,
      bullets: info.bullets,
      examples: info.examples
    },
    questions: generateQuestionsForUnit(info.id, info.title)
  };

  // Find appropriate mission or create one
  let missionId = 3; // Mission 3 for Unit 7,8,9,10
  if (info.id >= 11 && info.id <= 13) missionId = 4;
  else if (info.id >= 14 && info.id <= 15) missionId = 5;
  else if (info.id >= 16 && info.id <= 18) missionId = 6;
  else if (info.id >= 19 && info.id <= 20) missionId = 7;
  else if (info.id === 21) missionId = 8;
  else if (info.id >= 22 && info.id <= 23) missionId = 9;
  else if (info.id >= 24 && info.id <= 26) missionId = 10;
  else if (info.id >= 27 && info.id <= 28) missionId = 11;

  let mission = dynamicSyllabus.find(m => m.id === missionId);
  if (!mission) {
    let title = `Mission ${missionId}`;
    if (missionId === 3) title = "Mission 3: Actions and Behaviours (Units 7–10)";
    else if (missionId === 4) title = "Mission 4: Current Actions (Units 11–13)";
    else if (missionId === 5) title = "Mission 5: Past Memories (Units 14–15)";
    else if (missionId === 6) title = "Mission 6: Smart Questions (Units 16–18)";
    else if (missionId === 7) title = "Mission 7: Powers and Duties (Units 19–20)";
    else if (missionId === 8) title = "Mission 8: Spaces and Times (Unit 21)";
    else if (missionId === 9) title = "Mission 9: Giving and Connecting (Units 22–23)";
    else if (missionId === 10) title = "Mission 10: Purpose and Timelines (Units 24–26)";
    else if (missionId === 11) title = "Mission 11: Comparisons and Descriptions (Units 27–28)";

    mission = { id: missionId, title, items: [] };
    dynamicSyllabus.push(mission);
  }

  mission.items.push(unit);
});

// Let's sort the missions array to make sure everything matches the correct order
dynamicSyllabus.sort((a, b) => a.id - b.id);

// Add mini-revisions and full revisions to their respective missions!
function addRevisions() {
  // Mission 3 Mini Revision and Revision 2
  const m3 = dynamicSyllabus.find(m => m.id === 3);
  if (m3 && m3.items.length === 4) {
    m3.items.push({
      id: "mini-7-10" as any,
      title: "Mini Revision: Units 7–10",
      type: "mini_revision",
      coveredUnits: "Units 7–10",
      grammarQuestions: generateQuestionsForUnit(100, "Units 7-10"),
      readingChallenge: {
        title: "Toby's Super Powers",
        passage: "Toby is ten years old. He has got a super power! He can speak three languages: English, Vietnamese, and French. He enjoys learning English at LeeGo English Center in Hai Phong. Today, Toby wants to tell his friends a story. He says, 'Look at my dog! It has got green eyes. Don't touch its bone, or it will bark! Let's go and feed it now.' Toby and his friends are having a wonderful time in the room.",
        questions: [
          { id: 1, question: "How old is Toby?", options: ["Eight", "Ten", "Nine", "Seven"], answer: "Ten" },
          { id: 2, question: "What super power does Toby have?", options: ["He can fly", "He can speak three languages", "He can swim super fast", "He has got a laser toy"], answer: "He can speak three languages" },
          { id: 3, question: "Where does he learn English?", options: ["At home", "At school", "At LeeGo English Center", "At the library"], answer: "At LeeGo English Center" },
          { id: 4, question: "What has his dog got?", options: ["Blue eyes", "Green eyes", "Red ball", "Yellow bone"], answer: "Green eyes" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "Have got practice",
          prompt: "Write a sentence describing a special pet or toy you have got, using 'has got' or 'have got'.",
          helperWords: ["have got", "teddy bear", "favorite"],
          sampleAnswer: "I have got a beautiful brown teddy bear on my bed."
        },
        {
          id: 2,
          type: "picture",
          title: "Let's Play",
          prompt: "Write a sentence using 'Let's' to invite friends to play soccer.",
          helperWords: ["Let's", "play soccer", "weekend"],
          sampleAnswer: "Let's play soccer in the park this weekend."
        }
      ]
    });
    m3.items.push({
      id: "rev-7-10" as any,
      title: "Revision 2: My Day and Rules (Units 7–10)",
      type: "revision",
      coveredUnits: "Units 7–10",
      grammarQuestions: generateQuestionsForUnit(200, "Units 7-10 Mixed"),
      readingChallenge: {
        title: "Rules of the Classroom",
        passage: "Welcome to LeeGo English Center! In our classroom, we have some important rules to keep us safe. First, listen to your teacher when they speak. Second, don't talk when another student is presenting. Third, raise your hand if you want to say something. Let's make our class fun and tidy! We enjoy learning English together every day.",
        questions: [
          { id: 1, question: "What center is described in the passage?", options: ["Hai Phong School", "LeeGo English Center", "Oxford Course", "Grammar Land"], answer: "LeeGo English Center" },
          { id: 2, question: "Who should you listen to when they speak?", options: ["Your classmates", "Your teacher", "Nobody", "The principal"], answer: "Your teacher" },
          { id: 3, question: "What is the third rule?", options: ["Clean the desk", "Don't talk", "Raise your hand", "Close the book"], answer: "Raise your hand" },
          { id: 4, question: "Are they happy learning together?", options: ["Yes, they enjoy it", "No, they hate it", "They are scared", "They are angry"], answer: "Yes, they enjoy it" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "Making Suggestions",
          prompt: "Write a suggestion starting with 'Let's' to invite your friends to play a game after class.",
          helperWords: ["Let's", "play", "game"],
          sampleAnswer: "Let's play computer games together after our English class!"
        },
        {
          id: 2,
          type: "situation",
          title: "My Special Pet",
          prompt: "Write a sentence describing what special pet you have got.",
          helperWords: ["have got", "cute kitten", "fluffy"],
          sampleAnswer: "I have got a cute kitten with fluffy tail."
        }
      ]
    });
  }

  // Mission 4 Mini Revision
  const m4 = dynamicSyllabus.find(m => m.id === 4);
  if (m4 && m4.items.length === 3) {
    m4.items.push({
      id: "mini-11-13" as any,
      title: "Mini Revision: Units 11–13",
      type: "mini_revision",
      coveredUnits: "Units 11–13",
      grammarQuestions: generateQuestionsForUnit(300, "Present Simple and Continuous"),
      readingChallenge: {
        title: "Lucy's Lazy Sunday",
        passage: "Lucy usually gets up early on Sundays. She often eats breakfast with her parents, and then she walks her dog in the park. But today is a lazy day. Lucy is sitting on the sofa right now. She is watching her favorite cartoon, and her dog is sleeping next to her. She isn't walking in the park today because it is raining heavily outside.",
        questions: [
          { id: 1, question: "What does Lucy usually do on Sundays?", options: ["Gets up early", "Sleeps all day", "Goes to school", "Does homework"], answer: "Gets up early" },
          { id: 2, question: "What is Lucy doing right now?", options: ["Walking her dog", "Sitting on the sofa and watching a cartoon", "Eating breakfast", "Playing tennis"], answer: "Sitting on the sofa and watching a cartoon" },
          { id: 3, question: "Why isn't she walking her dog today?", options: ["She is tired", "It is raining heavily", "Her dog is sick", "She lost her keys"], answer: "It is raining heavily" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "paragraph",
          title: "My Sunday Routine",
          prompt: "Write 2-3 sentences about what you usually do on Sundays, and what you are doing right now.",
          helperWords: ["usually", "now", "at home"],
          sampleAnswer: "On Sundays, I usually play football in the morning. Right now, I am studying English at my desk."
        },
        {
          id: 2,
          type: "picture",
          title: "What are they doing?",
          prompt: "Write a sentence describing what they are doing in the kitchen.",
          helperWords: ["they", "cooking", "kitchen"],
          sampleAnswer: "They are cooking delicious dinner in the kitchen."
        }
      ]
    });
  }

  // Mission 5 Mini Revision and Revision 3
  const m5 = dynamicSyllabus.find(m => m.id === 5);
  if (m5 && m5.items.length === 2) {
    m5.items.push({
      id: "mini-14-15" as any,
      title: "Mini Revision: Units 14–15",
      type: "mini_revision",
      coveredUnits: "Units 14–15",
      grammarQuestions: generateQuestionsForUnit(400, "Past Simple"),
      readingChallenge: {
        title: "A Trip to the Beach",
        passage: "Last Saturday, Bill and Nick went to Cat Ba Beach in Hải Phòng. The weather was beautiful. There were many people swimming in the sea. Bill ate a big ice cream, and Nick built a beautiful sandcastle. They swam in the water for two hours. They came back home in the evening. They were very tired, but they had an amazing trip.",
        questions: [
          { id: 1, question: "Where did Bill and Nick go last Saturday?", options: ["To Cat Ba Beach", "To the cinema", "To school", "To the library"], answer: "To Cat Ba Beach" },
          { id: 2, question: "What did Nick build?", options: ["A castle of toys", "A sandcastle", "A wooden boat", "A green house"], answer: "A sandcastle" },
          { id: 3, question: "How long did they swim?", options: ["One hour", "Two hours", "All day", "Thirty minutes"], answer: "Two hours" },
          { id: 4, question: "Were they sad in the evening?", options: ["Yes, they were", "No, they were tired but happy", "They were angry", "They were crying"], answer: "No, they were tired but happy" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "What did you do?",
          prompt: "Write a sentence in Past Simple about what you did yesterday evening.",
          helperWords: ["watched", "played", "yesterday"],
          sampleAnswer: "Yesterday evening, I watched a funny movie with my parents."
        },
        {
          id: 2,
          type: "situation",
          title: "My Weekend",
          prompt: "Write a sentence in Past Simple about where you went last Sunday.",
          helperWords: ["went", "zoo", "family"],
          sampleAnswer: "I went to the zoo with my family last Sunday."
        }
      ]
    });
    m5.items.push({
      id: "rev-11-15" as any,
      title: "Revision 3: Routines and Memories (Units 11–15)",
      type: "revision",
      coveredUnits: "Units 11–15",
      grammarQuestions: generateQuestionsForUnit(500, "Units 11-15 Mixed"),
      readingChallenge: {
        title: "Nick's Diary",
        passage: "I usually live a busy life. Every day, I walk to school, and I study hard. Yesterday was a special holiday. I didn't go to school. My family visited Do Son beach in Hai Phong. We took a lot of photos, and my sister ate some fresh seafood. At the moment, I am writing this in my diary, and Mimi, my kitten, is playing with a yarn ball next to me. Life is beautiful!",
        questions: [
          { id: 1, question: "How does Nick usually go to school?", options: ["By bus", "He walks", "By bike", "By car"], answer: "He walks" },
          { id: 2, question: "Where did Nick's family go yesterday?", options: ["Do Son beach", "Cat Ba Island", "LeeGo Center", "Hanoi City"], answer: "Do Son beach" },
          { id: 3, question: "What is Nick doing at the moment?", options: ["Sleeping", "Studying English", "Writing in his diary", "Swimming"], answer: "Writing in his diary" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "paragraph",
          title: "My Diary Entry",
          prompt: "Write a brief diary entry (2-3 sentences) describing something special you did last week and what you are doing now.",
          helperWords: ["last week", "visited", "now", "learning"],
          sampleAnswer: "Last week, I visited my grandparents in the countryside. Now, I am sitting in my room learning English."
        },
        {
          id: 2,
          type: "picture",
          title: "A Past Activity",
          prompt: "Write a sentence in Past Simple about what you bought yesterday.",
          helperWords: ["bought", "new toy", "yesterday"],
          sampleAnswer: "I bought a new toy car at the store yesterday."
        }
      ]
    });
  }

  // Mission 6 Revision 4
  const m6 = dynamicSyllabus.find(m => m.id === 6);
  if (m6 && m6.items.length === 3) {
    m6.items.push({
      id: "rev-16-18" as any,
      title: "Revision 4: Asking Questions (Units 16–18)",
      type: "revision",
      coveredUnits: "Units 16–18",
      grammarQuestions: generateQuestionsForUnit(600, "Units 16-18 Mixed"),
      readingChallenge: {
        title: "The School Survey",
        passage: "Today, Bill is doing a class survey. He asks Elsa, 'Who is your English teacher?' Elsa replies, 'Miss Linh at LeeGo Center.' Then Bill asks, 'Whose bag is that on the floor?' Elsa says, 'It's Toby's.' Bill also asks, 'How many students are there in our class today?' Elsa counts them, 'There are twenty students.' Bill is very happy with his survey.",
        questions: [
          { id: 1, question: "Who is doing a class survey?", options: ["Elsa", "Bill", "Toby", "Miss Linh"], answer: "Bill" },
          { id: 2, question: "Who is Elsa's English teacher?", options: ["Miss Linh", "Mr. Nick", "Bill's mother", "Lucy"], answer: "Miss Linh" },
          { id: 3, question: "How many students are there in the class today?", options: ["Ten", "Fifteen", "Twenty", "Thirty"], answer: "Twenty" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "Asking a Friend",
          prompt: "Write a question using 'Where' or 'How many' to ask a friend about their books.",
          helperWords: ["How many", "books", "have you got"],
          sampleAnswer: "How many English books have you got in your desk?"
        },
        {
          id: 2,
          type: "situation",
          title: "Where did you go?",
          prompt: "Write a question to ask where your friend went yesterday.",
          helperWords: ["where", "did you go", "yesterday"],
          sampleAnswer: "Where did you go with your family yesterday?"
        }
      ]
    });
  }

  // Mission 7 Revision 5
  const m7 = dynamicSyllabus.find(m => m.id === 7);
  if (m7 && m7.items.length === 2) {
    m7.items.push({
      id: "rev-19-20" as any,
      title: "Revision 5: Powers and Rules (Units 19–20)",
      type: "revision",
      coveredUnits: "Units 19–20",
      grammarQuestions: generateQuestionsForUnit(700, "Units 19-20 Mixed"),
      readingChallenge: {
        title: "The Sports Club",
        passage: "Bill joined the LeeGo Sports Club. At the club, there are several strict rules they must follow. First, they must wear sports shoes. They mustn't run around the swimming pool because it is slippery. Elsa can swim very fast, but Bill can't. Bill could not swim when he was eight, but now he can! Today, Elsa says, 'Shall we play a game of tennis?' Bill says, 'Yes, let's do it!'",
        questions: [
          { id: 1, question: "What must members wear at the sports club?", options: ["Uniforms", "Sports shoes", "Caps", "Sandals"], answer: "Sports shoes" },
          { id: 2, question: "What mustn't they do around the pool?", options: ["Swim", "Run around", "Talk", "Sit"], answer: "Run around" },
          { id: 3, question: "Could Bill swim when he was eight?", options: ["Yes, he could", "No, he couldn't", "He can't now", "He hates swimming"], answer: "No, he couldn't" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "Rules at School",
          prompt: "Write a sentence using 'must' or 'mustn't' to describe a rule in your classroom.",
          helperWords: ["must", "listen", "teacher"],
          sampleAnswer: "We must listen quietly to our teacher in the classroom."
        },
        {
          id: 2,
          type: "picture",
          title: "Healthy Advice",
          prompt: "Write a sentence using 'should' to give health advice to your friend.",
          helperWords: ["should", "drink", "more water"],
          sampleAnswer: "You should drink more water every day to stay healthy."
        }
      ]
    });
  }

  // Mission 8 Revision 6
  const m8 = dynamicSyllabus.find(m => m.id === 8);
  if (m8 && m8.items.length === 1) {
    m8.items.push({
      id: "rev-21" as any,
      title: "Revision 6: Spaces and Times (Unit 21)",
      type: "revision",
      coveredUnits: "Unit 21",
      grammarQuestions: generateQuestionsForUnit(800, "Unit 21 Mixed"),
      readingChallenge: {
        title: "A Busy Saturday",
        passage: "On Saturday morning, Nick gets up at 7 o'clock. He puts his schoolbooks in his bag. His bag is on the desk in his bedroom. At 8 o'clock, Nick goes to LeeGo Center in Hai Phong. His class starts in June, and it is very exciting. He sits next to Elsa in the classroom. In front of them, there is a big white screen.",
        questions: [
          { id: 1, question: "What time does Nick get up?", options: ["6 o'clock", "7 o'clock", "8 o'clock", "9 o'clock"], answer: "7 o'clock" },
          { id: 2, question: "Where is Nick's schoolbag?", options: ["Under the bed", "On the desk", "In the garden", "Next to the sofa"], answer: "On the desk" },
          { id: 3, question: "Who does Nick sit next to?", options: ["Lucy", "Elsa", "Toby", "Bill"], answer: "Elsa" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "My Prepositions",
          prompt: "Write a sentence using 'on' or 'at' to tell what time you do your homework with your notebook placed on the table.",
          helperWords: ["at 7 PM", "on the table"],
          sampleAnswer: "I do my homework at 7 PM with my notebook placed on the table."
        },
        {
          id: 2,
          type: "picture",
          title: "Where is the cat?",
          prompt: "Write a sentence using 'under' or 'next to' to describe where your cat is sleeping.",
          helperWords: ["cat", "sleeping", "under the chair"],
          sampleAnswer: "My little cat is sleeping under the chair in the living room."
        }
      ]
    });
  }

  // Mission 9 Mini Revision
  const m9 = dynamicSyllabus.find(m => m.id === 9);
  if (m9 && m9.items.length === 2) {
    m9.items.push({
      id: "mini-22-23" as any,
      title: "Mini Revision: Units 22–23",
      type: "mini_revision",
      coveredUnits: "Units 22–23",
      grammarQuestions: generateQuestionsForUnit(900, "Indirect Objects and Relative Pronouns"),
      readingChallenge: {
        title: "Gifts for Friends",
        passage: "Yesterday, Lucy bought a beautiful book for Toby. Toby is the boy who is very nice to Elsa. Elsa made a delicious cookie for Lucy. The cookie which Elsa made had chocolate chips inside. They gave their gifts to each other in the library. They were very happy with their friendly sharing.",
        questions: [
          { id: 1, question: "What did Lucy buy for Toby?", options: ["A toy car", "A beautiful book", "A ball", "A crayon"], answer: "A beautiful book" },
          { id: 2, question: "Who is Toby?", options: ["A boy who is Elsa's teacher", "A boy who is very nice to Elsa", "Lucy's brother", "Nick's dog"], answer: "A boy who is very nice to Elsa" },
          { id: 3, question: "What was inside Elsa's cookie?", options: ["Strawberries", "Chocolate chips", "Butter", "Apples"], answer: "Chocolate chips" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "My Relative Pronouns",
          prompt: "Write a sentence using 'who' to describe your English teacher.",
          helperWords: ["teacher who", "teaches us"],
          sampleAnswer: "Miss Linh is the teacher who teaches us English at LeeGo."
        },
        {
          id: 2,
          type: "situation",
          title: "Describing a Book",
          prompt: "Write a sentence using 'which' or 'that' to describe a book you bought.",
          helperWords: ["book which", "bought", "interesting"],
          sampleAnswer: "This is the book which I bought at the shop."
        }
      ]
    });
  }

  // Mission 10 Mini Revision and Revision 7
  const m10 = dynamicSyllabus.find(m => m.id === 10);
  if (m10 && m10.items.length === 3) {
    m10.items.push({
      id: "mini-24-26" as any,
      title: "Mini Revision: Units 24–26",
      type: "mini_revision",
      coveredUnits: "Units 24–26",
      grammarQuestions: generateQuestionsForUnit(1000, "Purpose and Clauses"),
      readingChallenge: {
        title: "Toby's Mission",
        passage: "Toby went to the market to buy some vegetables. He bought carrots and potatoes because his mother wanted to make a tasty soup. He came back home quickly. When he entered the kitchen, his mother smiled and gave him a glass of orange juice. He was happy to help.",
        questions: [
          { id: 1, question: "Why did Toby go to the market?", options: ["To buy some toys", "To buy some vegetables", "To play with Elsa", "To find his dog"], answer: "To buy some vegetables" },
          { id: 2, question: "Why did his mother want vegetables?", options: ["To make a cake", "To make a tasty soup", "To feed the rabbit", "To clean the table"], answer: "To make a tasty soup" },
          { id: 3, question: "What did his mother do when he entered the kitchen?", options: ["She cried", "She smiled and gave him orange juice", "She scolded him", "She went out"], answer: "She smiled and gave him orange juice" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "To for Purpose",
          prompt: "Write a sentence using 'to' + base verb to describe why you go to LeeGo English Center.",
          helperWords: ["go to LeeGo", "to learn", "grammar"],
          sampleAnswer: "I go to LeeGo Center to learn English grammar."
        },
        {
          id: 2,
          type: "picture",
          title: "Reason for Study",
          prompt: "Write a sentence using 'because' to explain why you study hard.",
          helperWords: ["study hard", "because", "want to pass"],
          sampleAnswer: "I study hard because I want to pass my English exam."
        }
      ]
    });
    m10.items.push({
      id: "rev-22-26" as any,
      title: "Revision 7: Connecting Ideas (Units 22–26)",
      type: "revision",
      coveredUnits: "Units 22–26",
      grammarQuestions: generateQuestionsForUnit(1100, "Units 22-26 Mixed"),
      readingChallenge: {
        title: "The Friendship Project",
        passage: "At LeeGo Center, Bill made a colorful card to give to his friend Toby. Toby is the boy who sat next to Bill on Monday. Bill used crayons and stickers because he wanted the card to look beautiful. When Toby received the card, he said 'thank you' and bought a sweet donut for Bill. They are best friends.",
        questions: [
          { id: 1, question: "What did Bill make?", options: ["A toy boat", "A colorful card", "A sandwich", "A sandcastle"], answer: "A colorful card" },
          { id: 2, question: "Who is Toby?", options: ["A boy who sat next to Bill", "Their teacher", "A big puppy", "Toby's father"], answer: "A boy who sat next to Bill" },
          { id: 3, question: "What did Toby buy for Bill?", options: ["A pencil", "A sweet donut", "A toy car", "A book"], answer: "A sweet donut" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "Friendship Description",
          prompt: "Write a sentence about your best friend using 'who'.",
          helperWords: ["friend who", "nice", "shares"],
          sampleAnswer: "Toby is a nice boy who always shares his toys."
        },
        {
          id: 2,
          type: "situation",
          title: "Going out for Purpose",
          prompt: "Write a sentence using 'to' + V-inf to describe why you went to the store.",
          helperWords: ["went to store", "to buy", "milk"],
          sampleAnswer: "I went to the store to buy some fresh milk."
        }
      ]
    });
  }

  // Mission 11 Revision 8 and Final Revision
  const m11 = dynamicSyllabus.find(m => m.id === 11);
  if (m11 && m11.items.length === 2) {
    m11.items.push({
      id: "rev-27-28" as any,
      title: "Revision 8: Descriptions (Units 27–28)",
      type: "revision",
      coveredUnits: "Units 27–28",
      grammarQuestions: generateQuestionsForUnit(1200, "Units 27-28 Mixed"),
      readingChallenge: {
        title: "The Great Animal Race",
        passage: "Yesterday in the forest, the cheetah ran very quickly. It is the fastest animal in the forest. The elephant walked slowly because it is the heaviest animal. The puppy ran happily and barked loudly at the birds. Everyone enjoyed the sunny day in the green woods.",
        questions: [
          { id: 1, question: "How did the cheetah run?", options: ["Slowly", "Very quickly", "Sad", "Badly"], answer: "Very quickly" },
          { id: 2, question: "Which animal is the heaviest?", options: ["Cheetah", "Elephant", "Puppy", "Rabbit"], answer: "Elephant" },
          { id: 3, question: "How did the puppy run?", options: ["Happily", "Slowly", "Angrily", "Sad"], answer: "Happily" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "My Adverbs",
          prompt: "Write a sentence using an adverb to describe how you play piano, read books, or play sports.",
          helperWords: ["well", "play", "football", "pitch"],
          sampleAnswer: "I play football very well on the green pitch."
        },
        {
          id: 2,
          type: "picture",
          title: "How do you study?",
          prompt: "Write a sentence using 'carefully' to describe how you do your exam.",
          helperWords: ["do exam", "carefully", "always"],
          sampleAnswer: "I always do my English exam carefully to get good marks."
        }
      ]
    });
    m11.items.push({
      id: "final-revision" as any,
      title: "Final Revision: LeeGo Grammar Champion (All Units)",
      type: "final_revision",
      coveredUnits: "All Units 1–28",
      grammarQuestions: generateQuestionsForUnit(1300, "All Grammar Mixed"),
      readingChallenge: {
        title: "The LeeGo Center Champion",
        passage: "Toby has completed all twenty-eight units in the Grammar Explorer AI Course! He is now the official LeeGo Grammar Champion in Hải Phòng. He studied hard every week because he wanted to speak English fluently. He can write correct sentences, read Movers stories, and speak English with his teachers very well. His parents gave him a beautiful gold medal and a book. Toby is extremely proud of himself!",
        questions: [
          { id: 1, question: "How many units has Toby completed?", options: ["Ten", "Twenty", "Twenty-eight", "Thirty"], answer: "Twenty-eight" },
          { id: 2, question: "What is Toby's new title?", options: ["School Captain", "LeeGo Grammar Champion", "Space Explorer", "Reading Helper"], answer: "LeeGo Grammar Champion" },
          { id: 3, question: "Why did Toby study hard every week?", options: ["Because his parents forced him", "Because he wanted to speak English fluently", "To buy a computer", "To play games"], answer: "Because he wanted to speak English fluently" },
          { id: 4, question: "What did Toby's parents give him?", options: ["A computer", "A gold medal and a book", "A teddy bear", "A kitten"], answer: "A gold medal and a book" }
        ]
      },
      writingChallenge: [
        {
          id: 1,
          type: "sentence",
          title: "My Grammar Explorer Journey",
          prompt: "Write a sentence describing what you can do now after learning English grammar.",
          helperWords: ["happy because", "write", "now"],
          sampleAnswer: "I am happy because I can write correct English sentences now."
        },
        {
          id: 2,
          type: "paragraph",
          title: "Grammar Explorer Success",
          prompt: "Write a sentence about what you will do next to keep practicing English.",
          helperWords: ["will", "practice", "every day"],
          sampleAnswer: "I will practice reading English books every day to learn more."
        }
      ]
    });
  }
}

addRevisions();
