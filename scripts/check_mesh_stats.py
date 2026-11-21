import re

current_mesh = None
mesh_stats = {}

with open(r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma', 'r', encoding='latin-1') as f:
    for line in f:
        if line.startswith('createNode mesh'):
            m = re.search(r'-n "([^"]+)"', line)
            if m:
                current_mesh = m.group(1)
                mesh_stats[current_mesh] = {'vt': 0, 'ed': 0, 'fc': 0, 'uv': 0}
        elif current_mesh:
            if '.vt[' in line:
                m = re.search(r'\.vt\[\d+:(\d+)\]', line)
                if m:
                    mesh_stats[current_mesh]['vt'] = int(m.group(1)) + 1
            elif '.ed[' in line:
                m = re.search(r'\.ed\[\d+:(\d+)\]', line)
                if m:
                    mesh_stats[current_mesh]['ed'] = int(m.group(1)) + 1
            elif '.fc[' in line:
                m = re.search(r'\.fc\[\d+:(\d+)\]', line)
                if m:
                    mesh_stats[current_mesh]['fc'] = int(m.group(1)) + 1
            elif '.uvst[0].uvsp[' in line:
                m = re.search(r'\.uvsp\[\d+:(\d+)\]', line)
                if m:
                    mesh_stats[current_mesh]['uv'] = int(m.group(1)) + 1

for k, v in mesh_stats.items():
    print(f"{k:35} -> {v}")
