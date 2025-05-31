import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// Sample English-Japanese phrase pairs
const dummyNotePairs = [
  // Short phrases
  { english: "Good morning", japanese: "おはようございます" },
  { english: "Thank you very much", japanese: "ありがとうございます" },
  { english: "Excuse me", japanese: "すみません" },
  { english: "I'm sorry", japanese: "ごめんなさい" },
  { english: "Nice to meet you", japanese: "はじめまして" },
  { english: "How are you?", japanese: "元気ですか？" },
  { english: "I'm fine", japanese: "元気です" },
  { english: "What's your name?", japanese: "お名前は何ですか？" },
  { english: "My name is...", japanese: "私の名前は...です" },
  { english: "Where are you from?", japanese: "どちらの出身ですか？" },
  { english: "I'm from America", japanese: "アメリカ出身です" },
  { english: "Do you speak English?", japanese: "英語を話しますか？" },
  { english: "I don't understand", japanese: "わかりません" },
  { english: "Please speak slowly", japanese: "ゆっくり話してください" },
  { english: "Can you help me?", japanese: "手伝ってもらえますか？" },
  { english: "Where is the bathroom?", japanese: "トイレはどこですか？" },
  { english: "How much is this?", japanese: "これはいくらですか？" },
  { english: "I would like...", japanese: "...をお願いします" },
  { english: "The weather is nice", japanese: "天気がいいですね" },
  { english: "It's raining", japanese: "雨が降っています" },
  { english: "I'm hungry", japanese: "お腹が空いています" },
  { english: "This is delicious", japanese: "これは美味しいです" },
  { english: "I'm tired", japanese: "疲れています" },
  { english: "See you tomorrow", japanese: "また明日" },
  { english: "Have a good day", japanese: "良い一日を" },
  { english: "What time is it?", japanese: "今何時ですか？" },
  { english: "I'm learning Japanese", japanese: "日本語を勉強しています" },
  { english: "This is difficult", japanese: "これは難しいです" },
  { english: "Let's go", japanese: "行きましょう" },
  { english: "Wait a moment", japanese: "ちょっと待ってください" },
  { english: "I like sushi", japanese: "寿司が好きです" },
  { english: "Where do you live?", japanese: "どこに住んでいますか？" },
  { english: "I live in Tokyo", japanese: "東京に住んでいます" },
  { english: "Do you have time?", japanese: "時間はありますか？" },
  { english: "I'm busy", japanese: "忙しいです" },
  { english: "What's this?", japanese: "これは何ですか？" },
  { english: "I don't know", japanese: "知りません" },
  { english: "That's interesting", japanese: "それは面白いですね" },
  { english: "I agree", japanese: "同感です" },
  { english: "No problem", japanese: "問題ありません" },
  { english: "You're welcome", japanese: "どういたしまして" },
  { english: "Congratulations", japanese: "おめでとうございます" },
  { english: "Happy birthday", japanese: "誕生日おめでとう" },
  { english: "Good luck", japanese: "頑張って" },
  { english: "Take care", japanese: "気をつけて" },
  { english: "I miss you", japanese: "あなたが恋しいです" },
  { english: "I love you", japanese: "愛しています" },
  { english: "Be careful", japanese: "注意してください" },
  { english: "It's hot today", japanese: "今日は暑いです" },
  { english: "It's cold", japanese: "寒いです" },
  { english: "I need help", japanese: "助けが必要です" },

  // Longer phrases and sentences
  { english: "Could you please tell me how to get to the nearest train station from here?", japanese: "ここから一番近い駅への行き方を教えていただけませんか？" },
  { english: "I'm looking for a restaurant that serves authentic Japanese cuisine at a reasonable price.", japanese: "リーズナブルな価格で本格的な日本料理を提供するレストランを探しています。" },
  { english: "The cherry blossoms are in full bloom and the scenery is absolutely breathtaking this time of year.", japanese: "桜が満開で、この時期の景色は本当に息をのむほど美しいです。" },
  { english: "I've been studying Japanese for three years, but I still find it challenging to express complex ideas.", japanese: "日本語を3年間勉強していますが、複雑な考えを表現するのはまだ難しいと感じています。" },
  { english: "Would it be possible to schedule a meeting for next Tuesday afternoon around two o'clock?", japanese: "来週火曜日の午後2時頃に会議の予定を入れることは可能でしょうか？" },
  { english: "The technology conference was incredibly informative and I learned about many innovative solutions.", japanese: "技術会議は非常に有益で、多くの革新的なソリューションについて学ぶことができました。" },
  { english: "My hometown is famous for its beautiful mountains, clear rivers, and friendly people.", japanese: "私の故郷は美しい山々、澄んだ川、そして親切な人々で有名です。" },
  { english: "I really appreciate your patience while I practice speaking Japanese with you today.", japanese: "今日、あなたと日本語の会話練習をしている間、忍耐強く付き合ってくれて本当に感謝しています。" },
  { english: "The weather forecast says it will be sunny tomorrow, so let's plan a picnic in the park.", japanese: "天気予報では明日は晴れということなので、公園でピクニックを計画しましょう。" },
  { english: "I'm having difficulty understanding the cultural differences between my country and Japan.", japanese: "私の国と日本の文化の違いを理解するのに苦労しています。" },
  { english: "Could you recommend a good book about Japanese history that's suitable for beginners?", japanese: "初心者に適した日本史についての良い本を推薦していただけませんか？" },
  { english: "The presentation went very well and everyone seemed interested in our new product proposal.", japanese: "プレゼンテーションは非常にうまくいき、皆が私たちの新製品提案に興味を示しているようでした。" },
  { english: "I enjoy cooking traditional dishes from various countries and learning about different cultures.", japanese: "さまざまな国の伝統的な料理を作り、異なる文化について学ぶことを楽しんでいます。" },
  { english: "The train was delayed due to heavy snow, so I arrived at the office thirty minutes late.", japanese: "大雪のため電車が遅れ、オフィスに30分遅れて到着しました。" },
  { english: "My dream is to travel around the world and experience different cultures and cuisines.", japanese: "私の夢は世界中を旅して、さまざまな文化や料理を体験することです。" },
  { english: "The museum exhibition about ancient Japanese art was fascinating and very educational.", japanese: "古代日本美術についての博物館の展示は魅力的で、とても教育的でした。" },
  { english: "I'm grateful for the opportunity to work with such a talented and dedicated team.", japanese: "このような才能豊かで献身的なチームと働く機会をいただけて感謝しています。" },
  { english: "Learning a foreign language requires consistent practice and patience with yourself.", japanese: "外国語を学ぶには、継続的な練習と自分自身への忍耐が必要です。" },
  { english: "The festival was crowded but the atmosphere was lively and everyone seemed to be enjoying themselves.", japanese: "祭りは混雑していましたが、雰囲気は活気に満ちており、皆楽しんでいるようでした。" },
  { english: "I'm planning to take a vacation next month and visit some famous temples and shrines in Kyoto.", japanese: "来月休暇を取って、京都の有名な寺院や神社をいくつか訪れる予定です。" }
];

export async function generateDummyNotes(userId: string, count: number = 20) {
  if (!db) {
    throw new Error("Database not available");
  }

  const promises = [];
  
  for (let i = 0; i < count; i++) {
    // Get a random note pair
    const randomPair = dummyNotePairs[Math.floor(Math.random() * dummyNotePairs.length)];
    
    // Create note document
    const noteData = {
      userId,
      content1: randomPair.english,
      content2: randomPair.japanese,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdOffline: false,
    };

    promises.push(addDoc(collection(db, "notes"), noteData));
  }

  try {
    await Promise.all(promises);
    console.log(`Successfully created ${count} dummy notes`);
  } catch (error) {
    console.error("Error creating dummy notes:", error);
    throw error;
  }
}