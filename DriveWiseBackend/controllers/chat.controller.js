// Load environment variables from a .env file
require("dotenv").config(); // https://www.npmjs.com/package/dotenv

// Import PDFLoader to load PDF documents
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf"); // https://github.com/hwchase17/langchainjs

// Import RecursiveCharacterTextSplitter to split text into chunks
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter"); // https://js.langchain.com/docs/modules/indexes/text_splitter/

// Import OpenAIEmbeddings to generate embeddings using OpenAI
const { OpenAIEmbeddings } = require("@langchain/openai"); // https://js.langchain.com/docs/modules/indexes/embeddings/

// Import Pinecone client for vector database operations
const { Pinecone } = require("@pinecone-database/pinecone"); // https://www.pinecone.io/docs/quickstart/

// Import PineconeStore to interact with Pinecone using LangChain
const { PineconeStore } = require("@langchain/pinecone"); // https://js.langchain.com/docs/modules/indexes/vector_stores/pinecone

// Import ChatPromptTemplate for creating chat prompts
const { ChatPromptTemplate } = require("@langchain/core/prompts"); // https://js.langchain.com/docs/modules/model_io/prompts/

// Import createHistoryAwareRetriever for advanced retrieval techniques
const {
  createHistoryAwareRetriever,
} = require("langchain/chains/history_aware_retriever"); // https://js.langchain.com/docs/modules/chains/retrieval/

// Import ChatOpenAI for OpenAI chat models
const { ChatOpenAI } = require("@langchain/openai"); // https://js.langchain.com/docs/modules/models/chat_models/

// Import MessagesPlaceholder for message handling
const { MessagesPlaceholder } = require("@langchain/core/prompts"); // https://js.langchain.com/docs/modules/model_io/prompts/

// Import createStuffDocumentsChain to combine documents
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents"); // https://js.langchain.com/docs/modules/chains/document

// Import createRetrievalChain for retrieval operations
const { createRetrievalChain } = require("langchain/chains/retrieval"); // https://js.langchain.com/docs/modules/chains/retrieval/

// Import message types for chat interactions
const {
  HumanMessage,
  AIMessage,
  SystemMessage,
} = require("@langchain/core/messages"); // https://js.langchain.com/docs/modules/model_io/chat_helpers/getting_started

// Import Cerebras client for model inference
const { Cerebras } = require("@cerebras/cerebras_cloud_sdk"); // https://docs.cerebras.net/en/latest/user-guide/cerebras-cloud-sdk.html

// Initialize Pinecone client with API key
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Initialize OpenAI Chat model with configuration
const chatModel = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.7,
  maxTokens: 512,
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Cerebras client with API key
const client = new Cerebras({
  apiKey: process.env["CEREBRAS_API_KEY"], // This is the default and can be omitted
});

// Function to load documents into Pinecone
const loadIntoPinecone = async () => {
  try {
    // Load the PDF document
    const loader = new PDFLoader("../PennSylvaniaDrivingManual.pdf");
    const docs = await loader.load();

    // Split documents into chunks for processing
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Generate embeddings for the document chunks
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create or connect to a Pinecone index
    const index = pc.Index("drivewise2");
    await PineconeStore.fromDocuments(splitDocs, embeddings, {
      pineconeIndex: index,
      namespace: "penn",
      textKey: "text",
    });

    console.log("Documents loaded into Pinecone successfully!");
  } catch (error) {
    console.error("Error loading documents into Pinecone:", error);
  }
};

// Function to handle user questions
const askQuestion = async (req, res) => {
  const { message } = req.body;
  const userMessage = message.trim().replace(/\n/g, " ");
  try {
    // Connect to the Pinecone index
    const index = pc.Index("drivewise2");

    // Initialize vector store for retrieval
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      }),
      { pineconeIndex: index, textKey: "text", namespace: "penn" }
    );

    // Retrieve relevant documents based on the user's question
    const retriever = vectorStore.asRetriever({
      k: 3,
    });
    const docCitations = [];
    const docs = await retriever.getRelevantDocuments(userMessage);
    const context = docs
      .map((doc) => {
        docCitations.push({
          id: doc.id,
          lineStart: doc.metadata["loc.lines.from"],
          lineEnd: doc.metadata["loc.lines.to"],
          pageNumber: doc.metadata["loc.pageNumber"],
        });
        return doc.pageContent;
      })
      .join("\n\n");

    // Create a prompt for the AI model
    const prompt = `You are an AI instructor teaching the student to drive. Answer any questions thoroughly and helpfully. You should be bright and cheerful. Answer the following question based on the context provided.

Context:
${context}

Question:
${userMessage}

Answer:`;

    // Get the AI's response using Cerebras model
    const completionCreateResponse = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3.1-8b",
    });
    let answer = completionCreateResponse.choices[0].message.content;

    // Example array of citations (assuming they are present in the response)
    // Join citations to the bottom of the answer as text
    const citationsText = docCitations
      .map(
        (citation) =>
          `Page: ${citation.pageNumber}, Lines: ${citation.lineStart}-${citation.lineEnd}`
      )
      .join("\n");

    const fullResponse = `${answer}\n\nCitations:\n${citationsText}`;

    return res.status(200).json({ response: fullResponse });
  } catch (error) {
    console.error("Error in askQuestion:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Export the functions for external use
module.exports = { askQuestion, loadIntoPinecone };
