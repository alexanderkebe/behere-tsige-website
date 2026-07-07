-- ============================================================================
-- Update church school sectionTitle in site_content JSONB
-- ============================================================================

update public.site_content
set data = jsonb_set(data, '{am, sectionTitle}', '"መንፈሳዊ የቤተ ክርስቲያን ትምህርት ቤት"')
where section = 'churchSchool';
