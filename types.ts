export interface ToolItem {
  name: string;
  reason: string;
  link: string;
}

export interface PlantInfo {
  name: string;
  description: string;
  imagePrompt: string;
}

export interface Mistake {
  mistake: string;
  solution: string;
}

export interface GardeningAdviceResponse {
  greeting: string;
  plants: PlantInfo[];
  layout: {
    description: string;
    imagePrompt: string;
  };
  checklist: string[];
  tools: ToolItem[];
  mistakes: Mistake[];
}

export interface UserInput {
  area: string;
  sunDirection: string;
  careTime: string;
  goal: string;
}