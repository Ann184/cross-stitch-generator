from PIL import Image
from file_utils import save_pallete
import io

def generate_patterns_from_bytes(image_bytes, scale, colors):
    try:
        with Image.open(io.BytesIO(image_bytes)) as image:
            new_size = proccess_image(image.size[0], image.size[1], scale)
            small_image = image.resize(new_size, Image.NEAREST)
            pattern_image = small_image.quantize(colors=colors).convert("RGB")
            save_pallete(pattern_image.getcolors(maxcolors=256))
            return pattern_image
            
    except FileNotFoundError:
        print("Не удалось найти файл")

def proccess_image(image_width, image_height, scale):
    return image_width // scale, image_height // scale