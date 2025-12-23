import { Schema, model, Types } from "mongoose";

interface IOption {
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  _id: Types.ObjectId;
  question: string;
  options: IOption[];
  points: number;
}

export interface IQuiz {
  title: string;
  stack: "newest" | "popular" | "most-popular";
  questions: IQuestion[];
  createdBy: Types.ObjectId;
}

const OptionSchema = new Schema<IOption>({
  text: { type: String, required: true }, // REMOVED unique: true
  isCorrect: { type: Boolean, required: true },
});

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true }, // REMOVED unique: true
  options: {
    type: [OptionSchema],
    validate: [
      {
        validator: (v: any[]) => v.length === 4,
        message: "4 options required",
      },
      {
        // Validates that options are unique WITHIN this specific question
        validator: function (options: IOption[]) {
          const texts = options.map((o) => o.text.toLowerCase().trim());
          return new Set(texts).size === texts.length;
        },
        message: "Duplicate options found in this question.",
      },
    ],
  },
  points: { type: Number, default: 5 },
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, unique: true }, // Keep this! Titles should be globally unique.
    stack: {
      type: String,
      enum: ["newest", "popular", "most-popular"],
      default: "newest",
    },
    questions: {
      type: [QuestionSchema],
      validate: {
        // Validates that questions are unique WITHIN this specific quiz
        validator: function (questions: IQuestion[]) {
          const texts = questions.map((q) => q.question.toLowerCase().trim());
          return new Set(texts).size === texts.length;
        },
        message: "Duplicate questions found in this quiz.",
      },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// 🔐 hide correct answers from frontend
QuizSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.questions.forEach((q: any) => {
      q.options.forEach((o: any) => delete o.isCorrect);
    });
    return ret;
  },
});

export const Quiz = model<IQuiz>("Quiz", QuizSchema);
