import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig();
export const supabase = createClient(
    'https://cxkivqkfvuohkcpmgdoi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4a2l2cWtmdnVvaGtjcG1nZG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MjY0MDU4MCwiZXhwIjoxOTc4MjE2NTgwfQ.ez2wPVBrsN9m2EY3zNwabDAVQ9QlXZOjluQ_0duz8S8'
);