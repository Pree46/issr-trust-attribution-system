/**
 * Shared TypeScript interfaces for the trust attribution study.
 */

export interface Condition {
  label: string;
  agent_name: string;
  tone: string;
  confidence_framing: string;
  greeting: string;
  recommendation_prefix: string;
  confidence_display: string;
  button_accept: string;
  button_override: string;
}

export interface Task {
  task_id: string;
  scenario: string;
  recommendation: string;
  ai_accuracy_rate: number;
}

export interface SessionData {
  participant_id: string;
  session_id: string;
  condition: string;
  condition_config: Condition;
  tasks: Task[];
}

export interface ConditionStats {
  agent_name: string;
  total: number;
  accept_count: number;
  override_count: number;
  reliance_rate: number;
  mean_latency_ms: number;
}
