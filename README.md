# Signed Front-End Uploads With S3/MinIO using `@aws-sdk/client-s3`

This minimal repo demonstrates how to upload files directly to S3 from a front-end application using signed URLs. The repo uses MinIO as a local S3 alternative so that the code can be run without creating a bucket on a cloud provider.

The front-end code is written without a front-end framework in order to maximize portability. The back-end code that generates the signed URLs uses Node.js and Express.

## Requirements

This project requires Bash, Docker and Docker Compose.

## Installation

A Bash set-up script has been included with this repo. It will do the following when executed:

- Install npm dependencies on the host machine for both the `frontend` and `backend` services.
- Create an `uploads` bucket in MinIO.

You can run the set-up script from the main project directory with the following command:

```sh
./bin/set-up-local
```

## Running the project

If you're using Docker Desktop on MacOS or Windows, you can start the project by running the following command from the main project directory:

```sh
docker-compose up
```

If you are running Docker on Linux and _not_ using Docker Desktop, starting the project with `docker-compose up` may cause permission conflicts between the containers and the host. A script has been included to run the project on Linux while mitigating permission conflicts:

```sh
./bin/run
```

Once the project is running, you can view it in the browser by visiting http://localhost:3000.

## Viewing uploads in MinIO

After uploading files, you can view the uploads in the MinIO console at http://localhost:9090. From there, you can log into MinIO with the following credentials:

username: `admin`

password: `password`
