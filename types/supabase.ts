export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          created_at: string | null
          feedback: string | null
          grade: string | null
          id: string
          lesson_id: string
          status: string | null
          submission_link: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          grade?: string | null
          id?: string
          lesson_id: string
          status?: string | null
          submission_link: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          grade?: string | null
          id?: string
          lesson_id?: string
          status?: string | null
          submission_link?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          course_count: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          serial_number: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          course_count?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          serial_number?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          course_count?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          serial_number?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          completion_date: string
          course_id: string
          course_title: string
          created_at: string | null
          enrollment_id: string
          id: string
          instructor_name: string
          is_valid: boolean | null
          issued_at: string | null
          student_name: string
          user_id: string
          verification_url: string | null
        }
        Insert: {
          certificate_number: string
          completion_date: string
          course_id: string
          course_title: string
          created_at?: string | null
          enrollment_id: string
          id?: string
          instructor_name: string
          is_valid?: boolean | null
          issued_at?: string | null
          student_name: string
          user_id: string
          verification_url?: string | null
        }
        Update: {
          certificate_number?: string
          completion_date?: string
          course_id?: string
          course_title?: string
          created_at?: string | null
          enrollment_id?: string
          id?: string
          instructor_name?: string
          is_valid?: boolean | null
          issued_at?: string | null
          student_name?: string
          user_id?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_codes: {
        Row: {
          code: string
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          starts_at: string | null
          type: string
          used_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          starts_at?: string | null
          type: string
          used_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          starts_at?: string | null
          type?: string
          used_count?: number | null
          value?: number
        }
        Relationships: []
      }
      coupon_courses: {
        Row: {
          coupon_id: string
          course_id: string
        }
        Insert: {
          coupon_id: string
          course_id: string
        }
        Update: {
          coupon_id?: string
          course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_courses_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          category_ids: string[] | null
          code: string
          course_ids: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_type: Database["public"]["Enums"]["coupon_type"] | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_purchase_amount: number | null
          per_user_limit: number | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          category_ids?: string[] | null
          code: string
          course_ids?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: Database["public"]["Enums"]["coupon_type"] | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          per_user_limit?: number | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          category_ids?: string[] | null
          code?: string
          course_ids?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: Database["public"]["Enums"]["coupon_type"] | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          per_user_limit?: number | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_details: {
        Row: {
          allowed_payment_methods: Json | null
          course_id: string
          created_at: string | null
          curriculum_overview: string | null
          description_long: string | null
          discord_channel: string | null
          facebook_group: string | null
          language: string | null
          last_updated_at: string | null
          learning_outcomes: Json | null
          manual_payment_details: Json | null
          requirements: Json | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          target_audience: Json | null
          trailer_lesson_id: string | null
          updated_at: string | null
          whatsapp_group: string | null
        }
        Insert: {
          allowed_payment_methods?: Json | null
          course_id: string
          created_at?: string | null
          curriculum_overview?: string | null
          description_long?: string | null
          discord_channel?: string | null
          facebook_group?: string | null
          language?: string | null
          last_updated_at?: string | null
          learning_outcomes?: Json | null
          manual_payment_details?: Json | null
          requirements?: Json | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          target_audience?: Json | null
          trailer_lesson_id?: string | null
          updated_at?: string | null
          whatsapp_group?: string | null
        }
        Update: {
          allowed_payment_methods?: Json | null
          course_id?: string
          created_at?: string | null
          curriculum_overview?: string | null
          description_long?: string | null
          discord_channel?: string | null
          facebook_group?: string | null
          language?: string | null
          last_updated_at?: string | null
          learning_outcomes?: Json | null
          manual_payment_details?: Json | null
          requirements?: Json | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          target_audience?: Json | null
          trailer_lesson_id?: string | null
          updated_at?: string | null
          whatsapp_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_details_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_details_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_details_trailer_lesson_id_fkey"
            columns: ["trailer_lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_discounts: {
        Row: {
          course_id: string
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          starts_at: string | null
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          course_id: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          course_id?: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_discounts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_discounts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_faq: {
        Row: {
          answer: string
          course_id: string
          created_at: string | null
          id: string
          is_published: boolean | null
          order_index: number | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          course_id: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          course_id?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_faq_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_faq_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_instructors: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          instructor_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_instructors_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_instructors_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_instructors_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      course_leads: {
        Row: {
          course_id: string | null
          created_at: string | null
          email: string
          id: string
          is_processed: boolean | null
          is_read: boolean | null
          message: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_processed?: boolean | null
          is_read?: boolean | null
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_processed?: boolean | null
          is_read?: boolean | null
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_leads_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_leads_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_outline_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          is_published: boolean
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_published?: boolean
          position?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_published?: boolean
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_outline_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_outline_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_outline_topics: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_free_preview: boolean
          is_published: boolean
          module_id: string
          position: number
          title: string
          topic_type: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          module_id: string
          position?: number
          title: string
          topic_type?: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean
          is_published?: boolean
          module_id?: string
          position?: number
          title?: string
          topic_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_outline_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_outline_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_outline_topics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_outline_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_projects: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          order_index: number | null
          technologies: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          order_index?: number | null
          technologies?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          order_index?: number | null
          technologies?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_projects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_projects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_resources: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          external_url: string | null
          file_size_bytes: number | null
          id: string
          is_public: boolean | null
          order_index: number | null
          resource_type: string
          storage_path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          file_size_bytes?: number | null
          id?: string
          is_public?: boolean | null
          order_index?: number | null
          resource_type: string
          storage_path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          external_url?: string | null
          file_size_bytes?: number | null
          id?: string
          is_public?: boolean | null
          order_index?: number | null
          resource_type?: string
          storage_path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_resources_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string | null
          enrollment_id: string
          helpful_count: number | null
          id: string
          is_featured: boolean | null
          is_hidden: boolean | null
          is_verified: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          enrollment_id: string
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_hidden?: boolean | null
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          enrollment_id?: string
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_hidden?: boolean | null
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          batch_no: number
          bkash_automatic_enabled: boolean | null
          category_id: string | null
          community_facebook_url: string | null
          community_whatsapp_url: string | null
          coupons: Json | null
          course_type: string | null
          created_at: string | null
          description: string | null
          discount_expires_at: string | null
          discount_price: number | null
          duration_hours: number | null
          id: string
          instructor_id: string
          language: string | null
          level: string | null
          manual_payment_methods: Json | null
          preview_video_url: string | null
          price: number
          published: boolean | null
          rating: number | null
          rating_count: number | null
          requirements: string[] | null
          serial_number: number | null
          short_description: string | null
          slug: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          total_lessons: number | null
          total_students: number | null
          updated_at: string | null
        }
        Insert: {
          batch_no?: number
          bkash_automatic_enabled?: boolean | null
          category_id?: string | null
          community_facebook_url?: string | null
          community_whatsapp_url?: string | null
          coupons?: Json | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          discount_expires_at?: string | null
          discount_price?: number | null
          duration_hours?: number | null
          id?: string
          instructor_id: string
          language?: string | null
          level?: string | null
          manual_payment_methods?: Json | null
          preview_video_url?: string | null
          price: number
          published?: boolean | null
          rating?: number | null
          rating_count?: number | null
          requirements?: string[] | null
          serial_number?: number | null
          short_description?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_lessons?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_no?: number
          bkash_automatic_enabled?: boolean | null
          category_id?: string | null
          community_facebook_url?: string | null
          community_whatsapp_url?: string | null
          coupons?: Json | null
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          discount_expires_at?: string | null
          discount_price?: number | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string
          language?: string | null
          level?: string | null
          manual_payment_methods?: Json | null
          preview_video_url?: string | null
          price?: number
          published?: boolean | null
          rating?: number | null
          rating_count?: number | null
          requirements?: string[] | null
          serial_number?: number | null
          short_description?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_lessons?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          certificate_issued: boolean | null
          completed_at: string | null
          completed_lessons: number | null
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          expires_at: string | null
          id: string
          last_accessed_at: string | null
          last_lesson_id: string | null
          progress_percentage: number | null
          status: string | null
          total_lessons: number | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          completed_lessons?: number | null
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          expires_at?: string | null
          id?: string
          last_accessed_at?: string | null
          last_lesson_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          total_lessons?: number | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_issued?: boolean | null
          completed_at?: string | null
          completed_lessons?: number | null
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          expires_at?: string | null
          id?: string
          last_accessed_at?: string | null
          last_lesson_id?: string | null
          progress_percentage?: number | null
          status?: string | null
          total_lessons?: number | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_last_lesson_id_fkey"
            columns: ["last_lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_profiles: {
        Row: {
          bio: string
          created_at: string
          expertise: string[] | null
          id: string
          rating: number | null
          social_links: Json | null
          total_courses: number | null
          total_students: number | null
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          expertise?: string[] | null
          id: string
          rating?: number | null
          social_links?: Json | null
          total_courses?: number | null
          total_students?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          expertise?: string[] | null
          id?: string
          rating?: number | null
          social_links?: Json | null
          total_courses?: number | null
          total_students?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_assets: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          id: string
          lesson_id: string
          markdown_content: string | null
          resources: Json | null
          updated_at: string | null
          video_duration_seconds: number | null
          video_path: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          lesson_id: string
          markdown_content?: string | null
          resources?: Json | null
          updated_at?: string | null
          video_duration_seconds?: number | null
          video_path?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          markdown_content?: string | null
          resources?: Json | null
          updated_at?: string | null
          video_duration_seconds?: number | null
          video_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_assets_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          enrollment_id: string
          id: string
          is_completed: boolean | null
          last_watched_at: string | null
          lesson_id: string
          progress_percentage: number | null
          started_at: string | null
          total_seconds: number | null
          updated_at: string | null
          user_id: string
          watched_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id: string
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          lesson_id: string
          progress_percentage?: number | null
          started_at?: string | null
          total_seconds?: number | null
          updated_at?: string | null
          user_id: string
          watched_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id?: string
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          lesson_id?: string
          progress_percentage?: number | null
          started_at?: string | null
          total_seconds?: number | null
          updated_at?: string | null
          user_id?: string
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          position: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          position?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          position?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      module_assignments: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          id: string
          instructions: string | null
          markdown_content: string | null
          module_id: string | null
          position: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          instructions?: string | null
          markdown_content?: string | null
          module_id?: string | null
          position?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          id?: string
          instructions?: string | null
          markdown_content?: string | null
          module_id?: string | null
          position?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_free_preview: boolean | null
          is_published: boolean | null
          lesson_type: Database["public"]["Enums"]["lesson_type"] | null
          module_id: string
          position: number
          quiz_data: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          lesson_type?: Database["public"]["Enums"]["lesson_type"] | null
          module_id: string
          position?: number
          quiz_data?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_free_preview?: boolean | null
          is_published?: boolean | null
          lesson_type?: Database["public"]["Enums"]["lesson_type"] | null
          module_id?: string
          position?: number
          quiz_data?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_quizzes: {
        Row: {
          created_at: string | null
          id: string
          module_id: string | null
          passing_score: number | null
          position: number | null
          questions: Json
          time_limit_minutes: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          passing_score?: number | null
          position?: number | null
          questions?: Json
          time_limit_minutes?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          module_id?: string | null
          passing_score?: number | null
          position?: number | null
          questions?: Json
          time_limit_minutes?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          milestone_id: string | null
          position: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          milestone_id?: string | null
          position?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          milestone_id?: string | null
          position?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submissions: {
        Row: {
          created_at: string | null
          id: string
          lesson_id: string
          percentage: number
          score: number
          total_questions: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lesson_id: string
          percentage: number
          score: number
          total_questions: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lesson_id?: string
          percentage?: number
          score?: number
          total_questions?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "module_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          coupon_code: string | null
          coupon_id: string | null
          course_id: string
          created_at: string | null
          currency: string | null
          discount_amount: number | null
          id: string
          original_price: number
          paid_at: string | null
          payment_intent_id: string | null
          payment_method: string | null
          payment_provider: string | null
          refunded_at: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          coupon_code?: string | null
          coupon_id?: string | null
          course_id: string
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          id?: string
          original_price: number
          paid_at?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          coupon_code?: string | null
          coupon_id?: string | null
          course_id?: string
          created_at?: string | null
          currency?: string | null
          discount_amount?: number | null
          id?: string
          original_price?: number
          paid_at?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          refunded_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_color: string | null
          avatar_url: string
          bio: string | null
          certificates_earned: number | null
          completed_courses: number | null
          courses_enrolled: string[] | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          is_banned: boolean
          is_deleted: boolean
          location: string | null
          name: string
          phone: string | null
          providers: Database["public"]["Enums"]["auth_provider"][] | null
          role: Database["public"]["Enums"]["user_role"] | null
          social_links: Json | null
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_color?: string | null
          avatar_url?: string
          bio?: string | null
          certificates_earned?: number | null
          completed_courses?: number | null
          courses_enrolled?: string[] | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id: string
          is_banned?: boolean
          is_deleted?: boolean
          location?: string | null
          name?: string
          phone?: string | null
          providers?: Database["public"]["Enums"]["auth_provider"][] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_color?: string | null
          avatar_url?: string
          bio?: string | null
          certificates_earned?: number | null
          completed_courses?: number | null
          courses_enrolled?: string[] | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          is_banned?: boolean
          is_deleted?: boolean
          location?: string | null
          name?: string
          phone?: string | null
          providers?: Database["public"]["Enums"]["auth_provider"][] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          social_links?: Json | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      course_stats: {
        Row: {
          active_enrollments: number | null
          avg_rating: number | null
          completions: number | null
          id: string | null
          instructor_id: string | null
          price: number | null
          review_count: number | null
          status: Database["public"]["Enums"]["course_status"] | null
          title: string | null
          total_enrollments: number | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_assign_role: {
        Args: {
          p_new_role: Database["public"]["Enums"]["user_role"]
          p_reassign_to?: string
          p_user_id: string
        }
        Returns: Json
      }
      admin_reassign_instructor: {
        Args: { p_from_user: string; p_to_user: string }
        Returns: Json
      }
      admin_restore_user: { Args: { p_user_id: string }; Returns: Json }
      admin_soft_delete_user: { Args: { p_user_id: string }; Returns: Json }
      become_instructor: { Args: never; Returns: undefined }
      calculate_course_price: {
        Args: { p_coupon_code?: string; p_course_id: string }
        Returns: {
          discount_amount: number
          final_price: number
          original_price: number
        }[]
      }
      can_access_lesson: { Args: { p_lesson_id: string }; Returns: boolean }
      create_course_at_top: { Args: { input_data: Json }; Returns: Json }
      create_enrollment_after_payment: {
        Args: { p_transaction_id: string }
        Returns: Json
      }
      create_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: string
      }
      create_pending_enrollment: {
        Args: { p_transaction_id: string }
        Returns: Json
      }
      delete_user_by_id: { Args: { user_uuid: string }; Returns: undefined }
      delete_user_complete: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      get_admin_dashboard_stats: { Args: never; Returns: Json }
      get_daily_active_users: {
        Args: { p_days?: number }
        Returns: {
          count: number
          date: string
        }[]
      }
      get_instructor_dashboard_stats: { Args: never; Returns: Json }
      get_moderator_dashboard_stats: { Args: never; Returns: Json }
      get_new_signups: {
        Args: { p_days?: number }
        Returns: {
          count: number
          date: string
        }[]
      }
      get_popular_courses: {
        Args: { p_limit?: number }
        Returns: {
          course_id: string
          enrollment_count: number
          instructor_name: string
          rating: number
          revenue: number
          title: string
        }[]
      }
      get_student_dashboard_stats: { Args: never; Returns: Json }
      get_total_revenue: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: number
      }
      get_user_course_count: { Args: { p_user_id: string }; Returns: number }
      has_course_access: { Args: { p_course_id: string }; Returns: boolean }
      is_active_user: { Args: { p_user_id?: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_course_instructor: { Args: { p_course_id: string }; Returns: boolean }
      is_enrolled: { Args: { p_course_id: string }; Returns: boolean }
      is_instructor_of_course: {
        Args: { p_course_id: string }
        Returns: boolean
      }
      is_moderator: { Args: never; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      update_courses_order_bulk: { Args: { updates: Json }; Returns: undefined }
      update_lesson_progress: {
        Args: {
          p_is_completed?: boolean
          p_lesson_id: string
          p_watched_seconds: number
        }
        Returns: Json
      }
      user_owns_courses: { Args: { p_user_id: string }; Returns: boolean }
      validate_coupon: {
        Args: { p_code: string; p_course_id: string }
        Returns: Json
      }
      verify_certificate: {
        Args: { p_certificate_number: string }
        Returns: Json
      }
    }
    Enums: {
      auth_provider: "google" | "github" | "password"
      coupon_type: "percentage" | "fixed"
      course_status: "draft" | "pending_review" | "published" | "archived"
      lesson_type: "video" | "text" | "quiz" | "assignment"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "admin" | "moderator" | "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      auth_provider: ["google", "github", "password"],
      coupon_type: ["percentage", "fixed"],
      course_status: ["draft", "pending_review", "published", "archived"],
      lesson_type: ["video", "text", "quiz", "assignment"],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["admin", "moderator", "teacher", "student"],
    },
  },
} as const
