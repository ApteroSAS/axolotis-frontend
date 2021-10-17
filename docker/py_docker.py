import sys
import os
    
dockerImage = "axolotis-frontend"
registry = "registry.aptero.co"
c = os.system
os.chdir("..")
print(os.getcwd())
if(sys.argv[1] == "build"):
    os.system("docker build -t "+dockerImage+" .")
 
elif(sys.argv[1] == "build_no_cache"):
    os.system("docker build --no-cache --progress=plain -t "+dockerImage+" .")

elif(sys.argv[1] == "publish"):
    import json
    f = open('package.json',)
    data = json.load(f)
    if data['version']:
        version = data['version']
    else:
        version = sys.argv[2]
    c("docker build -t "+dockerImage+" .") 
    c("docker login")
    c("docker tag "+dockerImage+":latest "+registry+"/"+dockerImage+":latest")
    c("docker push "+registry+"/"+dockerImage+":latest")

    c("docker tag "+dockerImage+":latest "+registry+"/"+dockerImage+":"+version)
    c("docker push "+registry+"/"+dockerImage+":"+version)
    print("tag version :"+version)

else:
    print("invalid usage");