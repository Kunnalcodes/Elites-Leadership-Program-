import re

mesh_names = []
with open(r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma', 'r', encoding='latin-1') as f:
    for line in f:
        if line.startswith('createNode mesh'):
            m = re.search(r'-n "([^"]+)"', line)
            if m:
                mesh_names.append(m.group(1))

print("Meshes in scene:", mesh_names)
