from PIL import Image
import os


logo = Image.open(r"OVERLAY_IMAGE_PATH")
if logo.mode != 'RGBA':
        overlay = logo.convert('RGBA')

pathname = "D:/cap_editedjpg_photos"
images = [f for f in os.listdir(pathname) if f.lower().endswith(('.jpg', '.jpeg'))]
outputpath="D:/cap_logojpg_photos"

data=[]
# print(threesixties)
for img in images:
    image = Image.open(os.path.join(pathname, img))
    x=0
    y=image.size[2] - logo.size[2]
    image.paste(logo, (x,y), mask = logo)
    image = image.convert('RGB')
    image.save(os.path.join(outputpath, img))