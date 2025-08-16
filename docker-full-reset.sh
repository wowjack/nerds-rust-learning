docker rm -f $(docker ps -aq)
docker volume prune -f
docker volume rm rust-learning-data
docker network prune -f
