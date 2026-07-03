from project.image_processor import generate_patterns_from_bytes

SCALE = 20
COLORS = 16

def main():
     with open("project/templates/pig.png", "rb") as f:
        image_bytes = f.read()

     generate_patterns_from_bytes(image_bytes, SCALE, COLORS)
     print("Генерация завершена успешно.")

if __name__ == "__main__":
    main()