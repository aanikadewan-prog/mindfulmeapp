-- Create vent conversations table for saving chat history
CREATE TABLE vent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE vent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON vent_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON vent_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON vent_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON vent_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Create vent messages table for storing individual messages
CREATE TABLE vent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES vent_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE vent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations"
  ON vent_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vent_conversations 
      WHERE vent_conversations.id = vent_messages.conversation_id 
      AND vent_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON vent_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vent_conversations 
      WHERE vent_conversations.id = vent_messages.conversation_id 
      AND vent_conversations.user_id = auth.uid()
    )
  );

-- Create rewards/achievements table
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_type TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB
);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards"
  ON user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rewards"
  ON user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create check-ins table for server-side streak tracking
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check-ins"
  ON check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-update conversation timestamp
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vent_conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update conversation timestamp when new message added
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON vent_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Create indexes for better performance
CREATE INDEX idx_vent_conversations_user_id ON vent_conversations(user_id);
CREATE INDEX idx_vent_messages_conversation_id ON vent_messages(conversation_id);
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX idx_check_ins_created_at ON check_ins(user_id, created_at DESC);