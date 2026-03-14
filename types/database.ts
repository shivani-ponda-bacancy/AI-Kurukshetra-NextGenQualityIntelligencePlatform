export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

interface TableDefinition<Row, Insert, Update> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      profiles: TableDefinition<
        {
          id: string;
          email: string;
          full_name: string;
          organization_name: string;
          role: string;
        },
        {
          id: string;
          email: string;
          full_name: string;
          organization_name: string;
          role: string;
        },
        {
          id?: string;
          email?: string;
          full_name?: string;
          organization_name?: string;
          role?: string;
        }
      >;
      documents: TableDefinition<
        {
          id: string;
          title: string;
          description: string | null;
          version: number;
          file_url: string | null;
          status: string;
          created_by: string;
          created_at: string;
        },
        {
          title: string;
          description?: string | null;
          version?: number;
          file_url?: string | null;
          status: string;
          created_by: string;
          created_at?: string;
        },
        {
          title?: string;
          description?: string | null;
          version?: number;
          file_url?: string | null;
          status?: string;
          created_by?: string;
          created_at?: string;
        }
      >;
      non_conformances: TableDefinition<
        {
          id: string;
          title: string;
          severity: string;
          owner: string;
          due_date: string;
          status: string;
        },
        {
          title: string;
          severity: string;
          owner: string;
          due_date: string;
          status: string;
        },
        {
          title?: string;
          severity?: string;
          owner?: string;
          due_date?: string;
          status?: string;
        }
      >;
      capa_actions: TableDefinition<
        {
          id: string;
          title: string;
          owner: string;
          due_date: string;
          status: string;
        },
        {
          title: string;
          owner: string;
          due_date: string;
          status: string;
        },
        {
          title?: string;
          owner?: string;
          due_date?: string;
          status?: string;
        }
      >;
      audits: TableDefinition<
        {
          id: string;
          title: string;
          lead_auditor: string;
          scheduled_for: string;
          status: string;
        },
        {
          title: string;
          lead_auditor: string;
          scheduled_for: string;
          status: string;
        },
        {
          title?: string;
          lead_auditor?: string;
          scheduled_for?: string;
          status?: string;
        }
      >;
      suppliers: TableDefinition<
        {
          id: string;
          name: string;
          score: number;
          contact: string;
          status: string;
        },
        {
          name: string;
          score: number;
          contact: string;
          status: string;
        },
        {
          name?: string;
          score?: number;
          contact?: string;
          status?: string;
        }
      >;
      risks: TableDefinition<
        {
          id: string;
          title: string;
          owner: string;
          rating: string;
          mitigation_status: string;
        },
        {
          title: string;
          owner: string;
          rating: string;
          mitigation_status: string;
        },
        {
          title?: string;
          owner?: string;
          rating?: string;
          mitigation_status?: string;
        }
      >;
      trainings: TableDefinition<
        {
          id: string;
          course: string;
          completion_rate: number;
          due_date: string;
          owner: string;
          status: string;
        },
        {
          course: string;
          completion_rate: number;
          due_date: string;
          owner: string;
          status: string;
        },
        {
          course?: string;
          completion_rate?: number;
          due_date?: string;
          owner?: string;
          status?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
