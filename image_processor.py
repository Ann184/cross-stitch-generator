from PIL import Image
from file_utils import save_pallete
import io

def generate_patterns_from_bytes(image_bytes, target_width, colors):
    try:
        with Image.open(io.BytesIO(image_bytes)) as image:
            new_size = proccess_image(image.size[0], image.size[1], target_width)
            small_image = image.resize(new_size, Image.NEAREST)
            pattern_image = small_image.quantize(colors=colors).convert("RGB")
            save_pallete(pattern_image.getcolors(maxcolors=256))
            return pattern_image
            
    except Exception as e:
        print(f"Ошибка: {e}")
        return None

def proccess_image(image_width, image_height, target_width):
    aspect_ratio = image_height / image_width #коэф пропорции

    new_width = target_width
    new_height = int(target_width*aspect_ratio)
    return new_width, new_height