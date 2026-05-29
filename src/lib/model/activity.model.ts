export interface ActivityInfo {
        description: string;
        activity_name: string;
        ticket_max_session: number;
        date_start: string;
        id: string;
        day: number;
        dow: number;
        month: number;
        year: number;
        public_name: string;
        amount: number;
        places_name: string;
        url: string | null;
    }

export interface ActivityResponse {
  success: boolean;
  data: ActivityInfo[];
  error: string | null;
}