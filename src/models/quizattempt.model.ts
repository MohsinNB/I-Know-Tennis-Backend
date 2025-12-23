import { Schema, Types, model } from "mongoose";

export interface IAnswer {
  questionId: Types.ObjectId;
  selectedOptionIndex: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface IQuizAttempt {
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  answers: IAnswer[];
  totalScore: number;
  status: "pending" | "completed";
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  pointsEarned: {
    type: Number,
    required: true,
  },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: {
      type: [AnswerSchema],
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const QuizAttempt = model<IQuizAttempt>(
  "QuizAttempt",
  QuizAttemptSchema
);
