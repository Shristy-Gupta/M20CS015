# Course CSL7510 Virtualization and Cloud Computing
### Assessment 1: Virtual Machines & Dockers
### Question 2) Docker Application Deployment
### Submitted By: Shristy Gupta M20CS015
### Submitted To: Dr. Sumit Kalra

### Web App Name: Sudoku
Web App functionality
1) Sudoku is a simple webapp that is developed using HTML, Javascript and CSS 
2) This is a game is a math puzzle and the objective is to fill the empty sqaures using numbers 1-9 exactly once each row, column and nine 3 X 3 grid
3) After filling all the sqaures the verify button will verify the puzzle and send the message if won!

![image](https://user-images.githubusercontent.com/26459890/131553015-8b81b99c-03ab-42b1-b70d-7d6b48ec6f37.png)


### Steps Followed for deploying on Docker:
1) Installed the docker for windows from docker toolbox, since the virtualbox and docker has conflicting configurations (Hyper-V conflict) from https://docs.docker.com/desktop/windows/install/ 
2) Created account docker hub with username shristy26 and a new repository shristy26/m20cs015server
``` sh
FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install apache2 -y
RUN apt-get install apache2-utils -y
RUN apt-get clean
EXPOSE 80
CMD ["apache2ctl","-D","FOREGROUND"]
```
![image](https://user-images.githubusercontent.com/26459890/131547012-d4eeb469-cf38-44ed-99db-779f67a2db90.png)
3) Created a dockerfile in m20cs015server which creates ubuntu as base image. On top of the base image installed apache2 for creating a new docker image from scratch. The code for the same is available in m20cs015server folder in "Dockerfile" 
4) In order to pull the image in sudokuwebapp (in order to deploy it) pushed the image to docker hub webserver 
``` sh
docker build . -t m20cs015server
docker image build -t shristy26/m20cs015server:ver1 .
docker image push shristy26/m20cs015server:ver1
```
After successful execution I could see the tag in docker hub as follows with Digest as sha256:a4c5a1a49d3b696898ecd75263de99fb1afefd7509a147b1ad33de7d4957280e
![image](https://user-images.githubusercontent.com/26459890/131549740-d9318bf8-2980-43f8-adf6-24d0c7aab6a7.png)
5) After creating the webapp pulled the image from docker hub. Then created the work directory to run the server on local host. Then in order to host files into the container made the dockerFolder directory and copied into the working dorectory. The same code can be found in m20cs015webapp\sudoku\dockerfile

``` sh
FROM shristy26/m20cs015server:ver1
WORKDIR /var/www/html
RUN mkdir dockerFolder
WORKDIR /var/www/html/dockrFolder
COPY . /var/www/html/dockerFolder/
``` 
6) To build docker image of the webapp :
``` sh
docker build .  -t m20cs015
```
7) To run this image in specific port used following command
``` sh
docker run -it -p 8000:80 m20cs015
```
8) Finally the app will run on url: http://localhost:8000/dockerFolder/

### Steps to run Sudoku App 
1) Either download the zip folder of this repo or clone this repo using :
