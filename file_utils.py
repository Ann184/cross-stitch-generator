def save_pallete(color_list):
    with open(f"pallete.txt", "w") as txt:
        for count, rgb in color_list:
            txt.write(f"R:{rgb[0]}, G:{rgb[1]}, B:{rgb[2]}, numbers:{count}\n")