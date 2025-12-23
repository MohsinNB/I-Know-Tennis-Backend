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
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: {
    type: [OptionSchema],
    validate: [(v: any[]) => v.length === 4, "4 options required"],
  },
  points: { type: Number, default: 5 },
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    stack: {
      type: String,
      enum: ["newest", "popular", "most-popular"],
      default: "newest",
      required: true,
    },
    questions: {
      type: [QuestionSchema],
      // validate: [(v: any[]) => v.length === 20, "20 questions required"],
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
