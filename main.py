from PIL import Image

def generate_patterns():
    with Image.open(f"pig.png") as image:
        new_size = proccess_image(image.size[0], image.size[1])
        small_image = image.resize(new_size, Image.NEAREST)
        small_image.save("pixelated_pig.png")

        
def proccess_image(image_width, image_height):
    scale = 20
    new_image_width = image_width // scale
    new_image_height = image_height // scale 
    return new_image_width, new_image_height


def main():
     generate_patterns()

if __name__ == "__main__":
    main()