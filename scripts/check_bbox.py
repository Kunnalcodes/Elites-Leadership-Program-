import re

def parse_vt(lines):
    # lines can contain floats
    vals = []
    for l in lines:
        for token in l.split():
            try:
                vals.append(float(token))
            except ValueError:
                pass
    pts = []
    for i in range(0, len(vals), 3):
        pts.append((vals[i], vals[i+1], vals[i+2]))
    return pts

with open(r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma', 'r', encoding='latin-1') as f:
    in_mesh = None
    collecting_vt = False
    vt_lines = []
    
    for line in f:
        if line.startswith('createNode mesh'):
            m = re.search(r'-n "([^"]+)"', line)
            if m:
                in_mesh = m.group(1)
        elif in_mesh in ['silverSurfer_body_GEOShapeOrig', 'silverSurfer_surfBoard_GEOShapeOrig1']:
            if '.vt[' in line:
                collecting_vt = True
                vt_lines = [line.split('.vt[')[1].split('"', 1)[-1].strip()]
            elif collecting_vt:
                if line.startswith('\tsetAttr') or line.startswith('createNode'):
                    collecting_vt = False
                    pts = parse_vt(vt_lines)
                    xs = [p[0] for p in pts]
                    ys = [p[1] for p in pts]
                    zs = [p[2] for p in pts]
                    print(f"{in_mesh}: {len(pts)} vertices")
                    print(f"  X: [{min(xs):.2f}, {max(xs):.2f}], Y: [{min(ys):.2f}, {max(ys):.2f}], Z: [{min(zs):.2f}, {max(zs):.2f}]")
                else:
                    vt_lines.append(line)
