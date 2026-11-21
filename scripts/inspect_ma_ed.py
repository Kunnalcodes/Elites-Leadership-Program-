with open(r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma', 'r', encoding='latin-1') as f:
    for i in range(12000):
        l = f.readline()
        if not l: break
        if '.ed[' in l:
            print("FOUND .ed:", l.strip()[:100])
            for j in range(10):
                print(f.readline().strip())
            break
