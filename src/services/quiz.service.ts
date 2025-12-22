import { Quiz } from "../models/quiz.model";

export const createQuizService = async (data: any, adminId: string) => {
  return Quiz.create({ ...data, createdBy: adminId });
};

export const getQuizService = async (quizId: string) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  return quiz;
};
