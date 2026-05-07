# Glossary of AI Engineering Terms

*Complete reference of AI engineering, Claude, and LLM terminology*

---

## Table of Contents
- [A](#a) | [B](#b) | [C](#c) | [D](#d) | [E](#e) | [F](#f) | [G](#g) | [H](#h) | [I](#i) | [J](#j) | [K](#k) | [L](#l) | [M](#m)
- [N](#n) | [O](#o) | [P](#p) | [Q](#q) | [R](#r) | [S](#s) | [T](#t) | [U](#u) | [V](#v) | [W](#w) | [X](#x) | [Y](#y) | [Z](#z)

---

## A

### Agentic Workflow
A pattern where AI systems autonomously perform multi-step tasks by breaking down complex goals into subtasks, making decisions, and using tools iteratively.

**See also:** Agent, Tool Use, Chain-of-Thought

### Agent
An AI system that can autonomously perceive its environment, make decisions, and take actions to achieve specific goals. Claude can function as an agent when given appropriate tools and context.

**See also:** Agentic Workflow, Tool Use

### Alignment
The process of ensuring AI systems behave according to human values and intentions. Includes safety measures, ethical considerations, and desired behavior patterns.

**See also:** Constitutional AI, RLHF, Safety

### Anthropic
The AI safety company that created Claude. Founded in 2021 by former OpenAI researchers with a focus on AI safety and beneficial AI development.

**See also:** Claude, Constitutional AI

### API (Application Programming Interface)
A set of protocols and tools for building software applications. Claude's API allows developers to integrate Claude's capabilities into their applications.

**See also:** REST API, SDK, Endpoint

### Artifacts
Substantial, self-contained content (documents, code, diagrams) that Claude generates and displays in a separate panel for easy viewing, copying, and iteration.

**See also:** Extended Thinking, Projects

### Attention Mechanism
The core component of transformer models that allows the model to focus on relevant parts of the input when generating each token. Uses query, key, and value matrices.

**See also:** Transformer, Self-Attention, Multi-Head Attention

### Auto-Completion
Feature where Claude suggests completions for partial inputs, helping users write prompts more efficiently.

**See also:** Prompt Engineering, Suggestions

---

## B

### Batch API
An API endpoint that allows processing multiple prompts asynchronously at reduced cost, with results returned within 24 hours. Ideal for non-urgent bulk processing.

**See also:** API, Asynchronous Processing

### Beam Search
A decoding strategy that explores multiple sequence possibilities simultaneously, keeping the top-k most likely sequences at each step.

**See also:** Decoding Strategy, Sampling, Temperature

### Benchmark
Standardized tests used to evaluate AI model performance across specific tasks. Common benchmarks include MMLU, HumanEval, and MATH.

**See also:** Evaluation, Performance Metrics

### BERT (Bidirectional Encoder Representations from Transformers)
An encoder-only transformer model designed for understanding tasks. Unlike GPT-style models, BERT processes text bidirectionally.

**See also:** Transformer, Encoder, Embedding

### Bias
Systematic errors or unfair tendencies in AI model outputs, often reflecting biases present in training data. Can be social, statistical, or algorithmic.

**See also:** Fairness, Training Data, Alignment

### Byte Pair Encoding (BPE)
A tokenization method that breaks text into subword units, balancing vocabulary size with representation efficiency. Used by many LLMs including Claude.

**See also:** Tokenization, Vocabulary, Subword

---

## C

### Cache (Prompt Caching)
A feature that stores frequently used prompt segments to reduce latency and cost for subsequent requests with similar context.

**See also:** Context Window, Performance Optimization

### Chain-of-Thought (CoT)
A prompting technique where the model is encouraged to show its reasoning process step-by-step, improving performance on complex tasks.

**See also:** Reasoning, Few-Shot Learning, Prompt Engineering

### Checkpoint
A saved snapshot of a model's parameters during training, allowing resumption or evaluation at specific training stages.

**See also:** Training, Fine-Tuning, Model Weights

### Citation
References to sources or evidence provided by the model to support its responses, enhancing transparency and verifiability.

**See also:** Grounding, Retrieval, Sources

### Claude
A family of large language models developed by Anthropic, available in Opus, Sonnet, and Haiku variants with different capability-cost tradeoffs.

**See also:** Anthropic, LLM, Model Variants

### Claude Code
Anthropic's official CLI tool for Claude, enabling terminal-based interaction, automation, and integration with development workflows.

**See also:** CLI, Developer Tools, API

### Claude Desktop
A native desktop application for Claude, providing enhanced features like file upload, project management, and offline capabilities.

**See also:** Interface, Projects, Desktop App

### Claude.ai
The web-based interface for interacting with Claude, offering conversational AI capabilities, document analysis, and project organization.

**See also:** Web Interface, Chat Interface

### Code Execution
The ability of Claude to write and execute code (in supported environments) to solve problems, analyze data, or demonstrate concepts.

**See also:** Tool Use, Sandbox, Programming

### Completion
The output generated by a language model in response to a prompt. Can be text, code, structured data, or other formats.

**See also:** Generation, Response, Output

### Constitutional AI (CAI)
Anthropic's training methodology that uses AI-written principles to guide model behavior, making AI systems more helpful, harmless, and honest.

**See also:** Alignment, RLHF, Safety

### Context
The input information provided to the model, including the prompt, conversation history, and any additional data or documents.

**See also:** Context Window, Prompt, Input

### Context Window
The maximum amount of text (measured in tokens) that a model can process in a single request, including both input and output.

**See also:** Tokens, Input Length, Memory

### Conversational AI
AI systems designed to engage in natural dialogue with humans, maintaining context across multiple turns of conversation.

**See also:** Chatbot, Dialogue System, Multi-Turn

### Cross-Attention
An attention mechanism where one sequence attends to another sequence, commonly used in encoder-decoder architectures.

**See also:** Attention Mechanism, Transformer, Encoder-Decoder

---

## D

### Decoding Strategy
The method used to select tokens when generating text, including greedy decoding, beam search, and sampling approaches.

**See also:** Sampling, Temperature, Top-k, Top-p

### Deployment
The process of making a trained model available for use in production environments, including infrastructure, scaling, and monitoring.

**See also:** Production, Infrastructure, Scaling

### Detokenization
The process of converting tokens back into human-readable text after generation.

**See also:** Tokenization, Tokens, Output

### Distillation
Training a smaller "student" model to mimic a larger "teacher" model's behavior, creating more efficient models with similar capabilities.

**See also:** Model Compression, Knowledge Transfer, Efficiency

### Document Analysis
The capability to process, understand, and extract insights from documents including PDFs, text files, and structured data.

**See also:** PDF Processing, OCR, Information Extraction

---

## E

### Embedding
A numerical vector representation of text, images, or other data that captures semantic meaning in a continuous space.

**See also:** Vector, Semantic Similarity, Representation

### Encoder
The component of a transformer that processes input text into contextualized representations. Used in understanding-focused tasks.

**See also:** Transformer, Decoder, BERT

### Encoder-Decoder
A transformer architecture with separate encoder and decoder components, commonly used for translation and summarization tasks.

**See also:** Transformer, Sequence-to-Sequence, Architecture

### Endpoint
A specific URL or interface point where API requests are sent to interact with Claude's services.

**See also:** API, REST, Request

### Entity Extraction
Identifying and categorizing named entities (people, places, organizations, dates) from text.

**See also:** NLP, Information Extraction, Named Entity Recognition

### Epoch
One complete pass through the entire training dataset during model training.

**See also:** Training, Iteration, Batch

### Evaluation
The process of assessing model performance using metrics, benchmarks, or human judgment.

**See also:** Benchmark, Metrics, Testing

### Extended Thinking
Claude's capability to engage in deeper reasoning by "thinking through" complex problems before responding, visible in the interface.

**See also:** Chain-of-Thought, Reasoning, Artifacts

---

## F

### Few-Shot Learning
Providing a model with a small number of examples (typically 2-5) in the prompt to guide its behavior on a task.

**See also:** In-Context Learning, Prompt Engineering, Examples

### Fine-Tuning
Further training a pre-trained model on specific data to adapt it for particular tasks or domains.

**See also:** Training, Transfer Learning, Adaptation

### Foundation Model
A large-scale pre-trained model that serves as a base for various downstream tasks and applications.

**See also:** Pre-Training, LLM, Base Model

### Function Calling
The ability of a model to generate structured calls to external functions or APIs based on natural language requests.

**See also:** Tool Use, API Integration, Structured Output

---

## G

### Generation
The process of producing new text, code, or other outputs based on input prompts and learned patterns.

**See also:** Completion, Inference, Output

### Gradient
The derivative of the loss function with respect to model parameters, indicating the direction to adjust weights during training.

**See also:** Backpropagation, Training, Optimization

### Grounding
Connecting model outputs to verifiable sources, facts, or real-world data to improve accuracy and reduce hallucinations.

**See also:** Citation, RAG, Fact-Checking

### GPT (Generative Pre-trained Transformer)
A decoder-only transformer architecture designed for text generation, popularized by OpenAI.

**See also:** Transformer, Decoder, Language Model

---

## H

### Hallucination
When a language model generates plausible-sounding but factually incorrect or nonsensical information.

**See also:** Accuracy, Grounding, Reliability

### Haiku
Claude's fastest and most compact model variant, optimized for speed and cost-efficiency with near-instant responses.

**See also:** Claude, Sonnet, Opus, Model Variants

### Harmlessness
One of Anthropic's core principles: ensuring Claude avoids generating harmful, offensive, or dangerous content.

**See also:** HHH, Safety, Constitutional AI

### Helpfulness
One of Anthropic's core principles: ensuring Claude provides useful, relevant, and actionable responses.

**See also:** HHH, User Experience, Quality

### HHH (Helpful, Harmless, Honest)
Anthropic's guiding principles for Claude's behavior: being helpful to users, avoiding harm, and providing truthful information.

**See also:** Constitutional AI, Alignment, Principles

### Honesty
One of Anthropic's core principles: ensuring Claude provides accurate information and acknowledges uncertainty when appropriate.

**See also:** HHH, Truthfulness, Reliability

### Hyperparameter
Configuration settings that control the training process or model behavior (e.g., learning rate, temperature, max tokens).

**See also:** Parameter, Configuration, Tuning

---

## I

### Inference
The process of using a trained model to generate predictions or outputs for new inputs.

**See also:** Generation, Prediction, Forward Pass

### In-Context Learning
The ability of language models to learn from examples provided within the prompt without parameter updates.

**See also:** Few-Shot Learning, Prompt Engineering, Learning

### Input Length
The size of the prompt or context provided to the model, measured in tokens.

**See also:** Context Window, Tokens, Prompt

### Instruction Following
The model's ability to understand and execute explicit instructions provided in prompts.

**See also:** Prompt Engineering, Task Specification, Compliance

### Instruction Tuning
Training a model to better follow natural language instructions through supervised learning on instruction-response pairs.

**See also:** Fine-Tuning, RLHF, Alignment

---

## J

### JSON Mode
A feature that ensures Claude outputs valid JSON format, useful for structured data extraction and API integrations.

**See also:** Structured Output, Data Format, API

### Jailbreak
Attempts to bypass a model's safety guidelines or constraints through carefully crafted prompts. Anthropic works to prevent these.

**See also:** Safety, Red Teaming, Adversarial

---

## K

### Knowledge Cutoff
The date after which the model has no information about events, as training data only includes information up to that point.

**See also:** Training Data, Currency, Limitations

### Knowledge Distillation
See Distillation

---

## L

### Latency
The time delay between submitting a request and receiving the first token of the response.

**See also:** Performance, Response Time, Speed

### Large Language Model (LLM)
Neural networks trained on vast amounts of text data to understand and generate human-like text. Claude is an example.

**See also:** Foundation Model, Neural Network, NLP

### Learning Rate
A hyperparameter that controls how much model weights are adjusted during training updates.

**See also:** Training, Optimization, Hyperparameter

### Long-Context
Models or techniques that can process very large amounts of input text (hundreds of thousands of tokens).

**See also:** Context Window, Extended Context, Memory

### Loss Function
A mathematical function that measures how well the model's predictions match the target outputs during training.

**See also:** Training, Optimization, Gradient

---

## M

### Markdown
A lightweight markup language used for formatting text. Claude often outputs responses in Markdown format.

**See also:** Formatting, Output Format, Syntax

### Max Tokens
The maximum number of tokens the model will generate in a single response.

**See also:** Tokens, Output Length, Limits

### MCP (Model Context Protocol)
A protocol for managing and extending Claude's context, enabling better handling of long conversations and complex tasks.

**See also:** Context Management, Protocol, Integration

### Metadata
Additional information about requests, responses, or model behavior, such as token counts, timestamps, or model versions.

**see also:** Headers, Information, Tracking

### Model Card
Documentation describing a model's capabilities, limitations, intended uses, and evaluation results.

**See also:** Documentation, Transparency, Specifications

### Model Variants
Different versions of Claude optimized for different use cases: Opus (most capable), Sonnet (balanced), Haiku (fastest).

**See also:** Claude, Opus, Sonnet, Haiku

### Multi-Head Attention
An attention mechanism that uses multiple parallel attention operations, allowing the model to focus on different aspects simultaneously.

**See also:** Attention Mechanism, Transformer, Architecture

### Multi-Modal
AI systems that can process and generate multiple types of data (text, images, audio, video) in combination.

**See also:** Vision, Audio, Modality

### Multi-Turn Conversation
Dialogue consisting of multiple back-and-forth exchanges, where context is maintained across turns.

**See also:** Conversational AI, Context, Dialogue

---

## N

### Named Entity Recognition (NER)
Identifying and classifying named entities (people, organizations, locations) in text.

**See also:** Entity Extraction, NLP, Information Extraction

### Natural Language Processing (NLP)
The field of AI focused on enabling computers to understand, interpret, and generate human language.

**See also:** LLM, Linguistics, Understanding

### Neural Network
A computing system inspired by biological neural networks, consisting of interconnected nodes (neurons) organized in layers.

**See also:** Deep Learning, Architecture, Model

### Normalization
Techniques used to standardize data or model activations, improving training stability and performance.

**See also:** Training, Preprocessing, Optimization

### Nucleus Sampling
See Top-p Sampling

---

## O

### One-Shot Learning
Providing exactly one example in the prompt to guide the model's behavior on a task.

**See also:** Few-Shot Learning, In-Context Learning, Example

### Opacity
The lack of interpretability in how neural networks make decisions, often called the "black box" problem.

**See also:** Interpretability, Explainability, Transparency

### Optimization
The process of adjusting model parameters to minimize the loss function during training.

**See also:** Training, Gradient Descent, Learning

### Opus
Claude's most capable model variant, offering the highest intelligence and performance for complex tasks.

**See also:** Claude, Sonnet, Haiku, Model Variants

### Output Format
The structure and style of the model's response (plain text, JSON, Markdown, code, etc.).

**See also:** Formatting, Response, Structure

### Overfitting
When a model learns training data too specifically, performing well on training data but poorly on new data.

**See also:** Generalization, Training, Regularization

---

## P

### Parameter
A learnable weight in the neural network that is adjusted during training. Claude has billions of parameters.

**See also:** Model Size, Weights, Training

### PDF Processing
Claude's ability to analyze, extract information from, and answer questions about PDF documents.

**See also:** Document Analysis, OCR, File Upload

### Perplexity
A metric measuring how well a language model predicts text, with lower values indicating better prediction.

**See also:** Evaluation, Metrics, Performance

### Persona
A specific character, role, or personality that Claude adopts in responses based on prompt instructions.

**See also:** Role-Playing, System Prompt, Character

### Plugin
Extensions or integrations that add new capabilities to Claude, such as web search, code execution, or specialized tools.

**See also:** Extension, Tool, Integration

### Positional Encoding
Information added to token embeddings to indicate the position of tokens in a sequence, crucial for transformer models.

**See also:** Transformer, Embedding, Architecture

### Pre-Training
The initial training phase where a model learns from vast amounts of unlabeled text data.

**See also:** Training, Foundation Model, Unsupervised Learning

### Prefix
The beginning portion of a prompt that sets context, provides instructions, or establishes the task.

**See also:** Prompt Structure, System Prompt, Context

### Probability Distribution
The likelihood assigned to each possible next token during generation, used in sampling strategies.

**See also:** Sampling, Temperature, Generation

### Projects (Claude)
A feature in Claude interfaces for organizing related conversations, documents, and work around specific topics or tasks.

**See also:** Organization, Workspace, Context

### Prompt
The input text or instructions provided to the model to elicit a specific response or behavior.

**See also:** Input, Query, Instruction

### Prompt Caching
See Cache

### Prompt Engineering
The practice of designing effective prompts to elicit desired behaviors and high-quality outputs from language models.

**See also:** Prompt, Optimization, Best Practices

### Prompt Injection
Security vulnerabilities where malicious instructions in user input override intended system behavior.

**See also:** Security, Jailbreak, Adversarial

---

## Q

### Query
A request or question submitted to the model, often used interchangeably with prompt.

**See also:** Prompt, Input, Request

### Question Answering
A task where the model provides direct answers to questions based on provided context or general knowledge.

**See also:** QA, Information Retrieval, Comprehension

---

## R

### RAG (Retrieval-Augmented Generation)
A technique combining information retrieval with generation, allowing models to access external knowledge bases.

**See also:** Grounding, Retrieval, Knowledge Base

### Rate Limit
Restrictions on the number of API requests that can be made within a specific time period.

**See also:** API, Quota, Throttling

### Reasoning
The model's ability to apply logic, make inferences, and solve problems through step-by-step thinking.

**See also:** Chain-of-Thought, Logic, Problem-Solving

### Red Teaming
Adversarial testing to identify potential safety issues, biases, or vulnerabilities in AI systems.

**See also:** Safety, Testing, Adversarial

### Regularization
Techniques used during training to prevent overfitting and improve model generalization.

**See also:** Overfitting, Training, Generalization

### Reinforcement Learning from Human Feedback (RLHF)
A training method that uses human preferences to guide model behavior toward more helpful and safer outputs.

**See also:** Alignment, Fine-Tuning, Constitutional AI

### Response
The output generated by Claude in reply to a prompt or query.

**See also:** Completion, Output, Generation

### REST API
A web service architecture that Claude's API follows, using HTTP requests for communication.

**See also:** API, HTTP, Endpoint

### Retrieval
The process of finding and extracting relevant information from documents, databases, or knowledge bases.

**See also:** RAG, Search, Information Retrieval

### Role-Playing
When Claude adopts a specific character, profession, or perspective as instructed in the prompt.

**See also:** Persona, Character, Simulation

---

## S

### Safety
Measures and constraints designed to prevent harmful, biased, or dangerous outputs from AI systems.

**See also:** Alignment, Constitutional AI, Harmlessness

### Sampling
Methods for selecting the next token during generation based on probability distributions (vs. deterministic selection).

**See also:** Temperature, Top-k, Top-p, Decoding Strategy

### Scaling Laws
Mathematical relationships describing how model performance improves with increased model size, data, and compute.

**See also:** Model Size, Performance, Training

### SDK (Software Development Kit)
Libraries and tools that simplify integrating Claude into applications. Available for Python, TypeScript, and other languages.

**See also:** API, Library, Integration

### Self-Attention
An attention mechanism where a sequence attends to itself, allowing each position to incorporate information from all other positions.

**See also:** Attention Mechanism, Transformer, Architecture

### Semantic Search
Search based on meaning rather than exact keyword matching, often using embeddings.

**See also:** Embedding, Retrieval, Vector Search

### Sentiment Analysis
Determining the emotional tone or attitude expressed in text (positive, negative, neutral).

**See also:** NLP, Classification, Emotion

### Sequence-to-Sequence (Seq2Seq)
Models that transform one sequence (input) into another sequence (output), like translation or summarization.

**See also:** Encoder-Decoder, Transformer, Translation

### Sonnet
Claude's balanced model variant, offering strong performance with reasonable speed and cost for most use cases.

**See also:** Claude, Opus, Haiku, Model Variants

### Streaming
Sending model output incrementally as it's generated rather than waiting for complete response, improving perceived latency.

**See also:** Real-Time, Latency, Response

### Structured Output
Responses formatted in specific schemas like JSON, XML, or tables rather than free-form text.

**See also:** JSON Mode, Format, Schema

### Subword Tokenization
Breaking words into smaller meaningful units, balancing vocabulary size and representation quality.

**See also:** Tokenization, BPE, Tokens

### Summarization
Condensing longer text into shorter form while preserving key information and meaning.

**See also:** Abstraction, Compression, NLP

### System Prompt
Initial instructions that set Claude's behavior, role, and constraints for an entire conversation or session.

**See also:** Prompt, Configuration, Instructions

---

## T

### Temperature
A parameter controlling randomness in generation. Higher values (e.g., 1.0) increase creativity; lower values (e.g., 0.2) make output more deterministic.

**See also:** Sampling, Randomness, Creativity

### Token
The basic unit of text that language models process. Can be words, parts of words, or characters depending on the tokenization method.

**See also:** Tokenization, Context Window, BPE

### Tokenization
The process of breaking text into tokens for model processing.

**See also:** Token, BPE, Preprocessing

### Tool Use
Claude's ability to interact with external tools, APIs, and functions to perform actions beyond text generation.

**See also:** Function Calling, API Integration, Agent

### Top-k Sampling
A sampling method that considers only the k most likely next tokens, filtering out low-probability options.

**See also:** Sampling, Temperature, Decoding Strategy

### Top-p Sampling (Nucleus Sampling)
A sampling method that considers tokens until their cumulative probability reaches p, dynamically adjusting the candidate pool.

**See also:** Sampling, Temperature, Top-k

### Training
The process of adjusting model parameters by exposing it to data and optimizing for specific objectives.

**See also:** Pre-Training, Fine-Tuning, Learning

### Training Data
The text, code, and other information used to train the model, determining its knowledge and capabilities.

**See also:** Dataset, Corpus, Pre-Training

### Transfer Learning
Using a pre-trained model as a starting point for learning new tasks, rather than training from scratch.

**See also:** Fine-Tuning, Pre-Training, Adaptation

### Transformer
The neural network architecture underlying modern LLMs, using attention mechanisms to process sequences.

**See also:** Attention Mechanism, Architecture, GPT, BERT

### Truncation
Cutting off text that exceeds the context window or max token limits.

**See also:** Context Window, Limits, Tokens

---

## U

### Underfitting
When a model is too simple to capture patterns in the data, performing poorly on both training and new data.

**See also:** Overfitting, Training, Model Complexity

### Unsupervised Learning
Training on unlabeled data to discover patterns, used in pre-training language models.

**See also:** Pre-Training, Self-Supervised, Learning

### User Interface (UI)
The visual and interactive elements through which users interact with Claude (web, desktop, or mobile).

**See also:** Claude.ai, Claude Desktop, Interface

---

## V

### Vector
A numerical array representing data in a continuous space, used in embeddings and neural networks.

**See also:** Embedding, Representation, Tensor

### Vector Database
A specialized database optimized for storing and searching embeddings based on similarity.

**See also:** Embedding, Retrieval, RAG

### Version
Specific releases or iterations of Claude models, often with improved capabilities or features.

**See also:** Model, Update, Release

### Vision
The capability to process and understand images, diagrams, charts, and other visual content.

**See also:** Multi-Modal, Image Understanding, OCR

### Vocabulary
The set of all tokens that a model can recognize and generate.

**See also:** Token, Tokenization, Dictionary

---

## W

### Weights
The learned parameters in a neural network that determine its behavior and capabilities.

**See also:** Parameters, Model, Training

### Web Search
Integration allowing Claude to access current information from the internet (when available through plugins or tools).

**See also:** Tool Use, RAG, Real-Time Data

### Workbench
A development environment or interface for experimenting with prompts, testing configurations, and refining AI applications.

**See also:** Development, Testing, Experimentation

---

## X

### XML Tags
Structured markup sometimes used in prompts to clearly delineate different sections or types of information.

**See also:** Prompt Engineering, Structure, Format

---

## Y

### YAML
A human-readable data serialization format sometimes used for configuration or structured output.

**See also:** Configuration, Format, Structured Data

---

## Z

### Zero-Shot Learning
Performing a task without any examples in the prompt, relying solely on instructions and the model's pre-trained knowledge.

**See also:** Few-Shot Learning, In-Context Learning, Generalization

---

## Quick Reference Tables

### Model Comparison

| Term | Definition | Related Terms |
|------|------------|---------------|
| Opus | Most capable Claude variant | Sonnet, Haiku, Model Variants |
| Sonnet | Balanced Claude variant | Opus, Haiku, Model Variants |
| Haiku | Fastest Claude variant | Opus, Sonnet, Model Variants |

### Training Concepts

| Term | Definition | Related Terms |
|------|------------|---------------|
| Pre-Training | Initial broad training phase | Foundation Model, Unsupervised |
| Fine-Tuning | Task-specific adaptation | Transfer Learning, RLHF |
| RLHF | Human feedback-based training | Alignment, Constitutional AI |

### Prompt Engineering

| Term | Definition | Related Terms |
|------|------------|---------------|
| Zero-Shot | No examples provided | Instruction Following |
| One-Shot | Single example provided | Few-Shot, In-Context |
| Few-Shot | Multiple examples provided | In-Context Learning, Examples |
| Chain-of-Thought | Step-by-step reasoning | Reasoning, Extended Thinking |

### Generation Controls

| Term | Definition | Related Terms |
|------|------------|---------------|
| Temperature | Randomness control | Sampling, Creativity |
| Top-k | Consider k most likely tokens | Sampling, Filtering |
| Top-p | Dynamic probability threshold | Nucleus Sampling |
| Max Tokens | Output length limit | Tokens, Truncation |

---

## Related Resources

- **Command Reference**: CLI commands and options
- **API Reference**: API endpoints and parameters
- **Quick Reference**: Condensed cheat sheet
- **Model Comparison**: Detailed capability matrix

---

*Last Updated: 2026-05-05*
*Version: 1.0*
