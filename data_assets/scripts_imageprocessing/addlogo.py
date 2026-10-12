from PIL import Image
import os


logo = Image.open(r"pano_logo.jpg")
if logo.mode != 'RGBA':
        overlay = logo.convert('RGBA')

pathname = "D:/cap_editedjpg_photos"

images = [f for f in os.listdir(pathname) if f.lower().endswith(('.jpg', '.jpeg'))]
outputpath="D:/cap_logojpg_photos"


data=[]
# print(threesixties)
for img in images:
    image = Image.open(os.path.join(pathname, img))
#     print(f"orig image: {image.size[0]} {image.size[1]}")
    target_width = image.size[0]
    original_width, original_height = logo.size
    width_ratio = target_width / float(original_width)
    target_height = int(original_height * width_ratio)
#     print(f"orig logo: {logo.size[0]} {logo.size[1]}")
    
    resized_logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
#     print(f"resized: {resized_logo.size[0]} {resized_logo.size[1]}")
    x=0
    y=image.size[1] - resized_logo.size[1]
    image.paste(resized_logo, (x,y))
    image = image.convert('RGB')
    image.save(os.path.join(outputpath, img))