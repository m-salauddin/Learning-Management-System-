export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    avatar_url: string
                    courses_enrolled: string[]
                    role: Database['public']['Enums']['user_role']
                    providers: Database['public']['Enums']['auth_provider'][]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name?: string
                    email: string
                    avatar_url?: string
                    courses_enrolled?: string[]
                    role?: Database['public']['Enums']['user_role']
                    providers?: Database['public']['Enums']['auth_provider'][]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    avatar_url?: string
                    courses_enrolled?: string[]
                    role?: Database['public']['Enums']['user_role']
                    providers?: Database['public']['Enums']['auth_provider'][]
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "users_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            role_requests: {
                Row: {
                    id: string
                    user_id: string
                    requested_role: Database['public']['Enums']['user_role']
                    status: 'pending' | 'approved' | 'rejected'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    requested_role: Database['public']['Enums']['user_role']
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    requested_role?: Database['public']['Enums']['user_role']
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "role_requests_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            },
            courses: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    instructor_id: string
                    price: number
                    thumbnail_url: string | null
                    published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    instructor_id: string
                    price?: number
                    thumbnail_url?: string | null
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    instructor_id?: string
                    price?: number
                    thumbnail_url?: string | null
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "courses_instructor_id_fkey"
                        columns: ["instructor_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'student' | 'teacher' | 'moderator' | 'admin'
            auth_provider: 'google' | 'github' | 'password'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
