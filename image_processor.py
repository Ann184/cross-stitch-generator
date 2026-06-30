from PIL import Image
from file_utils import save_pallete

def generate_patterns(image_path, scale, colors):
    try:
        with Image.open(image_path) as image:
            new_size = proccess_image(image.size[0], image.size[1], scale)
            small_image = image.resize(new_size, Image.NEAREST)
            pattern_image = small_image.quantize(colors=colors).convert("RGB")
            pattern_image.save("pixelated_pig.png")
            save_pallete(pattern_image.getcolors(maxcolors=256))
    except FileNotFoundError:
        print("Не удалось найти файл")

def proccess_image(image_width, image_height, scale):
    return image_width // scale, image_height // scale