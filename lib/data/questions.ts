import type { Question } from '@/lib/types';

export const QUESTIONS: Question[] = [
  { title: 'Your team has a blank canvas. Where do you start?', answers: [
    { text: 'Sketch a few unexpected ideas', primary: 'creative', secondary: 'adventurous' },
    { text: 'Research what has worked before', primary: 'analytical', secondary: 'independent' },
    { text: 'Get everyone talking', primary: 'social', secondary: 'purposeful' },
    { text: 'Build something and try it out', primary: 'adventurous', secondary: 'creative' },
  ] },
  { title: 'What would make a workday feel worthwhile?', answers: [
    { text: 'Creating something original', primary: 'creative', secondary: 'independent' },
    { text: 'Solving a complex problem', primary: 'analytical', secondary: 'independent' },
    { text: 'Helping someone grow', primary: 'social', secondary: 'purposeful' },
    { text: 'Making a positive real-world impact', primary: 'purposeful', secondary: 'analytical' },
  ] },
  { title: 'A challenge gets tricky. What gives you energy?', answers: [
    { text: 'Room to find my own approach', primary: 'independent', secondary: 'creative' },
    { text: 'Time to think deeply', primary: 'analytical', secondary: 'independent' },
    { text: 'A teammate to bounce ideas with', primary: 'social', secondary: 'creative' },
    { text: 'A fresh experiment', primary: 'adventurous', secondary: 'analytical' },
  ] },
  { title: 'It’s Saturday and nothing is planned. What sounds best?', answers: [
    { text: 'Making or designing something', primary: 'creative', secondary: 'independent' },
    { text: 'Diving into a puzzle or a documentary', primary: 'analytical', secondary: 'independent' },
    { text: 'Meeting friends or helping a group', primary: 'social', secondary: 'purposeful' },
    { text: 'Exploring somewhere I’ve never been', primary: 'adventurous', secondary: 'creative' },
  ] },
  { title: 'In a group project, which role do you naturally take?', answers: [
    { text: 'The one with the big ideas', primary: 'creative', secondary: 'social' },
    { text: 'The one who checks the details', primary: 'analytical', secondary: 'independent' },
    { text: 'The one who keeps everyone on track', primary: 'social', secondary: 'purposeful' },
    { text: 'The one who tests new approaches', primary: 'adventurous', secondary: 'analytical' },
  ] },
  { title: 'Which workplace sounds most like you?', answers: [
    { text: 'A studio with room to experiment', primary: 'creative', secondary: 'adventurous' },
    { text: 'A quiet space with deep focus time', primary: 'independent', secondary: 'analytical' },
    { text: 'A busy team space full of conversation', primary: 'social', secondary: 'adventurous' },
    { text: 'Out in the field, solving real problems', primary: 'purposeful', secondary: 'adventurous' },
  ] },
  { title: 'What kind of feedback helps you most?', answers: [
    { text: 'Honest reactions to my ideas', primary: 'creative', secondary: 'social' },
    { text: 'Specific data on what worked', primary: 'analytical', secondary: 'independent' },
    { text: 'A mentor who believes in me', primary: 'social', secondary: 'purposeful' },
    { text: 'Freedom to learn by doing', primary: 'adventurous', secondary: 'independent' },
  ] },
  { title: 'Which problem would you most like to help solve?', answers: [
    { text: 'Make everyday things easier to use', primary: 'creative', secondary: 'purposeful' },
    { text: 'Understand what the numbers really say', primary: 'analytical', secondary: 'independent' },
    { text: 'Help people learn or heal', primary: 'social', secondary: 'purposeful' },
    { text: 'Protect nature and communities', primary: 'purposeful', secondary: 'adventurous' },
  ] },
];
