export interface Condition {
  label: string;
  agent_name: string;
  tone: string;
  confidence_framing: string;
  avatar_type: 'icon' | 'initials';
  color_scheme: 'neutral' | 'warm';
  greeting: string;
  recommendation_prefix: string;
  confidence_display: string;
  button_accept: string;
  button_override: string;
}

export interface Task {
  task_id: string;
  domain: string;
  stakes: string;
  scenario: string;
  recommendation: string;
  ai_accuracy_rate: number;
  block_position?: number;
}

export interface TrustQuestion {
  q_id: string;
  text: string;
  scale: string;
}

export interface Block {
  condition: string;
  condition_config: Condition;
  tasks: Task[];
}

export interface SessionData {
  participant_id: string;
  session_id: string;
  conditions: Record<string, Condition>;
  blocks: Block[];
  trust_scale: TrustQuestion[];
}

export interface ConditionStats {
  agent_name: string;
  total: number;
  accept_count: number;
  override_count: number;
  reliance_rate: number;
  mean_latency_ms: number;
}
