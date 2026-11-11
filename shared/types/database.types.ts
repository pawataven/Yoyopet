// Placeholder schema until the backend is ready.
// Regenerate from the real database with `bun run types:supabase` (overwrites this file).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          points: number
          tier: string
          member_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          points?: number
          tier?: string
          member_code?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          points?: number
          tier?: string
          member_code?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          member_id: string
          title: string
          body: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          title: string
          body?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          title?: string
          body?: string | null
          read_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_member_id_fkey'
            columns: ['member_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update']
