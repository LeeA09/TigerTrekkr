from PIL import Image
from PIL.ExifTags import TAGS
import os
from datetime import datetime
import json


def getGPS(exif):
    north = exif['GPSInfo'][2]  # Latitude data in degrees, minutes, and seconds
    east = exif['GPSInfo'][4]   # Longitude data in degrees, minutes, and seconds

    # Convert latitude and longitude from degrees-minutes-seconds to decimal format
    lat = ((((north[0]*60) + north[1])*60) + north[2]) / 60 / 60
    lng = ((((east[0]*60) + east[1])*60) + east[2]) / 60 / 60

    # Convert to float for precise calculations
    return float(lat), float(lng)

def getClosestImageTimes(dtstr,imagelist,max_seconds=60):
    dt1=datetime.strptime(
        dtstr,
        "%Y:%m:%d %H:%M:%S")
    closest_diff = None
    matches = []

    for filename in imagelist:
        # filename = os.path.basename(filepath)
        parts = filename.split("_")

        try:
            file_dt = datetime.strptime(
                parts[1] + parts[2][:6],
                "%Y%m%d%H%M%S"
            )
        except (IndexError, ValueError):
            continue

        diff = abs((file_dt - dt1).total_seconds())

        if diff > max_seconds:
            continue

        if closest_diff is None or diff < closest_diff:
            closest_diff = diff
            matches = [filename]

        elif diff == closest_diff:
            matches.append(filename)

    return matches

# path to the image or video
pathname = "C:/Users/tessa/OneDrive - University of Missouri/Desktop/capstone/gpsphotos"

images = [f for f in os.listdir(pathname) if f.lower().endswith(('.jpg', '.jpeg'))]
threesixtypath="D:/cap_jpg_photos"
threesixties = [f for f in os.listdir(threesixtypath) if f.lower().endswith(('.jpg', '.jpeg'))]
# read the image data using PIL
# images = Image.open(imagename)
# print(images)
data=[]
# print(threesixties)
for img in images:
    image = Image.open(os.path.join(pathname, img))
    exifdata = image.getexif()
    exif = {
        TAGS[k]: v
        for k, v in image._getexif().items()
        if k in TAGS
    }
    time = exif['DateTime']
    # print(type(time))
    lat,lng=getGPS(exif)
    data.append({
        "imgname":img,
        "latitude":f"{lat:.5f}",
        "longitude":f"{lng:.5f}",
        "time":time,
        "description":"",
        "potentialimgmatches":getClosestImageTimes(time,threesixties)
        })
    image.close()

print(data)

with open("data.json", "w") as file:
    json.dump(data, file,indent=4)