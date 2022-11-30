export type Project = {
  id?: string;
  title: string;
  zip_code: number;
  cost: number;
  deadline: Date;
  done?: boolean;
  username: string;
  created_at?: Date;
  update_at?: Date;
};
