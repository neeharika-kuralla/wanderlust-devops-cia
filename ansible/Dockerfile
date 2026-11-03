
FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssh-client && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir ansible docker

RUN ansible-galaxy collection install community.docker

WORKDIR /ansible

CMD ["ansible", "--version"]
