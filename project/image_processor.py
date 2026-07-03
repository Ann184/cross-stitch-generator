from PIL import Image, ImageDraw
from project.file_utils import save_pallete
import io

def generate_patterns_from_bytes(image_bytes, target_width, colors):
    try:
        with Image.open(io.BytesIO(image_bytes)) as image:
            new_size = proccess_image(image.size[0], image.size[1], target_width)
            small_image = image.resize(new_size, Image.NEAREST)
            pattern_image = small_image.quantize(colors=colors).convert("RGB")
            save_pallete(pattern_image.getcolors(maxcolors=256))
            grid, width, height = get_pixel_matrix(pattern_image)
            return {
                "grid": grid,
                "width": width,
                "height": height
            }
            
    except Exception as e:
        print(f"Ошибка: {e}")
        return None

def proccess_image(image_width, image_height, target_width):
    aspect_ratio = image_height / image_width #коэф пропорции

    new_width = target_width
    new_height = int(target_width*aspect_ratio)
    return new_width, new_height

def get_pixel_matrix(pattern_image):
    width, height = pattern_image.size
    pixels = list(pattern_image.getdata())

    grid = []
    for y in range(0, height):
        row = []
        for x in range(0, width):
            index = y * width + x
            (r, g, b) = pixels[index]
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
            row.append(hex_color)
        grid.append(row)
        
    return grid, width, height