
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get the authorization header from the request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization header is required' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Create a Supabase client with the auth header
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  try {
    // Check if we already have schools in the database
    const { data: existingSchools, error: checkError } = await supabase
      .from('schools')
      .select('*');

    if (checkError) {
      throw checkError;
    }

    // Only seed if we don't have any schools
    if (existingSchools && existingSchools.length === 0) {
      // Insert sample schools
      const schools = [
        {
          school_name: 'Westview High',
          district: 'Poway Unified',
          state: 'CA',
          mascot: 'Wolverines',
          colors: { primary: '#003366', secondary: '#FFD700' }
        },
        {
          school_name: 'Rancho Bernardo High',
          district: 'Poway Unified',
          state: 'CA',
          mascot: 'Broncos',
          colors: { primary: '#00205B', secondary: '#A80532' }
        },
        {
          school_name: 'Del Norte High',
          district: 'Poway Unified',
          state: 'CA',
          mascot: 'Nighthawks',
          colors: { primary: '#000080', secondary: '#C0C0C0' }
        },
        {
          school_name: 'Mt. Carmel High',
          district: 'Poway Unified',
          state: 'CA',
          mascot: 'Sundevils',
          colors: { primary: '#8B0000', secondary: '#FFD700' }
        }
      ];

      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .insert(schools)
        .select();

      if (schoolsError) {
        throw schoolsError;
      }

      // Insert badges for each school
      const badges = [];
      for (const school of schoolsData || []) {
        badges.push(
          {
            badge_name: 'Student',
            school_id: school.school_id,
            type: 'student'
          },
          {
            badge_name: 'Athlete',
            school_id: school.school_id,
            type: 'athlete'
          },
          {
            badge_name: 'Admin',
            school_id: school.school_id,
            type: 'admin'
          }
        );
      }

      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .insert(badges)
        .select();

      if (badgesError) {
        throw badgesError;
      }

      // Insert sample games
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;
      const games = [];

      // Upcoming games
      for (let i = 1; i <= 4; i++) {
        const gameDate = new Date(now.getTime() + (i * oneDay));
        games.push({
          home_team_id: schoolsData?.[i % schoolsData.length].school_id,
          away_team_id: schoolsData?.[(i + 1) % schoolsData.length].school_id,
          status: 'upcoming',
          sport_type: ['football', 'basketball', 'soccer', 'volleyball'][i % 4],
          start_time: gameDate.toISOString(),
          location: `${schoolsData?.[i % schoolsData.length].school_name} Stadium`
        });
      }

      // Live game
      games.push({
        home_team_id: schoolsData?.[0].school_id,
        away_team_id: schoolsData?.[1].school_id,
        home_score: 2,
        away_score: 1,
        status: 'live',
        sport_type: 'soccer',
        start_time: new Date(now.getTime() - (2 * 60 * 60 * 1000)).toISOString(),
        location: `${schoolsData?.[0].school_name} Field`,
        period: 2
      });

      // Completed games
      for (let i = 1; i <= 3; i++) {
        const gameDate = new Date(now.getTime() - (i * oneDay));
        const homeScore = Math.floor(Math.random() * 5);
        const awayScore = Math.floor(Math.random() * 5);
        games.push({
          home_team_id: schoolsData?.[i % schoolsData.length].school_id,
          away_team_id: schoolsData?.[(i + 2) % schoolsData.length].school_id,
          home_score: homeScore,
          away_score: awayScore,
          status: 'final',
          sport_type: ['basketball', 'football', 'volleyball'][i % 3],
          start_time: gameDate.toISOString(),
          location: `${schoolsData?.[i % schoolsData.length].school_name} Arena`,
          attendance: Math.floor(Math.random() * 500) + 200
        });
      }

      const { error: gamesError } = await supabase
        .from('games')
        .insert(games);

      if (gamesError) {
        throw gamesError;
      }

      return new Response(JSON.stringify({ 
        message: 'Sample data has been seeded successfully',
        schools: schoolsData?.length,
        badges: badgesData?.length,
        games: games.length
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        message: 'Data already exists, skipping seed operation',
        schools: existingSchools?.length
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})
