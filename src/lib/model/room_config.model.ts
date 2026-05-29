export interface RoomConfig {
        room_map: string;
        amount: number;
        label: string;
        map_info: string;
        color: string;
        id: string;
    }

export interface RoomConfigResponse {
  success: boolean;
  data: RoomConfig[];
  error: string | null;
}