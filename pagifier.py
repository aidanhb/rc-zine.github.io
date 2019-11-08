import math
import sys

page_format = (
"""
PAGE {}: {}
+-----+-----+
| {} | {} |
+-----+-----+
| {} | {} |
+-----+-----+
"""
)

def pad_to_n(s, n):
    s = str(s)
    padding = " " * (n - len(s))
    return s + padding

def thresh(num, thresh):
    if num < thresh:
        return num
    return "X"

def get_layout(n, offset):
    layout_pages = n
    if n % 8 != 0:
        layout_pages += 8 - (n % 8)
    fronts = []
    backs = []
    for i in range(layout_pages // 2):
        if i % 2 == 0:
            page = (thresh(layout_pages - (i + 1) + offset, n + offset),
                    thresh(i + offset, n + offset))
            fronts.append(page)
        else:
            page = (thresh(i + offset, n + offset),
                    thresh(layout_pages - (i + 1) + offset, n + offset))
            backs.append(page)

    return list(zip(fronts, backs))

if __name__ == "__main__":
    [n, offset] = sys.argv[1:]
    pages = get_layout(int(n), int(offset))
    print(pages)
    for index in range(0, len(pages), 2):
        top_front = pages[index][0]
        bottom_front = pages[index + 1][0]
        top_back = pages[index][1]
        bottom_back = pages[index + 1][1]
        total_front = (*top_front, *bottom_front)
        total_back = (*top_back, *bottom_back)
        page_no = index // 2
        print(page_format.format(
            page_no,
            "FRONT",
            pad_to_n(total_front[0], 3),
            pad_to_n(total_front[1], 3),
            pad_to_n(total_front[2], 3),
            pad_to_n(total_front[3], 3)))
        print(page_format.format(
            page_no,
            "BACK",
            pad_to_n(total_back[0], 3),
            pad_to_n(total_back[1], 3),
            pad_to_n(total_back[2], 3),
            pad_to_n(total_back[3], 3)))