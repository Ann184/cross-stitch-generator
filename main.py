from image_processor import generate_patterns

SCALE = 20
COLORS = 16

def main():
     generate_patterns("pig.png", SCALE, COLORS)

if __name__ == "__main__":
    main()