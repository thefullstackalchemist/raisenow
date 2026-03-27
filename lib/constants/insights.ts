export const SKILL_CATEGORIES: Record<string, string[]> = {
  Languages:      ['javascript','typescript','python','java','go','rust','c#','ruby','php','swift','kotlin','scala','r','c++','c'],
  Frontend:       ['react','vue','angular','next.js','nextjs','svelte','html','css','sass','less','tailwind','webpack','vite','redux','mobx','graphql client'],
  Backend:        ['node.js','nodejs','express','fastapi','django','flask','spring','rails','laravel','asp.net','nestjs','hapi','koa','grpc','rest','restful','api'],
  Databases:      ['postgresql','postgres','mysql','mongodb','redis','elasticsearch','dynamodb','sqlite','cassandra','neo4j','firestore','sql','nosql','supabase','planetscale'],
  'DevOps/Cloud': ['aws','gcp','azure','docker','kubernetes','k8s','terraform','ansible','jenkins','github actions','circleci','gitlab ci','linux','nginx','ci/cd','devops','serverless'],
  'Data/ML':      ['tensorflow','pytorch','pandas','numpy','scikit-learn','sklearn','spark','kafka','airflow','dbt','tableau','power bi','machine learning','deep learning','nlp','data pipeline','etl'],
  Tools:          ['git','github','jira','agile','scrum','testing','jest','pytest','cypress','vitest','postman','swagger','figma','vs code','linux','bash','shell'],
};

export interface RoleArchetype {
  id:          string;
  name:        string;
  icon:        string;
  description: string;
  color:       string;
  requirements: Record<string, number>; // category → importance 1-10
  coreSkills:  string[];
}

export const ROLE_ARCHETYPES: RoleArchetype[] = [
  {
    id: 'fullstack', name: 'Full Stack', icon: '⚡', color: '#2563EB',
    description: 'Builds both client-side and server-side systems',
    requirements: { Languages:8, Frontend:8, Backend:8, Databases:7, 'DevOps/Cloud':4, 'Data/ML':1, Tools:6 },
    coreSkills: ['React / Vue', 'Node.js / Python', 'PostgreSQL / MongoDB', 'REST APIs', 'Git'],
  },
  {
    id: 'frontend', name: 'Frontend Dev', icon: '🎨', color: '#7C3AED',
    description: 'Specialises in user interfaces and web experiences',
    requirements: { Languages:7, Frontend:10, Backend:2, Databases:2, 'DevOps/Cloud':3, 'Data/ML':1, Tools:7 },
    coreSkills: ['React / Vue / Angular', 'TypeScript', 'CSS / Sass', 'Testing (Jest / Cypress)', 'Git'],
  },
  {
    id: 'backend', name: 'Backend Dev', icon: '⚙️', color: '#059669',
    description: 'Builds APIs, services, and server-side systems',
    requirements: { Languages:8, Frontend:1, Backend:10, Databases:8, 'DevOps/Cloud':5, 'Data/ML':3, Tools:7 },
    coreSkills: ['Node.js / Python / Java', 'PostgreSQL / MySQL', 'REST / GraphQL', 'Docker', 'Testing'],
  },
  {
    id: 'devops', name: 'DevOps / SRE', icon: '🔧', color: '#DC2626',
    description: 'Manages infrastructure, CI/CD, and reliability',
    requirements: { Languages:5, Frontend:1, Backend:4, Databases:5, 'DevOps/Cloud':10, 'Data/ML':2, Tools:8 },
    coreSkills: ['Docker & Kubernetes', 'AWS / GCP / Azure', 'Terraform / Ansible', 'CI/CD Pipelines', 'Linux'],
  },
  {
    id: 'data', name: 'Data Engineer', icon: '📊', color: '#F59E0B',
    description: 'Builds data pipelines and analytical systems',
    requirements: { Languages:7, Frontend:1, Backend:5, Databases:9, 'DevOps/Cloud':5, 'Data/ML':8, Tools:5 },
    coreSkills: ['Python / SQL', 'Spark / Kafka', 'dbt / Airflow', 'Cloud Data Warehouses', 'Git'],
  },
  {
    id: 'ml', name: 'ML Engineer', icon: '🤖', color: '#6366F1',
    description: 'Develops and deploys machine learning systems',
    requirements: { Languages:8, Frontend:1, Backend:5, Databases:6, 'DevOps/Cloud':6, 'Data/ML':10, Tools:5 },
    coreSkills: ['Python', 'TensorFlow / PyTorch', 'Pandas / NumPy', 'MLOps / Docker', 'Statistics'],
  },
];

export const CAREER_LEVELS = [
  { id: 'junior',    label: 'Junior',    minYears: 0,  maxYears: 2,  color: '#22C55E', description: 'Building foundations' },
  { id: 'mid',       label: 'Mid-Level', minYears: 2,  maxYears: 5,  color: '#3B82F6', description: 'Delivering independently' },
  { id: 'senior',    label: 'Senior',    minYears: 5,  maxYears: 9,  color: '#8B5CF6', description: 'Leading technical decisions' },
  { id: 'lead',      label: 'Lead',      minYears: 9,  maxYears: 99, color: '#F59E0B', description: 'Shaping architecture & teams' },
];
