import re

transforms = {}
current_node = None

with open(r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma', 'r', encoding='latin-1') as f:
    for line in f:
        if line.startswith('createNode transform'):
            m = re.search(r'-n "([^"]+)"', line)
            if m:
                current_node = m.group(1)
                transforms[current_node] = {}
        elif current_node and line.startswith('\tsetAttr '):
            parts = line.strip().split()
            if len(parts) >= 2:
                attr = parts[1]
                if attr in ['.t', '.r', '.s']:
                    transforms[current_node][attr] = parts[2:]

for k, v in transforms.items():
    if v:
        print(k, v)
