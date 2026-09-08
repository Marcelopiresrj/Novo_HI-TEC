const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function test() {
  console.log("Testing insert post...");
  const { error: postError } = await supabase.from('posts').upsert({
    id: 'test_123',
    post_data: { test: true }
  });
  console.log("Post error:", postError);

  console.log("Testing upload media...");
  const { error: storageError } = await supabase.storage.from('media').upload('test.txt', 'hello world', { upsert: true });
  console.log("Storage error:", storageError);
  
  if(!storageError) {
      await supabase.storage.from('media').remove(['test.txt']);
  }
}
test();
