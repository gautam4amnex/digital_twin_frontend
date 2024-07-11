CREATE OR REPLACE FUNCTION public.fn_web_delete_streetlight_arms(
    jsonarray text)
    RETURNS TABLE(data text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
DECLARE
    _gid integer;
    _street_arm_id integer;
    jsonObject JSON;
    pole_arms_json JSON;
    i JSON;
    sql_query text;
BEGIN
-- 		select * from public.tbl_web_street_arms order by gid desc limit 10;
-- 		select * from public.shp_street_lights order by gid desc limit 10;
--      select * from tbl_error_log order by created_on desc limit 10
-- SELECT fn_web_delete_streetlight_arms('{ "gif":"","pole_arms": [{ "street_arm_id":"48"  }]}'); 

    jsonObject := CAST(jsonarray AS JSON);
    RAISE NOTICE 'value of jsonObject: %', jsonObject;
    pole_arms_json := jsonObject -> 'pole_arms';
    RAISE NOTICE 'value of pole_arms: %', pole_arms_json;
    _gid := (jsonObject ->> 'gid')::integer;
   
    IF _gid IS NOT NULL THEN
			delete from  public.tbl_web_street_arms where gid=_gid;  RAISE NOTICE 'child items deleted';
			delete from  public.shp_street_lights where  gid=_gid;
			sql_query := 'SELECT json_build_object(''responseCode'', 200, ''responseMessage'', ''shp_street_lights data deleted successfully'', ''status'', ''success'')::text as data';
    ELSE 
		 	FOR i IN SELECT * FROM json_array_elements(pole_arms_json)
        	LOOP
          		 _street_arm_id            := i ->> 'street_arm_id';
             	 delete from  public.tbl_web_street_arms where street_arm_id=_street_arm_id;
                 RAISE NOTICE 'child deletd %',_street_arm_id;
			 END LOOP;
			 sql_query := 'SELECT json_build_object(''responseCode'', 200, ''responseMessage'', '' tbl_web_street_arms data deleted successfully'', ''status'', ''success'')::text as data';
	END IF;		 

    RETURN QUERY EXECUTE sql_query;

EXCEPTION
    WHEN OTHERS THEN
        DECLARE
            p_errormessage VARCHAR(4000);
            p_errorstate VARCHAR(4000);
            p_errorline VARCHAR(4000);
        BEGIN
            p_errormessage := SQLERRM;
            p_errorstate := SQLSTATE;
            GET STACKED DIAGNOSTICS p_errorline = PG_EXCEPTION_CONTEXT;

            INSERT INTO tbl_error_log (
                error_name, error_callstack, error_method, created_on
            ) VALUES (
                p_errorline, p_errormessage || 'fn_web_delete_streetlight_arms', p_errorstate, timezone('Asia/Kolkata'::text, now())
            );

            sql_query := 'SELECT json_build_object(''responseCode'', 201, ''responseMessage'', ''failed'')::text as data';
            RETURN QUERY EXECUTE sql_query;
        END;
END;
$BODY$;
