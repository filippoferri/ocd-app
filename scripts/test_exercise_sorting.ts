import { Exercise } from '../types/Exercise';
import { ExerciseSorter, UserContext } from '../services/ExerciseSorter';

const mockExercises: Exercise[] = [
  {
    id: 'body-scan',
    name: 'Body Scan',
    introText: '', benefitsText: '', objectiveText: '', duration: 8, image: '', steps: [],
    journeyPhase: 'support_anytime',
    defaultDisplayOrder: 2,
    usageType: 'regulation',
    priorityInCriticalMode: 'high',
    mentalLoad: 'low',
  },
  {
    id: 'gratitudine-mattino',
    name: 'Gratitudine del mattino',
    introText: '', benefitsText: '', objectiveText: '', duration: 10, image: '', steps: [],
    journeyPhase: 'start_day',
    defaultDisplayOrder: 1,
    usageType: 'preventive',
    priorityInCriticalMode: 'low',
    mentalLoad: 'low',
  },
  {
    id: 'gratitudine-sera',
    name: 'Gratitudine della sera',
    introText: '', benefitsText: '', objectiveText: '', duration: 10, image: '', steps: [],
    journeyPhase: 'end_day',
    defaultDisplayOrder: 3,
    usageType: 'decompression',
    priorityInCriticalMode: 'low',
    mentalLoad: 'low',
  }
];

function testStandardSort() {
  console.log('Testing Standard Sort...');
  const context: UserContext = { isCriticalMode: false };
  const sorted = ExerciseSorter.orderDailyExercises(mockExercises, context);
  
  const expectedOrder = ['gratitudine-mattino', 'body-scan', 'gratitudine-sera'];
  const actualOrder = sorted.map(ex => ex.id);
  
  if (JSON.stringify(actualOrder) === JSON.stringify(expectedOrder)) {
    console.log('✅ Standard Sort Passed');
  } else {
    console.error('❌ Standard Sort Failed');
    console.error('Expected:', expectedOrder);
    console.error('Actual:', actualOrder);
  }
}

function testCriticalSort() {
  console.log('Testing Critical Sort...');
  const context: UserContext = { isCriticalMode: true };
  const sorted = ExerciseSorter.orderDailyExercises(mockExercises, context);
  
  // Body Scan should be promoted to index 0 because it's regulation, high priority, low mental load
  const expectedOrder = ['body-scan', 'gratitudine-mattino', 'gratitudine-sera'];
  const actualOrder = sorted.map(ex => ex.id);
  
  if (JSON.stringify(actualOrder) === JSON.stringify(expectedOrder)) {
    console.log('✅ Critical Sort Passed');
  } else {
    console.error('❌ Critical Sort Failed');
    console.error('Expected:', expectedOrder);
    console.error('Actual:', actualOrder);
  }
}

testStandardSort();
testCriticalSort();
