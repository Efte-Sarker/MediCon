import { Question, QuestionAnswer } from '../../types/medical.types';
import { mockFetch } from './mockClient';

// Mock QnA database
let mockQuestions: Question[] = [
  {
    id: 'q-1',
    patientId: 'patient-1',
    department: 'Cardiology',
    content:
      'Is it normal to have a slightly elevated heart rate after starting the new blood pressure medication?',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    answers: [
      {
        id: 'a-1',
        doctorId: 'doctor-1',
        content:
          'Yes, a mild increase in heart rate can be a temporary side effect of this medication. However, if it exceeds 100 bpm at rest or you feel palpitations, please schedule an appointment.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'q-2',
    patientId: 'patient-1',
    department: 'Neurology',
    content: 'I have been experiencing mild headaches in the morning. Should I be concerned?',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    answers: [],
  },
  {
    id: 'q-3',
    patientId: 'patient-2',
    department: 'Cardiology',
    content: 'Can I exercise immediately after meals with my current heart condition?',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    answers: [],
  },
];

class QnaService {
  /**
   * Fetch questions authored by a specific patient.
   */
  async getPatientQuestions(patientId: string): Promise<Question[]> {
    const data = [...mockQuestions]
      .filter((q) => q.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return mockFetch(data);
  }

  /**
   * Fetch questions routed to a specific department for the doctor inbox.
   */
  async getDoctorInbox(department: string): Promise<Question[]> {
    const data = [...mockQuestions]
      .filter((q) => q.department === department)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return mockFetch(data);
  }

  /**
   * Patient submits a new question.
   */
  async askQuestion(
    patientId: string,
    department: string,
    content: string,
    isAnonymous?: boolean,
  ): Promise<Question> {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      patientId,
      department,
      content,
      isAnonymous,
      createdAt: new Date().toISOString(),
      answers: [],
    };

    mockQuestions.push(newQuestion);
    return mockFetch(newQuestion);
  }

  /**
   * Doctor submits an answer to a question.
   */
  async answerQuestion(
    questionId: string,
    doctorId: string,
    content: string,
  ): Promise<QuestionAnswer> {
    const question = mockQuestions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    const newAnswer: QuestionAnswer = {
      id: `a-${Date.now()}`,
      doctorId,
      content,
      createdAt: new Date().toISOString(),
    };

    question.answers.push(newAnswer);
    return mockFetch(newAnswer);
  }
}

export const qnaService = new QnaService();
