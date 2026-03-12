
import os

env_path = ".env"
key = "YOUR_API_KEY_HERE"

lines = []
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        lines = f.readlines()

new_lines = []
key_exists = False
for line in lines:
    line = line.strip()
    if not line: continue
    if line.startswith("OPENAI_API_KEY="):
        new_lines.append(f'OPENAI_API_KEY="{key}"')
        key_exists = True
    elif line.startswith("NEXTAUTH_SECRET="):
        # Clean up any fragmented secrets
        new_lines.append('NEXTAUTH_SECRET="bloggerpro_secret_key_change_me_to_something_secure"')
    else:
        new_lines.append(line)

if not key_exists:
    new_lines.append(f'OPENAI_API_KEY="{key}"')

with open(env_path, 'w') as f:
    f.write("\n".join(new_lines) + "\n")

print("Successfully updated .env file")
