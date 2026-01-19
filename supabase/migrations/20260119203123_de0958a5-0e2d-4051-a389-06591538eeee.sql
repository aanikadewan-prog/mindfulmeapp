-- Fix: Add admin role check inside update_user_analytics() function
CREATE OR REPLACE FUNCTION public.update_user_analytics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Security check: Only allow admins to execute this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;

  UPDATE user_analytics SET
    total_users = (SELECT COUNT(DISTINCT id) FROM auth.users),
    active_today = (SELECT COUNT(DISTINCT user_id) FROM check_ins WHERE created_at >= CURRENT_DATE),
    active_this_week = (SELECT COUNT(DISTINCT user_id) FROM check_ins WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    total_check_ins = (SELECT COUNT(*) FROM check_ins),
    avg_mood = (SELECT AVG(mood) FROM check_ins),
    updated_at = now();
END;
$function$;