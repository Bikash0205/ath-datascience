with open('ath_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'brand-svg-logo' in line:
        print(f"Found on line {i+1}")
        # print next 30 lines
        for j in range(max(0, i-2), min(len(lines), i+40)):
            print(f"{j+1}: {lines[j]}", end='')
        break
