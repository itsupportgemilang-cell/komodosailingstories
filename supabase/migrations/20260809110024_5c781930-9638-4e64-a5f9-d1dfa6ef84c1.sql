
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

DROP POLICY "packages_public_read" ON public.packages;
CREATE POLICY "packages_anon_read" ON public.packages FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "packages_auth_read" ON public.packages FOR SELECT TO authenticated USING (is_published = true OR public.is_admin(auth.uid()));

DROP POLICY "destinations_public_read" ON public.destinations;
CREATE POLICY "destinations_anon_read" ON public.destinations FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "destinations_auth_read" ON public.destinations FOR SELECT TO authenticated USING (is_published = true OR public.is_admin(auth.uid()));

DROP POLICY "articles_public_read" ON public.articles;
CREATE POLICY "articles_anon_read" ON public.articles FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "articles_auth_read" ON public.articles FOR SELECT TO authenticated USING (is_published = true OR public.is_admin(auth.uid()));

DROP POLICY "testimonials_public_read" ON public.testimonials;
CREATE POLICY "testimonials_anon_read" ON public.testimonials FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "testimonials_auth_read" ON public.testimonials FOR SELECT TO authenticated USING (is_published = true OR public.is_admin(auth.uid()));
