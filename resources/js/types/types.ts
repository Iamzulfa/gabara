import { PageProps as InertiaPageProps } from "@inertiajs/core";

export interface User {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    email?: string;
    phone?: string;
    gender?: string;
    birthdate?: string;
}

export interface Meeting {
    id: string;
    class_id: string;
    title: string;
    description: string;
    created_at: string;
    materials: Material[];
    assignments: Assignment[];
}

export interface Material {
    id: string;
    meeting_id: string;
    link: string;
    created_at: string;
}

export interface Assignment {
    id: string;
    meeting_id: string;
    title: string;
    description: string;
    date_open: string;
    time_open: string;
    date_close: string;
    time_close: string;
    file_link?: string;
    created_at: string;
    class_id?: string;
    class_name?: string;
}

export interface Discussion {
    id: string;
    class_id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
}

export interface Enrollment {
    id: string;
    student: User;
}

export interface Class {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    visibility: boolean;
    academic_year_tag: string;
    mentor_id: string;
    public_id?: string;
    created_at: string;
    updated_at: string;
    mentor: User;
    meetings: Meeting[];
    materials: Material[];
    discussions: Discussion[];
    enrollments: Enrollment[];
}

export interface Submission {
    id: string;
    assignment_id: string;
    student_id: string;
    student_name: string;
    submitted_at?: string;
    submission_content?: string;
    grade?: number;
}

export interface MeetingForm {
    title: string;
    description: string;
    materials: MaterialForm[];
    assignments: AssignmentForm[];
}

export interface MaterialForm {
    link: string;
    id?: string;
}

export interface AssignmentForm {
    title: string;
    description: string;
    date_open: string;
    time_open: string;
    date_close: string;
    time_close: string;
    file_link?: string;
    id?: string;
}

export interface PageProps extends InertiaPageProps {
    class: Class;
    auth: {
        user: User;
    };
    userRole: string;
}

export interface AssignmentPageProps extends InertiaPageProps {
    auth: {
        user: {
            id: string;
            name: string;
            role?: string;
        };
    };
    assignment: Assignment;
    submissions?: Submission[];
}

export interface CourseTabProps {
    classData: Class;
}

export interface DiscussionTabProps {
    classData: Class;
}

export interface ParticipantsTabProps {
    classData: Class;
}

export interface ClassDetailCardProps {
    classData: Class;
    userRole: string;
}
