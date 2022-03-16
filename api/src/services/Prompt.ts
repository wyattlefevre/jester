export interface Prompt {
  promptId: string
  prompt: string
  rules: PromptRules
}
export interface PromptRules {
  // limits number of responses that can be received from a user.
  // all responses will come back in an array
  type: PromptType
  limit: number
  responseOptions: string[] | null
}

export interface PromptResponse {
  promptId: string
  responses: string[]
}

export enum PromptType {
  FreeResponse = 'free-response',
  Selection = 'selection',
}

export interface PromptStatus {
  totalResponses: number
  type: PromptType
}
