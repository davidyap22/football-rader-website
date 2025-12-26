import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wykjlhbsxparltxazxmk.supabase.co';
const supabaseKey = 'sb_publishable_TNVqHZmoiVZhQLU2pHnvsg_B2gF-kmm';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Prematch {
  id: number;
  fixture_id: number;
  start_date_msia: string;
  venue_name: string;
  venue_city: string;
  status_short: string;
  league_name: string;
  league_logo: string;
  home_name: string;
  home_logo: string;
  away_name: string;
  away_logo: string;
  type: string;
}

export interface League {
  league_name: string;
  league_logo: string;
  count: number;
}
