import re

def export_maya_to_obj(ma_path, obj_path):
    meshes = {}
    
    target_meshes = {
        'silverSurfer_body_GEOShapeOrig': 'body',
        'silverSurfer_surfBoard_GEOShapeOrig1': 'surfboard',
        'silverSurfer_eyes_GEOShapeOrig': 'eyes',
    }
    
    for tm in target_meshes:
        meshes[tm] = {
            'vt': [],
            'uv': [],
            'ed': [],
            'faces': []
        }
        
    mode = None
    current_mesh = None
    
    with open(ma_path, 'r', encoding='latin-1') as f:
        for line in f:
            if line.startswith('createNode mesh'):
                m = re.search(r'-n "([^"]+)"', line)
                current_mesh = m.group(1) if m else None
                mode = None
                continue
                
            if current_mesh not in target_meshes:
                continue
                
            m_data = meshes[current_mesh]
            
            if '.vt[' in line:
                mode = 'vt'
                parts = line.split('.vt[')[1].split(']', 1)[1].strip().split()
                for p in parts:
                    clean = p.rstrip(';')
                    try:
                        m_data['vt'].append(float(clean))
                    except ValueError:
                        pass
                continue
            elif '.uvst[0].uvsp[' in line:
                mode = 'uv'
                parts = line.split('.uvsp[')[1].split(']', 1)[1].strip()
                if '-type "float2"' in parts:
                    parts = parts.split('-type "float2"')[1].strip()
                for p in parts.split():
                    clean = p.rstrip(';')
                    try:
                        m_data['uv'].append(float(clean))
                    except ValueError:
                        pass
                continue
            elif '.ed[' in line:
                mode = 'ed'
                parts = line.split('.ed[')[1].split(']', 1)[1].strip().split()
                for p in parts:
                    clean = p.rstrip(';')
                    try:
                        m_data['ed'].append(int(clean))
                    except ValueError:
                        pass
                continue
            elif '-type "polyFaces"' in line or (mode == 'fc' and line.startswith('\tsetAttr ".fc[')):
                mode = 'fc'
                continue
            elif line.startswith('\tsetAttr') or line.startswith('createNode'):
                mode = None
                continue
                
            # Content lines
            if mode == 'vt':
                for p in line.split():
                    clean = p.rstrip(';')
                    try:
                        m_data['vt'].append(float(clean))
                    except ValueError:
                        pass
            elif mode == 'uv':
                for p in line.split():
                    clean = p.rstrip(';')
                    try:
                        m_data['uv'].append(float(clean))
                    except ValueError:
                        pass
            elif mode == 'ed':
                for p in line.split():
                    clean = p.rstrip(';')
                    try:
                        m_data['ed'].append(int(clean))
                    except ValueError:
                        pass
            elif mode == 'fc':
                sline = line.strip()
                if sline.startswith('f '):
                    parts = []
                    for x in sline.split()[1:]:
                        clean = x.rstrip(';')
                        try:
                            parts.append(int(clean))
                        except ValueError:
                            pass
                    if parts:
                        count = parts[0]
                        edges = parts[1:1+count]
                        m_data['faces'].append({'edges': edges, 'uvs': []})
                elif sline.startswith('mu 0 ') or sline.startswith('mu 1 '):
                    if m_data['faces']:
                        parts = []
                        for x in sline.split()[2:]:
                            clean = x.rstrip(';')
                            try:
                                parts.append(int(clean))
                            except ValueError:
                                pass
                        if parts:
                            count = parts[0]
                            uvs = parts[1:1+count]
                            m_data['faces'][-1]['uvs'] = uvs

    print("Writing OBJ file...")
    v_offset = 1
    vt_offset = 1
    
    with open(obj_path, 'w', encoding='utf-8') as out:
        out.write("# Silver Surfer OBJ export\n")
        
        for m_name, group_name in target_meshes.items():
            data = meshes[m_name]
            vts = data['vt']
            uvs = data['uv']
            eds = data['ed']
            faces = data['faces']
            
            print(f"Processing {group_name}: {len(vts)//3} vertices, {len(uvs)//2} uvs, {len(eds)//3} edges, {len(faces)} faces")
            
            out.write(f"g {group_name}\n")
            out.write(f"usemtl {group_name}_mat\n")
            
            # Write vertices
            for i in range(0, len(vts), 3):
                out.write(f"v {vts[i]:.6f} {vts[i+1]:.6f} {vts[i+2]:.6f}\n")
                
            # Write UVs
            for i in range(0, len(uvs), 2):
                # Note: UDIM 1002 has u in [1, 2]. We write normalized or as-is
                out.write(f"vt {uvs[i]:.6f} {uvs[i+1]:.6f}\n")
                
            # Build edge lookup: edge_idx -> (v0, v1)
            edge_map = []
            for i in range(0, len(eds), 3):
                edge_map.append((eds[i], eds[i+1]))
                
            # Write faces
            for f in faces:
                edge_indices = f['edges']
                face_vts = []
                
                for e in edge_indices:
                    if e >= 0:
                        if e < len(edge_map):
                            v0, v1 = edge_map[e]
                            face_vts.append(v0)
                    else:
                        orig_e = -e - 1
                        if orig_e < len(edge_map):
                            v0, v1 = edge_map[orig_e]
                            face_vts.append(v1)
                        
                uv_indices = f['uvs']
                
                face_tokens = []
                for idx, v_idx in enumerate(face_vts):
                    v_num = v_offset + v_idx
                    if idx < len(uv_indices) and uv_indices[idx] < (len(uvs) // 2):
                        uv_num = vt_offset + uv_indices[idx]
                        face_tokens.append(f"{v_num}/{uv_num}")
                    else:
                        face_tokens.append(f"{v_num}")
                        
                if len(face_tokens) >= 3:
                    out.write("f " + " ".join(face_tokens) + "\n")
                
            v_offset += len(vts) // 3
            vt_offset += len(uvs) // 2

    print(f"Successfully exported {obj_path}!")

export_maya_to_obj(
    r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma',
    r'e:\threads-elite\public\SilverSurfer.obj'
)
