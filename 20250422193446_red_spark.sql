/*
  # Add admin policies for dictionary_words table

  1. Changes
    - Add RLS policy for admin user to insert records into dictionary_words
    - Add RLS policy for admin user to delete records from dictionary_words
    
  2. Security
    - Policies check if the user's email matches the hardcoded admin email
    - Maintains existing read-only policy for all users
*/

-- Create policy for admin to insert records
CREATE POLICY "Enable admin insert access"
ON dictionary_words
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'email' = 'radmond11@gmail.com'
);

-- Create policy for admin to delete records
CREATE POLICY "Enable admin delete access"
ON dictionary_words
FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'radmond11@gmail.com'
);