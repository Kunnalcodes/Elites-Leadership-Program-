with open(r'e:\threads-elite\SilverSurfer_Project\scenes\SilverSurfer.ma', 'r', encoding='latin-1') as f:
    for i in range(12000):
        l = f.readline()
        if not l: break
        if '-type "polyFaces"' in l:
            print("FOUND polyFaces header:", l.strip())
            for j in range(30):
                print(f.readline().strip())
            break
