-- ============================================================================
-- ⚠️ AVERTISSEMENT LEGAL : LICENCE INDIVIDUELLE STRICTEMENT PERSONNELLE
-- ============================================================================
-- Ce code source est protégé par les lois sur le droit d'auteur.
-- ❌ REVENTE INTERDITE
-- ❌ PARTAGE INTERDIT (Même à titre gratuit)
-- ❌ REDISTRIBUTION INTERDITE
-- 
-- Toute violation de cette licence entraînera des poursuites judiciaires 
-- immédiates et la révocation des accès liés à l'architecture Supabase.
-- ============================================================================

-- ====================================================================
-- SCRIPT SQL DE SÉCURITÉ & CONFIGURATION BDD SUPABASE
-- À exécuter une seule fois dans l'éditeur SQL de votre Dashboard Supabase.
-- ====================================================================

-- 1. CREATION DE LA TABLE PORTFOLIO_DATA
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    json_content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT portfolio_user_unique UNIQUE (user_id)
);

-- 2. ACTIVATION DE LA SÉCURITÉ AU NIVEAU DES LIGNES (Row Level Security - RLS)
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- 3. POLITIQUE 1 : LECTURE PUBLIQUE (Chaque visiteur du site peut voir votre portfolio)
DROP POLICY IF EXISTS "Public Read Access" ON public.portfolio_data;
CREATE POLICY "Public Read Access" 
ON public.portfolio_data 
FOR SELECT 
USING (true);

-- 4. POLITIQUE 2 : ÉCRITURE RESTREINTE (Seul vous, le propriétaire authentifié, pouvez modifier votre portfolio)
DROP POLICY IF EXISTS "Owner Write Access" ON public.portfolio_data;
CREATE POLICY "Owner Write Access" 
ON public.portfolio_data 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
