const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.YASH_ENV_KEY,
});
const { ChatOpenAI } = require("@langchain/openai");
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages");

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 1,
  maxTokens: 512,
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt =
  "You are an AI instructor teaching the student to drive. Answer any questions thoroughly and helpfully. You should be bright and cheerful.";

const textToTextResponse = async (userMessage, history) => {
  try {
    const chatHistory = [
      new SystemMessage({
        content: prompt,
      }),
    ];
    const formatMessage = (role, content) => {
      console.log(role, content);
      if (role === "ai") {
        return new AIMessage({ content });
      }
      return new HumanMessage({ content });
    };
    history.slice(-10).forEach(({ user, text }) => {
      return chatHistory.push(formatMessage(user.name, text));
    });
    if (userMessage.trim() !== "" && userMessage) {
      chatHistory.push(formatMessage("user", userMessage));
    }
    const res = await model.invoke(chatHistory);
    return res.content;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const textEndpoint = async (req, res) => {
  const { message, history } = req.body;
  try {
    const textResponse = await textToTextResponse(message, history);
    return res.status(200).json({
      response: textResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

const yashChat = async (req, res) => {
  const { message } = req.body;
  try {
    console.log("rrun");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI instructor teaching the student to drive. Answer any questions thoroughly and helpfully. You should be bright and cheerful.",
        },
        { role: "user", content: message },
      ],
      model: "ft:gpt-4o-mini-2024-07-18:personal:drivebot:AAEBYoLS",
    });

    // Log and send the AI's response
    const receivedMessage = completion.choices[0].message.content;
    console.log(receivedMessage);
    return res.status(200).json({
      response: receivedMessage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

module.exports = { textEndpoint, yashChat };
