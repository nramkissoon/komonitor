export interface Project {
  owner_id: string;
  project_id: string;
  created_at: number;
  updated_at: number;
  uptime_monitors: string[];
  tags: string[];
}
