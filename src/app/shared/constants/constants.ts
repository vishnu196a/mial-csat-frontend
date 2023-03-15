import { Validators } from '@angular/forms';

export const SURVEY_TYPES = ['Options', 'Ratings', 'Multi Select', 'Free Text'];
export const SURVEY_OPTIONS = ['Yes', 'No'];
export const SURVEY_RATINGS = [5, 10];
export const FORM_STATUS_COLOUR = {
  Active: '#4dbd74',
  InActive: '#f86c6b',
};

export const SURVEY_DEFAULT_QUESTIONS = [
  {
    id: [1],
    question: [
      'Was your experience with our Customer Service Agent pleasant?',
      [Validators.required],
    ],
    type: ['Ratings'],
    option: [null],
    ratings: [5],
    multi_select: [],
    dependent_questions: [null],
    optionText: [null],
    multiOptionText: [null],
  },
  {
    id: [2],
    question: [
      'Basis your experience how likely are you to recommend CSMIA to your friends/colleagues/family?',
      [Validators.required],
    ],
    type: ['Ratings'],
    option: [null],
    ratings: [10],
    multi_select: [],
    dependent_questions: [null],
    optionText: [null],
    multiOptionText: [null],
  },
];
