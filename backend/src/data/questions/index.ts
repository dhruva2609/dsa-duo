import { cppStlContainers } from './cpp/stl-containers';
import { jsArrays } from './javascript/arrays';
import { pythonDictionaries } from './python/dictionaries';
import { pyBasics } from './python/basics';
import { ModuleData } from './types';

export const questionBank: ModuleData[] = [
  jsArrays,
  pyBasics,
  pythonDictionaries,
  cppStlContainers
];
