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
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone: string | null
          location: string | null
          birth_date: string | null
          avatar_url: string | null
          role: 'volunteer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          phone?: string | null
          location?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          role?: 'volunteer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          location?: string | null
          birth_date?: string | null
          avatar_url?: string | null
          role?: 'volunteer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      user_preferences: {
        Row: {
          user_id: string
          dark_mode: boolean
          high_contrast: boolean
          large_text: boolean
          voice_reading: boolean
          project_notifications: boolean
          reminder_notifications: boolean
          email_notifications: boolean
        }
        Insert: {
          user_id: string
          dark_mode?: boolean
          high_contrast?: boolean
          large_text?: boolean
          voice_reading?: boolean
          project_notifications?: boolean
          reminder_notifications?: boolean
          email_notifications?: boolean
        }
        Update: {
          user_id?: string
          dark_mode?: boolean
          high_contrast?: boolean
          large_text?: boolean
          voice_reading?: boolean
          project_notifications?: boolean
          reminder_notifications?: boolean
          email_notifications?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      projects: {
        Row: {
          id: number
          title: string
          title_en: string | null
          description: string
          description_en: string | null
          category: 'social' | 'environmental' | 'educational'
          hours: number
          max_participants: number
          location: string
          image_url: string | null
          project_date: string
          status: 'available' | 'in_progress' | 'completed'
          is_open: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          title_en?: string | null
          description: string
          description_en?: string | null
          category: 'social' | 'environmental' | 'educational'
          hours: number
          max_participants?: number
          location: string
          image_url?: string | null
          project_date: string
          status?: 'available' | 'in_progress' | 'completed'
          is_open?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          title_en?: string | null
          description?: string
          description_en?: string | null
          category?: 'social' | 'environmental' | 'educational'
          hours?: number
          max_participants?: number
          location?: string
          image_url?: string | null
          project_date?: string
          status?: 'available' | 'in_progress' | 'completed'
          is_open?: boolean
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      activities: {
        Row: {
          id: string
          project_id: number
          name: string
          name_en: string | null
          description: string | null
          description_en: string | null
          hours: number
          is_completed: boolean
          validated_by: string | null
          validated_at: string | null
        }
        Insert: {
          id?: string
          project_id: number
          name: string
          name_en?: string | null
          description?: string | null
          description_en?: string | null
          hours: number
          is_completed?: boolean
          validated_by?: string | null
          validated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: number
          name?: string
          name_en?: string | null
          description?: string | null
          description_en?: string | null
          hours?: number
          is_completed?: boolean
          validated_by?: string | null
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'activities_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_validated_by_fkey'
            columns: ['validated_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          project_id: number
          status: 'pending' | 'approved' | 'rejected'
          phone: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          motivation: string | null
          availability: string[] | null
          experience: string | null
          id_document_url: string | null
          signature_url: string | null
          enrolled_at: string
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: number
          status?: 'pending' | 'approved' | 'rejected'
          phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          motivation?: string | null
          availability?: string[] | null
          experience?: string | null
          id_document_url?: string | null
          signature_url?: string | null
          enrolled_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: number
          status?: 'pending' | 'approved' | 'rejected'
          phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          motivation?: string | null
          availability?: string[] | null
          experience?: string | null
          id_document_url?: string | null
          signature_url?: string | null
          enrolled_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'enrollments_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollments_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollments_reviewed_by_fkey'
            columns: ['reviewed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      activity_completions: {
        Row: {
          id: string
          activity_id: string
          user_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          user_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          activity_id?: string
          user_id?: string
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activity_completions_activity_id_fkey'
            columns: ['activity_id']
            referencedRelation: 'activities'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activity_completions_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      manual_hours: {
        Row: {
          id: string
          user_id: string
          project_id: number
          date: string
          hours: number
          description: string
          evidence_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: number
          date: string
          hours: number
          description: string
          evidence_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: number
          date?: string
          hours?: number
          description?: string
          evidence_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'manual_hours_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'manual_hours_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'manual_hours_reviewed_by_fkey'
            columns: ['reviewed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      certificate_requests: {
        Row: {
          id: string
          user_id: string
          type: 'project' | 'date_range' | 'general'
          project_id: number | null
          start_date: string | null
          end_date: string | null
          purpose: 'educational' | 'employment' | 'personal' | 'other'
          institution: string | null
          observations: string | null
          status: 'pending' | 'approved' | 'rejected'
          certificate_url: string | null
          requested_at: string
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'project' | 'date_range' | 'general'
          project_id?: number | null
          start_date?: string | null
          end_date?: string | null
          purpose: 'educational' | 'employment' | 'personal' | 'other'
          institution?: string | null
          observations?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          certificate_url?: string | null
          requested_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'project' | 'date_range' | 'general'
          project_id?: number | null
          start_date?: string | null
          end_date?: string | null
          purpose?: 'educational' | 'employment' | 'personal' | 'other'
          institution?: string | null
          observations?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          certificate_url?: string | null
          requested_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'certificate_requests_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'certificate_requests_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'certificate_requests_reviewed_by_fkey'
            columns: ['reviewed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      project_feedbacks: {
        Row: {
          id: string
          user_id: string
          project_id: number
          overall_satisfaction: number
          organization: number
          communication: number
          community_impact: number
          would_recommend: boolean
          best_aspect: string
          improvements: string
          additional_comments: string | null
          is_anonymous: boolean
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: number
          overall_satisfaction: number
          organization: number
          communication: number
          community_impact: number
          would_recommend: boolean
          best_aspect: string
          improvements: string
          additional_comments?: string | null
          is_anonymous?: boolean
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: number
          overall_satisfaction?: number
          organization?: number
          communication?: number
          community_impact?: number
          would_recommend?: boolean
          best_aspect?: string
          improvements?: string
          additional_comments?: string | null
          is_anonymous?: boolean
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_feedbacks_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_feedbacks_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      project_proposals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: 'social' | 'environmental' | 'educational'
          objectives: string[]
          target_audience: string | null
          location: string | null
          estimated_duration: string | null
          estimated_volunteers: number | null
          resources: string | null
          schedule: string[] | null
          additional_info: string | null
          image_url: string | null
          status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'needs_info'
          submitted_at: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          review_notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: 'social' | 'environmental' | 'educational'
          objectives: string[]
          target_audience?: string | null
          location?: string | null
          estimated_duration?: string | null
          estimated_volunteers?: number | null
          resources?: string | null
          schedule?: string[] | null
          additional_info?: string | null
          image_url?: string | null
          status?: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'needs_info'
          submitted_at?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: 'social' | 'environmental' | 'educational'
          objectives?: string[]
          target_audience?: string | null
          location?: string | null
          estimated_duration?: string | null
          estimated_volunteers?: number | null
          resources?: string | null
          schedule?: string[] | null
          additional_info?: string | null
          image_url?: string | null
          status?: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'needs_info'
          submitted_at?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          review_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'project_proposals_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'project_proposals_reviewed_by_fkey'
            columns: ['reviewed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      incidents: {
        Row: {
          id: string
          project_id: number
          reporter_id: string
          type: 'accident' | 'health' | 'conflict' | 'logistics' | 'resources' | 'security' | 'equipment' | 'weather' | 'other'
          severity: 'low' | 'medium' | 'high' | 'critical'
          incident_date: string
          description: string
          people_involved: string | null
          location: string | null
          evidence_url: string | null
          status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
          admin_notes: string | null
          resolution_notes: string | null
          reported_at: string
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          project_id: number
          reporter_id: string
          type: 'accident' | 'health' | 'conflict' | 'logistics' | 'resources' | 'security' | 'equipment' | 'weather' | 'other'
          severity: 'low' | 'medium' | 'high' | 'critical'
          incident_date: string
          description: string
          people_involved?: string | null
          location?: string | null
          evidence_url?: string | null
          status?: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
          admin_notes?: string | null
          resolution_notes?: string | null
          reported_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: number
          reporter_id?: string
          type?: 'accident' | 'health' | 'conflict' | 'logistics' | 'resources' | 'security' | 'equipment' | 'weather' | 'other'
          severity?: 'low' | 'medium' | 'high' | 'critical'
          incident_date?: string
          description?: string
          people_involved?: string | null
          location?: string | null
          evidence_url?: string | null
          status?: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
          admin_notes?: string | null
          resolution_notes?: string | null
          reported_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'incidents_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'incidents_reporter_id_fkey'
            columns: ['reporter_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'incidents_reviewed_by_fkey'
            columns: ['reviewed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      withdrawal_requests: {
        Row: {
          id: string
          enrollment_id: string
          user_id: string
          project_id: number
          reason: 'personal' | 'academic' | 'work' | 'health' | 'relocation' | 'schedule' | 'other'
          reason_details: string | null
          effective_date: string
          transition_availability: string | null
          additional_comments: string | null
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          requested_at: string
          reviewed_by: string | null
          reviewed_at: string | null
          reviewer_comments: string | null
        }
        Insert: {
          id?: string
          enrollment_id: string
          user_id: string
          project_id: number
          reason: 'personal' | 'academic' | 'work' | 'health' | 'relocation' | 'schedule' | 'other'
          reason_details?: string | null
          effective_date: string
          transition_availability?: string | null
          additional_comments?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          requested_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          reviewer_comments?: string | null
        }
        Update: {
          id?: string
          enrollment_id?: string
          user_id?: string
          project_id?: number
          reason?: 'personal' | 'academic' | 'work' | 'health' | 'relocation' | 'schedule' | 'other'
          reason_details?: string | null
          effective_date?: string
          transition_availability?: string | null
          additional_comments?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          requested_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          reviewer_comments?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'withdrawal_requests_enrollment_id_fkey'
            columns: ['enrollment_id']
            referencedRelation: 'enrollments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'withdrawal_requests_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'withdrawal_requests_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'withdrawal_requests_reviewed_by_fkey'
            columns: ['reviewed_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'new_project' | 'project_updated' | 'enrollment_approved' | 'enrollment_rejected' | 'goal_completed' | 'reminder' | 'general'
          title: string
          message: string
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'new_project' | 'project_updated' | 'enrollment_approved' | 'enrollment_rejected' | 'goal_completed' | 'reminder' | 'general'
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'new_project' | 'project_updated' | 'enrollment_approved' | 'enrollment_rejected' | 'goal_completed' | 'reminder' | 'general'
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
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
      user_role: 'volunteer' | 'admin'
      project_category: 'social' | 'environmental' | 'educational'
      project_status: 'available' | 'in_progress' | 'completed'
      approval_status: 'pending' | 'approved' | 'rejected'
      certificate_type: 'project' | 'date_range' | 'general'
      certificate_purpose: 'educational' | 'employment' | 'personal' | 'other'
      proposal_status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'needs_info'
      incident_type: 'accident' | 'health' | 'conflict' | 'logistics' | 'resources' | 'security' | 'equipment' | 'weather' | 'other'
      incident_severity: 'low' | 'medium' | 'high' | 'critical'
      incident_status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
      withdrawal_reason: 'personal' | 'academic' | 'work' | 'health' | 'relocation' | 'schedule' | 'other'
      withdrawal_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
      notification_type: 'new_project' | 'project_updated' | 'enrollment_approved' | 'enrollment_rejected' | 'goal_completed' | 'reminder' | 'general'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
