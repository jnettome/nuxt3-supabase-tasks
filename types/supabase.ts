export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      board_columns: {
        Row: {
          board_id: number
          created_at: string
          id: number
          name: string | null
          user_id: string
        }
        Insert: {
          board_id: number
          created_at?: string
          id?: number
          name?: string | null
          user_id: string
        }
        Update: {
          board_id?: number
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string
        }
      }
      boards: {
        Row: {
          created_at: string
          id: number
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string
        }
      }
      taggings: {
        Row: {
          board_id: number | null
          created_at: string
          id: number
          tag_id: number
          todo_id: number
          user_id: string
        }
        Insert: {
          board_id?: number | null
          created_at?: string
          id?: number
          tag_id: number
          todo_id: number
          user_id: string
        }
        Update: {
          board_id?: number | null
          created_at?: string
          id?: number
          tag_id?: number
          todo_id?: number
          user_id?: string
        }
      }
      tags: {
        Row: {
          board_id: number | null
          color: string | null
          created_at: string
          id: number
          lower_tag: string | null
          name: string | null
          user_id: string
        }
        Insert: {
          board_id?: number | null
          color?: string | null
          created_at?: string
          id?: number
          lower_tag?: string | null
          name?: string | null
          user_id: string
        }
        Update: {
          board_id?: number | null
          color?: string | null
          created_at?: string
          id?: number
          lower_tag?: string | null
          name?: string | null
          user_id?: string
        }
      }
      todos: {
        Row: {
          board_column_id: number
          board_id: number
          body: string | null
          created_at: string
          id: number
          is_complete: boolean | null
          position: number
          task: string | null
          user_id: string
        }
        Insert: {
          board_column_id: number
          board_id: number
          body?: string | null
          created_at?: string
          id?: number
          is_complete?: boolean | null
          position?: number
          task?: string | null
          user_id: string
        }
        Update: {
          board_column_id?: number
          board_id?: number
          body?: string | null
          created_at?: string
          id?: number
          is_complete?: boolean | null
          position?: number
          task?: string | null
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_todos_order: {
        Args: {
          payload: Json
        }
        Returns: {
          board_column_id: number
          board_id: number
          body: string | null
          created_at: string
          id: number
          is_complete: boolean | null
          position: number
          task: string | null
          user_id: string
        }[]
      }
      update_todos_taggings: {
        Args: {
          payload: Json
        }
        Returns: {
          board_id: number | null
          created_at: string
          id: number
          tag_id: number
          todo_id: number
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
