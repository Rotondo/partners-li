-- Add user-scoped RLS policies for field_configs table
-- Allow users to view their own field configs
CREATE POLICY "Users can view own field configs"
ON field_configs FOR SELECT
USING (user_id = auth.uid());

-- Allow users to insert their own field configs
CREATE POLICY "Users can create own field configs"
ON field_configs FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own field configs
CREATE POLICY "Users can update own field configs"
ON field_configs FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own field configs
CREATE POLICY "Users can delete own field configs"
ON field_configs FOR DELETE
USING (user_id = auth.uid());